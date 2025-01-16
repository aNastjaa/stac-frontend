import { Submission } from '../../utils/types';

type SubmissionListProps = {
  submissions: Submission[];
  handleSubmissionStatusChange: (submissionId: string, status: 'approved' | 'rejected') => void;
};

const SubmissionList = ({ submissions, handleSubmissionStatusChange }: SubmissionListProps) => {
  return (
    <div>
      <h2>Submission Management</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(submission => (
            <tr key={submission.id}>
              <td>{submission.description}</td>
              <td>{submission.status}</td>
              <td>
                <button onClick={() => handleSubmissionStatusChange(submission.id, 'approved')}>Approve</button>
                <button onClick={() => handleSubmissionStatusChange(submission.id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionList;
