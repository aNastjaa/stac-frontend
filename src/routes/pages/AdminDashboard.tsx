import { useState, useEffect } from 'react';
import UserList from '../../components/admin/UserList';
import { fetchUsers } from '../../utils/api/admin'; // Import the API function
import { User } from '../../utils/types';
import SponsorChallengeList from '../../components/admin/SponsorChallengeList';
import { ButtonPrimary } from '../../components/Buttons';
import SubmissionList from '../../components/admin/SubmissionList';
import PostList from '../../components/admin/PostList';
import ThemeList from '../../components/admin/ThemeList';
import "../../css/admin_dashboard_styling/adminDashboard.css"

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
    <div className='admin-dashboard'>
      <h1>Admin Dashboard</h1>
      <nav className='admin-dashboard-nav'>
        <ButtonPrimary onClick={() => handleSectionChange('users')} text='Users' />
        <ButtonPrimary onClick={() => handleSectionChange('sponsor-challenges')} text='Sponsor Challenges' />
        <ButtonPrimary onClick={() => handleSectionChange('posts')} text='Posts' />
        <ButtonPrimary onClick={() => handleSectionChange('submissions')} text='Submissions' />
        <ButtonPrimary onClick={() => handleSectionChange('themes')} text="Themes" />
      </nav>

      <div className='admin-sections'>
        {section === 'users' && <UserList users={users} setUsers={setUsers} />}
        {section === 'sponsor-challenges' && <SponsorChallengeList />}
        {section === 'posts' && <PostList />}
        {section === 'submissions' && <SubmissionList />}
        {section === 'themes' && <ThemeList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
