import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getChallengeDetails, submitWork, getSubmissions } from "../../utils/api/challenges";
import { fetchBrandLogoUrl } from "../../utils/api/admin";
import { SponsorChallengeDetail, Submission } from "../../utils/types"; // Updated import
import { ImagePlus, Info } from "lucide-react";
import { ButtonLong, ButtonCTA } from "../../components/Buttons";
import "../../css/challenges/challengeDetail.css";
import { getCsrfTokenFromCookie } from "../../utils/api";

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const [challenge, setChallenge] = useState<SponsorChallengeDetail | null>(null);
  const [brandLogoUrl, setBrandLogoUrl] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [visibleSubmissions, setVisibleSubmissions] = useState<Submission[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!challengeId) return;
        const challengeData = await getChallengeDetails(challengeId);
        setChallenge(challengeData);

        if (challengeData.brand_logo_id) {
          const logoUrl = await fetchBrandLogoUrl(challengeData.brand_logo_id);
          setBrandLogoUrl(logoUrl);
        }

        // Fetch submissions for the challenge
        const submissionsData = await getSubmissions(challengeId);
        setSubmissions(submissionsData);
        setVisibleSubmissions(submissionsData.slice(0, 5)); // Show only 5 submissions initially
        setHasMore(submissionsData.length > 5);
      } catch (error) {
        console.error("Error fetching challenge details:", error);
        setErrorMessage("Failed to load challenge details. Please try again later.");
      }
    };

    fetchData();
  }, [challengeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setErrorMessage("Please upload an image before submitting.");
      return;
    }

    try {
      // Step 1: Get the CSRF token
      const csrfToken = getCsrfTokenFromCookie();
      if (!csrfToken) {
        throw new Error("CSRF token is missing");
      }

      // Step 2: Create the FormData object
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("description", description);

      // Step 3: Submit the work with the CSRF token
      const newSubmission = await submitWork(challengeId ?? 'default-challenge-id', formData, csrfToken);

      // Step 4: Handle the response
      setShowForm(false);
      setImageFile(null);
      setDescription("");
      alert("Work submitted successfully!");

      // Update submissions
      setSubmissions((prevState) => [newSubmission, ...prevState]);
      setVisibleSubmissions((prevState) => [newSubmission, ...prevState].slice(0, 5)); // Show only 5 submissions
    } catch (error) {
      alert("Failed to submit work");
      console.error("Error submitting work:", error);
    }
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const loadMoreSubmissions = () => {
    const nextBatch = submissions.slice(visibleSubmissions.length, visibleSubmissions.length + 5);
    setVisibleSubmissions((prev) => [...prev, ...nextBatch]);
    setHasMore(submissions.length > visibleSubmissions.length + nextBatch.length);
  };

  if (!challenge) return <p>Loading challenge details...</p>;

  return (
    <div className="challange-details">
      <div className="challenge-detail-container">
        {/* Hero Section with Brand Logo */}
        <section className="hero-section">
          {brandLogoUrl && <img src={brandLogoUrl} alt={challenge.brand_name} className="brand-logo" />}
          <h1 className="brand-name">{challenge.brand_name}</h1>
          <h2 className="challenge-detail-title">{challenge.title}</h2>
          <p className="challenge-detail-brief">{challenge.brief}</p>
          <p className="deadline">Deadline: {challenge.submission_deadline}</p>
          <ButtonLong onClick={() => setShowForm(true)} text="Submit" />
        </section>

        {/* Submission Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={() => setShowForm(false)}>&times;</button>
              <h2>Submit Your Artwork</h2>
              <form onSubmit={handleSubmit} className="artwork-submit-form">
                <div className="form-group artwork-image">
                  <label className="form-label" onClick={handleIconClick}>
                    <ImagePlus size={50} color="#131313" className="image-icon" />
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="file-input"
                    className="form-input"
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    style={{ display: "none" }}
                    accept="image/*" // You can specify accepted file types here
                  />
                  {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="image-preview" />}
                </div>

                <div className="form-group artwork-description">
                  <label className="form-label">Description:</label>
                  <div className="textarea-container">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter artwork description"
                      className="form-detail-textarea"
                    />
                    <button
                      className="info-button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowInfo(true);
                      }}
                      aria-label="Show information"
                    >
                      <Info size={20} color="#888" />
                    </button>
                  </div>
                  {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>

                <div className="form-group">
                  <ButtonCTA text="Submit Artwork" link="#" onClick={handleSubmit} />
                </div>

                {/* Info Modal */}
                {showInfo && (
                  <div className="info-modal">
                    <div className="info-modal-content">
                      <button className="info-close-button" onClick={() => setShowInfo(false)}>&times;</button>
                      <p>When you submit an artwork, it will be reviewed to ensure it matches the current theme. After approval, your artwork will appear on your profile for everyone to admire!</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Submissions Gallery */}
        <section className="submissions-gallery">
          <h2>Submissions</h2>
          <div className="submissions-container">
            {visibleSubmissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <img src={submission.image_path} alt="Submission" />
                <p>{submission.description}</p>
              </div>
            ))}
          </div>
          {hasMore && (
            <button className="load-more-button" onClick={loadMoreSubmissions}>
              Load More
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChallengeDetail;
