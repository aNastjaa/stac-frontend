import { getCsrfTokenFromCookie, setCsrfCookie } from "../api";
import { User } from "../types";

export const API_URL = import.meta.env.VITE_API_URL;

// --- Users Management ---

// Get all users(works)
export const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: 'GET',
        credentials: 'include',
      });
  
      const data = await response.json();
  
      // Log the entire fetched data for debugging
      console.log('Fetched Data:', data);
  
      // Check if the response was successful
      if (!response.ok) {
        throw new Error(data.message || 'Error fetching users');
      }
  
      // Return the array of users directly from the fetched data
      if (data && Array.isArray(data)) {
        return data; // If the response is a list of users
      }
  
      // If the response has the `users` key, return that
      if (data && data.users) {
        return data.users;
      }
  
      // Log error if the data structure is unexpected
      console.error('Unexpected response structure:', data);
      return [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };
  
// Create a new user(works)
export const createUser = async (userData: { username: string; email: string; password: string; role: string }) => {
    try {
      // First, ensure the CSRF token is set
      await setCsrfCookie(); 
  
      // Get the CSRF token from the cookie
      const csrfToken = getCsrfTokenFromCookie();
  
      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken, // Pass the CSRF token in the header
        },
        body: JSON.stringify(userData),
        credentials: 'include', // Include credentials (cookies)
      });
  
      // Ensure the request was successful
      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.user; // Return the user object
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error to handle it where the function is called
    }
  };
  
//Update user role
  export const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Get CSRF token from cookie
      const csrfToken = getCsrfTokenFromCookie();
  
      // Send the PUT request to update the user role
      const response = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken, // Include CSRF token
        },
        credentials: 'include', // Ensure credentials (cookies) are included
        body: JSON.stringify({ role: newRole }), // Pass the updated role in the request body
      });
  
      // Handle the response
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
  
      const updatedUser = await response.json();
      return updatedUser.user; // Return the updated user data
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error; // Re-throw error to be handled in the component
    }
  };

// Delete user
export const deleteUser = async (userId: string) => {
    try {
      // First, ensure the CSRF token is set
      await setCsrfCookie(); 
  
      // Get the CSRF token from the cookie
      const csrfToken = getCsrfTokenFromCookie();
  
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken, // Pass the CSRF token in the header
        },
        credentials: 'include', // Include credentials (cookies)
      });
  
      // Ensure the request was successful
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data; // You can return a success message or the deleted user info if necessary
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error; // Re-throw the error to handle it where the function is called
    }
  };

// --- Sponsor Challenges Management ---

// Get all sponsor challenges
export const fetchSponsorChallenges = async () => {
  const response = await fetch(`${API_URL}/sponsor-challenges`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json();
  return data.challenges;
};

// Create a sponsor challenge
export const createSponsorChallenge = async (challengeData: { title: string; brief: string; brand_name: string; submission_deadline: string }) => {
  const response = await fetch(`${API_URL}/sponsor-challenges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(challengeData),
  });
  const data = await response.json();
  return data.challenge;
};

// Update sponsor challenge
export const updateSponsorChallenge = async (challengeId: string, challengeData: { title?: string; brief?: string; submission_deadline?: string }) => {
  const response = await fetch(`${API_URL}/sponsor-challenges/${challengeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(challengeData),
  });
  const data = await response.json();
  return data.challenge;
};

// Delete sponsor challenge
export const deleteSponsorChallenge = async (challengeId: string) => {
  await fetch(`${API_URL}/sponsor-challenges/${challengeId}`, {
    method: 'DELETE',
  });
};

// --- Post Management ---

// Get pending posts
export const fetchPendingPosts = async () => {
  const response = await fetch(`${API_URL}/pending-posts`, {
    method: 'GET',
  });
  const data = await response.json();
  return data.posts;
};

// Change post status
export const changePostStatus = async (postId: string, status: 'approved' | 'rejected') => {
  const response = await fetch(`${API_URL}/posts/${postId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  return data.post;
};

// --- Submission Management ---

// Get pending submissions
export const fetchPendingSubmissions = async () => {
  const response = await fetch(`${API_URL}/pending-submissions`, {
    method: 'GET',
  });
  const data = await response.json();
  return data.submissions;
};

// Change submission status
export const changeSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected') => {
  const response = await fetch(`${API_URL}/sponsor-submissions/${submissionId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  return data.submission;
};

// --- Theme Management ---

// Get all themes
export const fetchThemes = async () => {
  const response = await fetch(`${API_URL}/themes`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json();
  return data.themes;
};

// Create a new theme
export const createTheme = async (themeData: { theme_name: string; start_date: string }) => {
  const response = await fetch(`${API_URL}/themes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(themeData),
  });
  const data = await response.json();
  return data.theme;
};

// Update a theme
export const updateTheme = async (themeId: string, themeData: { theme_name?: string; start_date?: string }) => {
  const response = await fetch(`${API_URL}/themes/${themeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(themeData),
  });
  const data = await response.json();
  return data.theme;
};

// Delete a theme
export const deleteTheme = async (themeId: string) => {
  await fetch(`${API_URL}/themes/${themeId}`, {
    method: 'DELETE',
  });
};
