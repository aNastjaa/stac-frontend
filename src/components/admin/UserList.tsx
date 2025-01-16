import { useState, useEffect } from 'react';
import { User } from '../../utils/types';
import { fetchUsers, createUser, deleteUser, API_URL } from '../../utils/api/admin';
import { setCsrfCookie, getCsrfTokenFromCookie } from '../../utils/api';

interface UserListProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>; // Add the function to update users list
}

const UserList = ({ users, setUsers }: UserListProps) => {
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'basic', // Default role for new user
  });

  useEffect(() => {
    const loadUsers = async () => {
      // First, ensure that the CSRF cookie is set
      await setCsrfCookie();
      
      // Then fetch the users from the API
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };

    loadUsers();
  }, [setUsers]);

  // Handle Create User
  const handleCreateUser = async () => {
    try {
      const user = await createUser(newUser);
      setUsers((prevUsers) => [...prevUsers, user]); // Add the newly created user to the list
      setNewUser({ username: '', email: '', password: '', role: 'basic' }); // Reset the form
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Handle Update User Role
  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      // Get the CSRF token from the cookies
      const csrfToken = getCsrfTokenFromCookie(); 

      // Send the PUT request to update the user role
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken, // Include CSRF token in the request headers
        },
        credentials: 'include', // Ensure credentials (cookies) are included
        body: JSON.stringify({
          role: newRole, // Pass the updated role in the body
        }),
      });

      // Handle the response
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const updatedUser = await response.json();
      
      // Update the user in the frontend state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.user.id ? { ...user, role: updatedUser.user.role } : user
        )
      );

      // Show alert after successfully updating role
      alert(`User role updated to ${newRole} successfully!`);

      console.log('User role updated successfully:', updatedUser);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Remove the deleted user from the list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h2>User Management</h2>

      {/* Create User Form */}
      <div>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      {/* User List */}
      <ul>
        {users && users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              <div>
                <div>
                  {user.username} ({user.role ? user.role.name : 'No Role Assigned'})
                </div>

                {/* Update User Role */}
                <select
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
