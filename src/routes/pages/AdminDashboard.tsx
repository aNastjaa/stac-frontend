import { useState, useEffect } from 'react';
import UserList from '../../components/admin/UserList';
import { fetchUsers } from '../../utils/api/admin'; // Import the API function
import { User } from '../../utils/types';
import SponsorChallengeList from '../../components/admin/SponsorChallengeList';
import { ButtonPrimary } from '../../components/Buttons';

const AdminDashboard = () => {
  const [section, setSection] = useState<string>('users');
  const [users, setUsers] = useState<User[]>([]);

  const handleSectionChange = (newSection: string) => {
    setSection(newSection);
  };

  // Fetch users for the 'users' section
  useEffect(() => {
    const loadData = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers); // Store the fetched users in the state
    };

    loadData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <ButtonPrimary onClick={() => handleSectionChange('users')} text='Users'/>
        <ButtonPrimary onClick={() => handleSectionChange('sponsor-challenges')} text='Sponsor Challenges'/> {/* New button for Sponsor Challenges */}
      </nav>

      <div>
        {section === 'users' && <UserList users={users} setUsers={setUsers} />} {/* Pass setUsers as a prop */}
        {section === 'sponsor-challenges' && <SponsorChallengeList />} {/* Render SponsorChallengeList */}
      </div>
    </div>
  );
};

export default AdminDashboard;
