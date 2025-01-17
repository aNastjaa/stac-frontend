import { useState, useEffect } from 'react';
import { fetchPendingSubmissions, updateSubmissionStatus } from '../../utils/api/admin';
import { Submission } from '../../utils/types';
import { ButtonPrimary } from '../Buttons';
import '../../css/admin_dashboard_styling/submissionList.css'; // Make sure to create this file

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const fetchedSubmissions = await fetchPendingSubmissions();
        setSubmissions(fetchedSubmissions);
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      }
    };
    loadSubmissions();
  }, []);

  const handleStatusChange = async (submissionId: string, status: 'accepted' | 'rejected') => {
    try {
      await updateSubmissionStatus(submissionId, status); // Ensure types align
      setSubmissions(submissions.filter((submission) => submission.id !== submissionId)); // Remove updated submission
    } catch (error) {
      console.error('Failed to update submission status', error);
    }
  };

  return (
    <div className='submission-list-container'>
      <h2>Pending Submissions</h2>
      <ul className="submission-list">
        {submissions.map((submission) => (
          <li key={submission.id} className="submission-item">
            <div className="submission-details">
              <p className="submission-username">{submission.user}</p> {/* Assuming submission contains a user object */}
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
              <ButtonPrimary
                onClick={() => handleStatusChange(submission.id, 'accepted')}
                text="Accept"
              />
              <ButtonPrimary
                onClick={() => handleStatusChange(submission.id, 'rejected')}
                text="Reject"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmissionList;
