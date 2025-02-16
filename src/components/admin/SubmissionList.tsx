import { useState, useEffect } from 'react';
import { fetchPendingSubmissions, updateSubmissionStatus } from '../../utils/api/admin';
import { fetchSponsorChallenges } from '../../utils/api/admin';
import { Submission, SponsorChallenge } from '../../utils/types';
import { ButtonPrimary } from '../Buttons';
import '../../css/admin_dashboard_styling/submissionList.css'; // Ensure this file exists

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [challenges, setChallenges] = useState<Record<string, SponsorChallenge>>({});

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const fetchedSubmissions = await fetchPendingSubmissions();
        setSubmissions(fetchedSubmissions);
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      }
    };

    const loadChallenges = async () => {
      try {
        const fetchedChallenges = await fetchSponsorChallenges();
        
        // Convert the array into a dictionary for faster lookup by ID
        const challengeMap = fetchedChallenges.reduce((acc, challenge) => {
          acc[challenge.id] = challenge;
          return acc;
        }, {} as Record<string, SponsorChallenge>);

        setChallenges(challengeMap);
      } catch (error) {
        console.error('Failed to fetch challenges', error);
      }
    };

    loadSubmissions();
    loadChallenges();
  }, []);

  const handleStatusChange = async (submissionId: string, status: 'accepted' | 'rejected') => {
    try {
      await updateSubmissionStatus(submissionId, status);
      setSubmissions(submissions.filter((submission) => submission.id !== submissionId));
    } catch (error) {
      console.error('Failed to update submission status', error);
    }
  };

  return (
    <div className="submission-list-container">
      <h2>Pending Submissions</h2>
      <ul className="submission-list">
        {submissions.map((submission) => {
          const challenge = challenges[submission.challenge_id]; // Find the challenge details

          return (
            <li key={submission.id} className="submission-item">
              <div className="submission-details">
                {challenge && (
                  <div className="challenge-info-admin">
                    {challenge.brand_name && <h3 className="brand-name">{challenge.brand_name}</h3>}
                    {challenge.brief && <p className="brief">{challenge.brief}</p>}
                  </div>
                )}
                
                {submission.image_path && (
                  <div className="thumbnail-container">
                    <img
                      src={submission.image_path}
                      alt={submission.description}
                      className="thumbnail"
                    />
                  </div>
                )}

                <p className="submission-description">{submission.description}</p>
              </div>
              
              <div className="actions">
                <ButtonPrimary onClick={() => handleStatusChange(submission.id, 'accepted')} text="Accept" />
                <ButtonPrimary onClick={() => handleStatusChange(submission.id, 'rejected')} text="Reject" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SubmissionList;
