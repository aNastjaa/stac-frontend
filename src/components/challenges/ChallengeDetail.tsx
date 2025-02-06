import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getChallengeDetails, submitWork, getSubmissions } from "../../utils/api/challenges";
import { fetchBrandLogoUrl } from "../../utils/api/admin";
import { SponsorChallengeDetail, Submission } from "../../utils/types";
import { ImagePlus, Info } from "lucide-react";
import { ButtonLong, ButtonCTA, ButtonPrimary } from "../../components/Buttons";
import SubmissionCard from "../../components/challenges/SubmissionCard";
import FullScreenSubmission from "../../components/challenges/FullScreenSubmission";
import "../../css/challenges/challengeDetail.css";
import { getCsrfTokenFromCookie } from "../../utils/api";
import FullScreenProUpgrade from "../FullScreenProUpgrade";

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
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [role, setRole] = useState<string>("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setRole(parsedUser.role_name || ""); // Ensure role is properly set
      } catch (error) {
        console.error("Error parsing auth_user from localStorage:", error);
      }
    }
  }, []);
  
  console.log("User role:", role);

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

        // Fetch all submissions and filter accepted ones
        const submissionsData = await getSubmissions(challengeId);
        const acceptedSubmissions = submissionsData.filter((submission) => submission.status === "accepted");
        setSubmissions(acceptedSubmissions);
        setVisibleSubmissions(acceptedSubmissions.slice(0, 6));
        setHasMore(acceptedSubmissions.length > 6);
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
      const csrfToken = getCsrfTokenFromCookie();
      if (!csrfToken) {
        throw new Error("CSRF token is missing");
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("description", description);

      const newSubmission = await submitWork(challengeId ?? 'default-challenge-id', formData, csrfToken);

      setShowForm(false);
      setImageFile(null);
      setDescription("");
      setErrorMessage(null);

      // Add new submission and re-filter
      setSubmissions((prevState) => {
        const updatedSubmissions = [newSubmission, ...prevState];
        const acceptedSubmissions = updatedSubmissions.filter((submission) => submission.status === "accepted");
        setVisibleSubmissions(acceptedSubmissions.slice(0, 6));
        setHasMore(acceptedSubmissions.length > 6);
        return acceptedSubmissions;
      });

      alert("Work submitted successfully!");

    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to submit work");
      }
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

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const closeFullScreenSubmission = () => {
    setSelectedSubmission(null);
  };

  const handleSubmissionDeleted = (submissionId: string) => {
    console.log(`Submission with ID ${submissionId} deleted`);
  
    setSubmissions((prevState) => {
      const newState = prevState.filter(submission => submission.id !== submissionId);
      console.log("Updated submissions:", newState);
      return newState;
    });
  };

  if (!challenge) return <p>Loading challenge details...</p>;

  return (
    <div className="challenge-details">
      <div className="challenge-detail-container">
        {/* Hero Section with Brand Logo */}
        <section className="hero-section-challenge-detail">
          {brandLogoUrl && <img src={brandLogoUrl} alt={challenge.brand_name} className="brand-logo" />}
          <h1 className="brand-name-challenge-detail">{challenge.brand_name}</h1>
          <h2 className="challenge-detail-title">{challenge.title}</h2>
          <p className="challenge-detail-brief">{challenge.brief}</p>
          <p className="deadline">Deadline: {challenge.submission_deadline}</p>
  
          {role !== "basic" && <ButtonLong onClick={() => setShowForm(true)} text="Submit" />}
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
                  <p className="icon-explanation">Click on the icon <br />to choose a photo</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="form-input"
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    style={{ display: "none" }}
                    accept="image/*"
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
              </form>
            </div>
          </div>
        )}
  
        {/* Show Info Modal */}
        {showInfo && (
          <div className="info-modal">
            <div className="info-content">
              <h3>Important Information</h3>
              <p>When you submit an artwork, it will be reviewed to ensure it matches the current theme. After approval, your artwork will appear on Artwork page for everyone to admire!</p>
              <button onClick={() => setShowInfo(false)} className="close-info-button">
                Close
              </button>
            </div>
          </div>
        )}
  
        {/* Submissions Gallery */}
        <section className="submissions-gallery">
        <h2>Submissions Gallery</h2>

        {visibleSubmissions.length > 0 ? (
          <div className="submissions-container">
            {visibleSubmissions.map((submission) => (
              <div key={submission.id} onClick={() => handleSubmissionClick(submission)}>
                <SubmissionCard submission={submission} challenge={challenge.title} />
              </div>
            ))}
          </div>
        ) : (
          <p className="no-submissions-message">
            {role === "pro" ? (
              <>
                There are no submissions yet. <br /> Be the first to showcase your creativity and steal the spotlight! 🚀🎨
              </>
            ) : (
              <>
                There are no submissions yet. <br />
                But you can{" "}
                <span className="upgrade-link" onClick={() => setShowUpgradeModal(true)}>
                  <strong>upgrade to Pro</strong>
                </span>{" "}
                and be the first to share your creativity! 🌟
              </>
            )}
          </p>
        )}

        {hasMore && <ButtonPrimary onClick={loadMoreSubmissions} text="Load More" />}
      </section>

      {/* Render FullScreenProUpgrade when modal is open */}
      {showUpgradeModal && <FullScreenProUpgrade onClose={() => setShowUpgradeModal(false)} />}
      </div>
  
      {/* FullScreenSubmission */}
      {selectedSubmission && (
        <FullScreenSubmission
          submission={selectedSubmission}
          challengeName={challenge.title}
          votesCount={selectedSubmission.votes_count}
          onClose={closeFullScreenSubmission}
          onSubmissionDeleted={handleSubmissionDeleted}
        />
      )}
    </div>
  );
  
};

export default ChallengeDetail;
