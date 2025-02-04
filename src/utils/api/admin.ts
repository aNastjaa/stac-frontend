import { getCsrfTokenFromCookie, setCsrfCookie } from "../api";
import { Post, SponsorChallenge, Submission, Theme, UploadResponse, User } from "../types";

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

// Create a sponsor challenge
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

//Upload brand logo
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

 //Fetch url from brand logo id 
 export const fetchBrandLogoUrl = async (logoId: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_URL}/api/uploads/${logoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(), // Ensure the CSRF token is included
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
// // Update sponsor challenge
// export const updateSponsorChallenge = async (challengeId: string, challengeData: { title?: string; brief?: string; submission_deadline?: string }) => {
//     await setCsrfCookie(); // Ensure CSRF token is set
//     const response = await fetch(`${API_URL}/api/admin/sponsor-challenges/${challengeId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(challengeData),
//       credentials: 'include',
//     });
//     const data = await response.json();
//     return data.challenge;
// };

// Delete sponsor challenge
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

// Function to create a new theme
//Function to fetch all themes 
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
// Function to update a theme
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
// Function to delete a theme
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
// Function to archive a theme
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
// Get archiver themes
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
// Fetch pending posts
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

// Update post status
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
// Fetch pending submissions
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

// Update submission status
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