import { useState, useEffect } from 'react';
import { SponsorChallenge, UploadResponse } from '../../utils/types';
import { fetchSponsorChallenges, createSponsorChallenge, deleteSponsorChallenge, uploadBrandLogo, fetchBrandLogoUrl } from '../../utils/api/admin';
import { ButtonLong, ButtonPrimary } from '../../components/Buttons';
import { ImageOff } from 'lucide-react';
import '../../css/admin_dashboard_styling/sponsorCallengeCard.css';

const SponsorChallengeList = () => {
  const [challenges, setChallenges] = useState<SponsorChallenge[]>([]);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    brief: '',
    brand_name: '',
    submission_deadline: '',
  });
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State to hold the URLs of the brand logos
  const [brandLogoUrls, setBrandLogoUrls] = useState<{ [key: string]: string | null }>({});

  // Fetch sponsor challenges on mount
  useEffect(() => {
    const loadChallenges = async () => {
      const fetchedChallenges = await fetchSponsorChallenges();
      setChallenges(fetchedChallenges);

      // Fetch the brand logo URLs for each challenge
      const logoUrls: { [key: string]: string | null } = {};
      for (const challenge of fetchedChallenges) {
        // Make sure to check if brand_logo_id exists and only then fetch its URL
        if (challenge.brand_logo_id) {
          const url = await fetchBrandLogoUrl(challenge.brand_logo_id);
          logoUrls[challenge.id] = url;
        }
      }
      setBrandLogoUrls(logoUrls);
    };

    loadChallenges();
  }, []);

  // Handle Create Sponsor Challenge
  const handleCreateChallenge = async () => {
    try {
      setErrorMessages({});
      
      let uploadedLogo: UploadResponse | null = null;
      if (brandLogoFile) {
        uploadedLogo = await uploadBrandLogo(brandLogoFile); // Upload the brand logo
      }
  
      const challengeData = {
        title: newChallenge.title,
        brief: newChallenge.brief,
        brand_name: newChallenge.brand_name,
        submission_deadline: newChallenge.submission_deadline,
        brand_logo_id: uploadedLogo?.id || "",  // Ensure brand_logo_id is always defined
      };
  
      const challenge = await createSponsorChallenge(challengeData);
      setChallenges((prevChallenges) => [...prevChallenges, challenge]);

      // Reset the form
      setNewChallenge({ title: '', brief: '', brand_name: '', submission_deadline: '' });
      setBrandLogoFile(null);
      setBrandLogoPreview(null);
  
    } catch (error) {
      setErrorMessage('Error creating sponsor challenge');
      console.error('Error creating sponsor challenge:', error);
    }
  };

  // Handle Delete Sponsor Challenge
  const handleDeleteChallenge = async (challengeId: string) => {
    try {
      await deleteSponsorChallenge(challengeId);
      setChallenges((prevChallenges) => prevChallenges.filter((challenge) => challenge.id !== challengeId));
    } catch (error) {
      console.error('Error deleting sponsor challenge:', error);
    }
  };

  // Handle brand logo change
  const handleBrandLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBrandLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='admin-challenges-header'>
      <h2>Sponsor Challenges</h2>

      {/* Create Challenge Form */}
      <div className="admin-form">
      <h3 className='challenge-section-header'> Create new challenge </h3>
        <div className="input-field">
          <input
            className={`admin-input ${errorMessages.title ? 'has-error' : ''}`}
            type="text"
            placeholder="Title"
            value={newChallenge.title}
            onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
          />
          {errorMessages.title && <small>{errorMessages.title}</small>}
        </div>

        <div className="input-field">
          <textarea
            className={`admin-input ${errorMessages.brief ? 'has-error' : ''}`}
            placeholder="Brief"
            value={newChallenge.brief}
            onChange={(e) => setNewChallenge({ ...newChallenge, brief: e.target.value })}
          />
          {errorMessages.brief && <small>{errorMessages.brief}</small>}
        </div>

        <div className="input-field">
          <input
            className={`admin-input ${errorMessages.brand_name ? 'has-error' : ''}`}
            type="text"
            placeholder="Brand Name"
            value={newChallenge.brand_name}
            onChange={(e) => setNewChallenge({ ...newChallenge, brand_name: e.target.value })}
          />
          {errorMessages.brand_name && <small>{errorMessages.brand_name}</small>}
        </div>

        <div className="input-field">
          <input
            className={`admin-input ${errorMessages.submission_deadline ? 'has-error' : ''}`}
            type="datetime-local"
            placeholder="Submission Deadline"
            value={newChallenge.submission_deadline}
            onChange={(e) => setNewChallenge({ ...newChallenge, submission_deadline: e.target.value })}
          />
          {errorMessages.submission_deadline && <small>{errorMessages.submission_deadline}</small>}
        </div>

        {/* Brand Logo File Upload */}
        <div className="input-field">
          <input
            type="file"
            accept="image/*"
            onChange={handleBrandLogoChange}
          />
          {brandLogoPreview && <img src={brandLogoPreview} alt="Brand Logo Preview" width={100} />}
        </div>

        <ButtonLong text="Create Challenge" onClick={handleCreateChallenge} />
        {errorMessage && <p className="backend-error">{errorMessage}</p>}
      </div>

      {/* List of Sponsor Challenges */}
      <ul className="sponsor-challenge-card-list">
      <h3 className='challenge-section-header'> Current challenges </h3>
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <li key={challenge.id}>
              <div className="sponsor-challenge-card">
                
                {/* Display Brand Logo */}
                {challenge.brand_logo_id ? (
                  <div className="brand-logo-container">
                    <img
                      src={brandLogoUrls[challenge.id] || ''}  // Ensure the URL exists, else fallback to empty string
                      alt={`${challenge.brand_name} logo`}
                    />
                  </div>
                ) : (
                  <div className="brand-logo-container">
                    <ImageOff color="#131313" size={70} />
                  </div>
                )}

                <div className='challenge-info'>
                  <h4>{challenge.brand_name}</h4>
                  <strong>{challenge.title}</strong> - 
                  {challenge.brief}
                </div>
                <div className='challenge-deadline'>
                  <strong>Submission Deadline:</strong> <br/> {challenge.submission_deadline}
                </div>

                <div className='challenge-actions'>
                  {/* Delete Challenge */}
                  <ButtonPrimary
                    text="Delete"
                    onClick={() => handleDeleteChallenge(challenge.id)}
                  />
                </div>
              </div>
            </li>
          ))
        ) : (
          <li>No sponsor challenges found</li>
        )}
      </ul>
    </div>
  );
};

export default SponsorChallengeList;
