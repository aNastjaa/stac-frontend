import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { fetchUsers, createUser, deleteUser, updateUserRole } from '../../utils/api/admin';
import { setCsrfCookie } from '../../utils/api';
import { ButtonLong } from '../../components/Buttons'; // Assuming this is the correct import path
import '../../css/admin_dashboard_styling/usersList.css';
const UserList = ({ users, setUsers }) => {
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'basic',
    });
    const [errorMessages] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    useEffect(() => {
        const loadUsers = async () => {
            await setCsrfCookie();
            const fetchedUsers = await fetchUsers();
            setUsers(fetchedUsers);
        };
        loadUsers();
    }, [setUsers]);
    //Create user
    const handleCreateUser = async () => {
        try {
            const user = await createUser(newUser);
            setUsers((prevUsers) => [...prevUsers, user]);
            setNewUser({ username: '', email: '', password: '', role: 'basic' });
            // Show a success alert after the user is created
            alert('User created successfully!');
        }
        catch (error) {
            setErrorMessage('Error creating user');
            console.error('Error creating user:', error);
        }
    };
    //Update user role
    const handleUpdateRole = async (userId, newRole) => {
        try {
            const updatedUser = await updateUserRole(userId, newRole);
            setUsers((prevUsers) => prevUsers.map((user) => user.id === updatedUser.id ? { ...user, role: updatedUser.role } : user));
            alert(`User role updated to ${newRole} successfully!`);
        }
        catch (error) {
            console.error('Error updating user role:', error);
        }
    };
    //Delete user
    const handleDeleteUser = async (userId) => {
        try {
            const result = await deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            console.log('User deleted successfully:', result);
            // Show a success alert after the user is created
            alert('User deleted successfully!');
        }
        catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    return (_jsxs("div", { className: "user-management-container", children: [_jsx("h2", { className: "admin-header", children: "User Management" }), _jsxs("div", { className: "admin-form", children: [_jsx("h3", { className: 'admin-section-header', children: "Create new user" }), _jsxs("div", { className: "input-field", children: [_jsx("label", { htmlFor: "username", children: "Username:" }), _jsx("input", { id: "username", className: `admin-input ${errorMessages.username ? 'has-error' : ''}`, type: "text", placeholder: "Username", value: newUser.username, onChange: (e) => setNewUser({ ...newUser, username: e.target.value }) }), errorMessages.username && _jsx("small", { children: errorMessages.username })] }), _jsxs("div", { className: "input-field", children: [_jsx("label", { htmlFor: "email", children: "Email:" }), _jsx("input", { id: "email", className: `admin-input ${errorMessages.email ? 'has-error' : ''}`, type: "email", placeholder: "Email", value: newUser.email, onChange: (e) => setNewUser({ ...newUser, email: e.target.value }) }), errorMessages.email && _jsx("small", { children: errorMessages.email })] }), _jsxs("div", { className: "input-field", children: [_jsx("label", { htmlFor: "password", children: "Password:" }), _jsx("input", { id: "password", className: `admin-input ${errorMessages.password ? 'has-error' : ''}`, type: "password", placeholder: "Password", value: newUser.password, onChange: (e) => setNewUser({ ...newUser, password: e.target.value }) }), errorMessages.password && _jsx("small", { children: errorMessages.password })] }), _jsxs("div", { className: "input-field", children: [_jsx("label", { htmlFor: "role", children: "Role:" }), _jsxs("select", { id: "role", className: `admin-input ${errorMessages.role ? 'has-error' : ''}`, value: newUser.role, onChange: (e) => setNewUser({ ...newUser, role: e.target.value }), children: [_jsx("option", { value: "basic", children: "Basic" }), _jsx("option", { value: "pro", children: "Pro" }), _jsx("option", { value: "admin", children: "Admin" })] }), errorMessages.role && _jsx("small", { children: errorMessages.role })] }), _jsx(ButtonLong, { text: "Create User", onClick: handleCreateUser }), errorMessage && _jsx("p", { className: "backend-error", children: errorMessage })] }), _jsxs("ul", { className: "admin-list", children: [_jsx("h3", { className: 'admin-section-header', children: "Update user role" }), users && users.length > 0 ? (users.map((user) => (_jsx("li", { children: _jsxs("div", { className: "admin-list-item", children: [_jsxs("div", { className: 'user-info', children: [user.username, " (", user.email, ") - ", user.role ? user.role.name : 'No Role Assigned'] }), _jsx("label", { htmlFor: `role-${user.id}`, children: "Role:" }), _jsxs("select", { id: `role-${user.id}`, value: user.role ? user.role.name : 'No Role', onChange: (e) => handleUpdateRole(user.id, e.target.value), children: [_jsx("option", { value: "basic", children: "Basic" }), _jsx("option", { value: "pro", children: "Pro" }), _jsx("option", { value: "admin", children: "Admin" })] }), _jsx("button", { onClick: () => handleDeleteUser(user.id), children: "Delete" })] }) }, user.id)))) : (_jsx("li", { children: "No users found" }))] })] }));
};
export default UserList;
