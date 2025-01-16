import { useState } from 'react';
import { SponsorChallenge } from '../../utils/types';

type SponsorChallengeListProps = {
  challenges: SponsorChallenge[];
  handleCreateChallenge: (challenge: Omit<SponsorChallenge, 'id'>) => void;
  handleUpdateChallenge: (challengeId: string, updatedChallenge: Partial<SponsorChallenge>) => void;
  handleDeleteChallenge: (challengeId: string) => void;
};

const SponsorChallengeList = ({ challenges, handleCreateChallenge, handleUpdateChallenge, handleDeleteChallenge }: SponsorChallengeListProps) => {
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newChallengeBrief, setNewChallengeBrief] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateChallenge({ title: newChallengeTitle, brief: newChallengeBrief });
  };

  return (
    <div>
      <h2>Sponsor Challenge Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newChallengeTitle}
          onChange={(e) => setNewChallengeTitle(e.target.value)}
          placeholder="Challenge Title"
        />
        <input
          type="text"
          value={newChallengeBrief}
          onChange={(e) => setNewChallengeBrief(e.target.value)}
          placeholder="Challenge Brief"
        />
        <button type="submit">Create Challenge</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Brief</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map(challenge => (
            <tr key={challenge.id}>
              <td>{challenge.title}</td>
              <td>{challenge.brief}</td>
              <td>
                <button onClick={() => handleUpdateChallenge(challenge.id, { title: 'Updated' })}>Update</button>
                <button onClick={() => handleDeleteChallenge(challenge.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SponsorChallengeList;
