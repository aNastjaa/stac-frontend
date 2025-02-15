import { getCsrfTokenFromCookie, setCsrfCookie } from "../api";
import { Post, SponsorChallenge, Submission, Theme, UploadResponse, User } from "../types";

export const API_URL = import.meta.env.VITE_API_URL;

// --- Users Management ---
/**
 * Fetches all users from the server.
 * @returns {Promise<User[]>} A list of users.
 * @throws {Error} If fetching users fails.
 */
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
  
/**
 * Creates a new user.
 * @param {Object} userData - The user details.
 * @param {string} userData.username - The username of the new user.
 * @param {string} userData.email - The email of the new user.
 * @param {string} userData.password - The password of the new user.
 * @param {string} userData.role - The role of the new user.
 * @returns {Promise<User>} The created user object.
 * @throws {Error} If user creation fails.
 */
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

/**
 * Updates a user's role.
 * @param {string} userId - The ID of the user.
 * @param {string} newRole - The new role to assign.
 * @returns {Promise<User>} The updated user object.
 * @throws {Error} If updating the user role fails.
 */
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
/**
 * Deletes a user from the system.
 * @param {string} userId - The ID of the user to be deleted.
 * @returns {Promise<Object>} A success message or the deleted user info.
 * @throws {Error} If deleting the user fails.
 */
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
/**
 * Fetches all sponsor challenges from the server.
 * @returns {Promise<SponsorChallenge[]>} A list of sponsor challenges.
 * @throws {Error} If fetching the sponsor challenges fails.
 */
  export const fetchSponsorChallenges = async (): Promise<SponsorChallenge[]> => {
    try {
      // Send GET request to fetch sponsor challenges
      const response = await fetch(`${API_URL}/api/sponsor-challenges`, {
        method: 'GET',
        credentials: 'include', // Include credentials (cookies)
      });
  
      const data = await response.json(); // Parse the response JSON
  
      // Log the entire fetched data for debugging
      console.log('Fetched Sponsor Challenges:', data);
  
      // Check if the response was successful
      if (!response.ok) {
        throw new Error(data.message || 'Error fetching sponsor challenges');
      }
  
      // If the response contains an array of challenges, return that
      if (data && Array.isArray(data)) {
        return data; // If the response is a list of sponsor challenges
      }
  
      // If the response contains the `challenges` key, return that
      if (data && data.challenges) {
        return data.challenges;
      }
  
      // Log error if the data structure is unexpected
      console.error('Unexpected response structure:', data);
      return [];
    } catch (error) {
      console.error('Error fetching sponsor challenges:', error);
      return [];
    }
};
/**
 * Creates a new sponsor challenge in the system.
 * @param {Object} challengeData - The data for the new sponsor challenge.
 * @param {string} challengeData.title - The title of the challenge.
 * @param {string} challengeData.brief - A brief description of the challenge.
 * @param {string} challengeData.brand_name - The brand name associated with the challenge.
 * @param {string} challengeData.submission_deadline - The deadline for submitting entries.
 * @param {string} [challengeData.brand_logo_id] - Optional ID for the brand's logo.
 * @returns {Promise<SponsorChallenge>} The created sponsor challenge.
 * @throws {Error} If creating the sponsor challenge fails.
 */
  export const createSponsorChallenge = async (challengeData: {
    title: string;
    brief: string;
    brand_name: string;
    submission_deadline: string;
    brand_logo_id?: string;
  }): Promise<SponsorChallenge> => {
    try {
      const csrfToken = getCsrfTokenFromCookie(); // Get the CSRF token
  
      const response = await fetch(`${API_URL}/api/admin/sponsor-challenges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken, // Pass the CSRF token in the header
          'Accept': 'application/json', // Ensure the response is in JSON format
        },
        body: JSON.stringify(challengeData),
        credentials: 'include', // Include credentials (cookies)
      });
  
      if (!response.ok) {
        throw new Error('Failed to create sponsor challenge');
      }
  
      const data = await response.json();
      return data.challenge; // Return the created challenge data
  
    } catch (error) {
      console.error('Error creating sponsor challenge:', error);
      throw error;
    }
};
/**
 * Uploads a brand logo file to the server.
 * @param {File} file - The brand logo file to upload.
 * @returns {Promise<UploadResponse>} The response data containing the upload result.
 * @throws {Error} If the upload fails.
 */
  export const uploadBrandLogo = async (file: File): Promise<UploadResponse> => {
    try {
      const csrfToken = getCsrfTokenFromCookie(); // Ensure CSRF token is fetched correctly
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch(`${API_URL}/api/uploads/brand-logo`, {
        method: 'POST',
        headers: {
          'X-XSRF-TOKEN': csrfToken, // Pass CSRF token in the header
        },
        body: formData,
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload brand logo');
      }
  
      const result = await response.json();
      return result; // Return the upload response, which includes the file URL and ID
    } catch (error) {
      console.error('Error uploading brand logo', error);
      throw error;
    }
};
/**
 * Fetches the brand logo URL from the server using its logo ID.
 * @param {string} logoId - The ID of the brand logo.
 * @returns {Promise<string | null>} The URL of the brand logo or null if not found.
 * @throws {Error} If fetching the brand logo URL fails.
 */
  export const fetchBrandLogoUrl = async (logoId: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_URL}/api/uploads/${logoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
        },
        credentials: 'include',
      });
  
      // Log the response to see what is returned
      console.log('Brand Logo URL response:', response);
  
      if (!response.ok) {
        console.error('Failed to fetch brand logo URL:', response);
        throw new Error('Failed to fetch brand logo URL');
      }
  
      const data = await response.json();
  
      // Log the data to check the fetched content
      console.log('Fetched Brand Logo Data:', data);
  
      return data?.file_url ? `${API_URL}${data.file_url}` : null;
    } catch (error) {
      console.error('Error fetching brand logo URL', error);
      return null;
    }
  };
/**
 * Deletes a sponsor challenge from the system.
 * @param {string} challengeId - The ID of the sponsor challenge to be deleted.
 * @returns {Promise<Object>} The response data, possibly a success message.
 * @throws {Error} If deleting the sponsor challenge fails.
 */
  export const deleteSponsorChallenge = async (challengeId: string) => {
    try {
      // Ensure the CSRF token is set
      await setCsrfCookie();
  
      // Get the CSRF token from the cookie
      const csrfToken = getCsrfTokenFromCookie();
  
      const response = await fetch(`${API_URL}/api/admin/sponsor-challenges/${challengeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken, // Pass the CSRF token in the header
        },
        credentials: 'include', // Include credentials (cookies)
      });
  
      // Ensure the request was successful
      if (!response.ok) {
        throw new Error(`Failed to delete sponsor challenge: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data; // Return the response or any relevant data (e.g., success message)
    } catch (error) {
      console.error('Error deleting sponsor challenge:', error);
      throw error; // Re-throw the error to handle it where the function is called
    }
  };


  // --- Theme Management ---
/**
 * Fetches all available themes.
 * @returns {Promise<Theme[]>} A promise that resolves to an array of themes.
 * @throws {Error} If fetching the themes fails.
 */
export const fetchAllThemes = async (): Promise<Theme[]> => {
  try {
    const csrfToken = getCsrfTokenFromCookie(); // Get the CSRF token from the cookies
    const authToken = localStorage.getItem("auth_token"); // Retrieve the auth token from localStorage

    if (!authToken) {
      throw new Error('Auth token is missing');
    }

    const response = await fetch(`${API_URL}/api/themes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken,
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all themes');
    }

    const themes: Theme[] = await response.json(); 
    return themes; // Return all themes
  } catch (error) {
    console.error('Error fetching all themes:', error);
    throw error;
  }
};
/**
 * Creates a new theme.
 * @param {string} themeName - The name of the theme to be created.
 * @param {string} startDate - The start date of the theme.
 * @returns {Promise<Theme>} A promise that resolves to the created theme.
 * @throws {Error} If creating the theme fails.
 */
