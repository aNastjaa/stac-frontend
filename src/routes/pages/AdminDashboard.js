import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import UserList from '../../components/admin/UserList';
import { fetchUsers } from '../../utils/api/admin'; // Import the API function
import SponsorChallengeList from '../../components/admin/SponsorChallengeList';
import { ButtonPrimary } from '../../components/Buttons';
import SubmissionList from '../../components/admin/SubmissionList';
import PostList from '../../components/admin/PostList';
import ThemeList from '../../components/admin/ThemeList';
import "../../css/admin_dashboard_styling/adminDashboard.css";
const AdminDashboard = () => {
    const [section, setSection] = useState('users');
    const [users, setUsers] = useState([]);
    const handleSectionChange = (newSection) => {
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
    return (_jsxs("div", { className: 'admin-dashboard', children: [_jsx("h1", { children: "Admin Dashboard" }), _jsxs("nav", { className: 'admin-dashboard-nav', children: [_jsx(ButtonPrimary, { onClick: () => handleSectionChange('users'), text: 'Users' }), _jsx(ButtonPrimary, { onClick: () => handleSectionChange('sponsor-challenges'), text: 'Sponsor Challenges' }), _jsx(ButtonPrimary, { onClick: () => handleSectionChange('posts'), text: 'Posts' }), _jsx(ButtonPrimary, { onClick: () => handleSectionChange('submissions'), text: 'Submissions' }), _jsx(ButtonPrimary, { onClick: () => handleSectionChange('themes'), text: "Themes" })] }), _jsxs("div", { className: 'admin-sections', children: [section === 'users' && _jsx(UserList, { users: users, setUsers: setUsers }), section === 'sponsor-challenges' && _jsx(SponsorChallengeList, {}), section === 'posts' && _jsx(PostList, {}), section === 'submissions' && _jsx(SubmissionList, {}), section === 'themes' && _jsx(ThemeList, {})] })] }));
};
export default AdminDashboard;
