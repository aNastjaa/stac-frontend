import { useState, useEffect } from 'react';
import { ErrorMessages, User } from '../../utils/types';
import { fetchUsers, createUser, deleteUser, updateUserRole } from '../../utils/api/admin';
import { setCsrfCookie } from '../../utils/api';
import { ButtonLong } from '../../components/Buttons'; // Assuming this is the correct import path
import '../../css/admin_dashboard_styling/usersList.css'

interface UserListProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserList = ({ users, setUsers }: UserListProps) => {
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'basic',
  });
  const [errorMessages] = useState<ErrorMessages>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    } catch (error) {
      setErrorMessage('Error creating user');
      console.error('Error creating user:', error);
    }
  };

  //Update user role
  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const updatedUser = await updateUserRole(userId, newRole);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, role: updatedUser.role } : user
        )
      );
      alert(`User role updated to ${newRole} successfully!`);
    } catch (error: unknown) {
      console.error('Error updating user role:', error);
    }
  };

  //Delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      const result = await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      console.log('User deleted successfully:', result);

      // Show a success alert after the user is created
    alert('User deleted successfully!');
    
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="user-management-container">
      <h2 className="admin-header">User Management</h2>
  
      {/* Create User Form */}
      <div className="admin-form">
        <h3 className='admin-section-header'>Create new user</h3>
  
        <div className="input-field">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            className={`admin-input ${errorMessages.username ? 'has-error' : ''}`}
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          {errorMessages.username && <small>{errorMessages.username}</small>}
        </div>
  
        <div className="input-field">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            className={`admin-input ${errorMessages.email ? 'has-error' : ''}`}
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          {errorMessages.email && <small>{errorMessages.email}</small>}
        </div>
  
        <div className="input-field">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            className={`admin-input ${errorMessages.password ? 'has-error' : ''}`}
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          {errorMessages.password && <small>{errorMessages.password}</small>}
        </div>
  
        <div className="input-field">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            className={`admin-input ${errorMessages.role ? 'has-error' : ''}`}
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="admin">Admin</option>
          </select>
          {errorMessages.role && <small>{errorMessages.role}</small>}
        </div>
  
        <ButtonLong text="Create User" onClick={handleCreateUser} />
        {errorMessage && <p className="backend-error">{errorMessage}</p>}
      </div>
  
      {/* User List */}
      <ul className="admin-list">
        <h3 className='admin-section-header'>Update user role</h3>
        {users && users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              <div className="admin-list-item">
                <div className='user-info'>
                  {user.username} ({user.email}) - {user.role ? user.role.name : 'No Role Assigned'}
                </div>
  
                {/* Update User Role */}
                <label htmlFor={`role-${user.id}`}>Role:</label>
                <select
                  id={`role-${user.id}`}
                  value={user.role ? user.role.name : 'No Role'}
                  onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                >
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="admin">Admin</option>
                </select>
  
                {/* Delete User */}
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <li>No users found</li>
        )}
      </ul>
    </div>
  );
  
};

export default UserList;