export const createTheme = async (themeName: string, startDate: string) => {
  try {
    // First, ensure the CSRF token is set
    await setCsrfCookie(); 

    // Get the CSRF token from the cookie
    const csrfToken = getCsrfTokenFromCookie();

    // Prepare the theme data
    const themeData = {
      theme_name: themeName,
      start_date: startDate,
    };

    // Send the POST request to create the theme
    const response = await fetch(`${API_URL}/api/admin/themes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken, // Pass the CSRF token in the header
      },
      body: JSON.stringify(themeData),
      credentials: 'include', // Include credentials (cookies)
    });

    // Ensure the request was successful
    if (!response.ok) {
      throw new Error(`Failed to create theme: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the created theme
  } catch (error) {
    console.error('Error creating theme:', error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};
/**
 * Updates an existing theme.
 * @param {string} themeId - The ID of the theme to be updated.
 * @param {string} themeName - The new name of the theme.
 * @param {string} startDate - The new start date of the theme.
 * @returns {Promise<Theme>} A promise that resolves to the updated theme.
 * @throws {Error} If updating the theme fails.
 */
export const updateTheme = async (themeId: string, themeName: string, startDate: string) => {
  try {
    // Ensure the CSRF token is set only if not already available
    const csrfToken = getCsrfTokenFromCookie();
    if (!csrfToken) {
      await setCsrfCookie();
    }

    const response = await fetch(`${API_URL}/api/admin/themes/${themeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken || getCsrfTokenFromCookie(),
      },
      body: JSON.stringify({ theme_name: themeName, start_date: startDate }),
      credentials: 'include', // Include credentials (cookies)
    });

    if (!response.ok) {
      throw new Error(`Failed to update theme: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating theme:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};
/**
 * Deletes a theme by its ID.
 * @param {string} themeId - The ID of the theme to be deleted.
 * @returns {Promise<void>} A promise that resolves when the theme is deleted.
 * @throws {Error} If deleting the theme fails.
 */
export const deleteTheme = async (themeId: string): Promise<void> => {
  try {
    // Ensure the CSRF token is set
    await setCsrfCookie();

    // Get the CSRF token from the cookie
    const csrfToken = getCsrfTokenFromCookie();

    // Send the DELETE request to delete the theme
    const response = await fetch(`${API_URL}/api/admin/themes/${themeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken, // Pass the CSRF token in the header
      },
      credentials: 'include', // Include credentials (cookies)
    });

    // Ensure the request was successful
    if (!response.ok) {
      throw new Error(`Failed to delete theme: ${response.statusText}`);
    }

    // Optionally, return a success message or deleted theme data if needed
    const data = await response.json();
    return data; // Return the deleted theme or any success response

  } catch (error) {
    console.error('Error deleting theme:', error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};
/**
 * Archives a theme by its ID.
 * @param {string} themeId - The ID of the theme to be archived.
 * @returns {Promise<void>} A promise that resolves when the theme is archived.
 * @throws {Error} If archiving the theme fails.
 */
export const archiveTheme = async (themeId: string): Promise<void> => {
  try {
    // Ensure the CSRF token is set
    await setCsrfCookie();

    // Get the CSRF token from the cookie
    const csrfToken = getCsrfTokenFromCookie();

    // Send the POST request to archive the theme by its ID
    const response = await fetch(`${API_URL}/api/archive/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken, // Pass the CSRF token in the header
      },
      body: JSON.stringify({ theme_id: themeId }), // Send the theme_id to be archived
      credentials: 'include', // Include credentials (cookies)
    });

    // Ensure the request was successful
    if (!response.ok) {
      throw new Error(`Failed to archive theme: ${response.statusText}`);
    }

    // Optionally, return a success message or any data if needed
    const data = await response.json();
    return data; // Return the archived theme or any success response

  } catch (error) {
    console.error('Error archiving theme:', error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};
/**
 * Fetches the list of archived themes.
 * @returns {Promise<Theme[]>} A promise that resolves to an array of archived themes.
 * @throws {Error} If fetching the archived themes fails.
 */
export const fetchArchivedThemes = async (): Promise<Theme[]> => {
  try {
    // Ensure the CSRF token is set
    await setCsrfCookie();

    // Get the CSRF token from the cookie
    const csrfToken = getCsrfTokenFromCookie();

    // Send the GET request to fetch the archived themes
    const response = await fetch(`${API_URL}/api/archive/archived-themes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken, // Pass the CSRF token in the header
      },
      credentials: 'include', // Include credentials (cookies)
    });

    // Ensure the request was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch archived themes: ${response.statusText}`);
    }

    // Parse and return the list of archived themes
    const archivedThemes: Theme[] = await response.json();
    return archivedThemes;

  } catch (error) {
    console.error('Error fetching archived themes:', error);
    throw error; // Re-throw the error to handle it where the function is called
  }
};

// --- Post status Management  ---
/**
 * Fetches the list of pending posts.
 * @returns {Promise<Post[]>} A promise that resolves to an array of pending posts.
 * @throws {Error} If fetching the pending posts fails.
 */
export const fetchPendingPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_URL}/api/admin/pending-posts`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch pending posts');
  }
  return response.json();
};
/**
 * Updates the status of a post.
 * @param {string} postId - The ID of the post to be updated.
 * @param {'accepted' | 'rejected'} status - The new status to be set for the post.
 * @returns {Promise<void>} A promise that resolves when the post status has been updated.
 * @throws {Error} If updating the post status fails.
 */
export const updatePostStatus = async (postId: string, status: 'accepted' | 'rejected'): Promise<void> => {
  await setCsrfCookie();
  const csrfToken = getCsrfTokenFromCookie();

  const response = await fetch(`${API_URL}/api/admin/posts/${postId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify({ status }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to update post status');
  }
};


// --- Stubmission status Management  ---
/**
 * Fetches the list of pending submissions.
 * @returns {Promise<Submission[]>} A promise that resolves to an array of pending submissions.
 * @throws {Error} If fetching the pending submissions fails.
 */
export const fetchPendingSubmissions = async (): Promise<Submission[]> => {
  const response = await fetch(`${API_URL}/api/admin/pending-submissions`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch pending submissions');
  }
  return response.json();
};
/**
 * Updates the status of a submission.
 * @param {string} submissionId - The ID of the submission to be updated.
 * @param {'accepted' | 'rejected'} status - The new status to be set for the submission.
 * @returns {Promise<void>} A promise that resolves when the submission status has been updated.
 * @throws {Error} If updating the submission status fails.
 */
export const updateSubmissionStatus = async (submissionId: string, status: 'accepted' | 'rejected'): Promise<void> => {
  await setCsrfCookie();
  const csrfToken = getCsrfTokenFromCookie();

  const response = await fetch(`${API_URL}/api/admin/sponsor-submissions/${submissionId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify({ status }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to update submission status');
  }
};