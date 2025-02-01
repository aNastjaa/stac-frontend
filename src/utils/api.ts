import {ArtworkResponse, UploadResponse, UserProfileType,} from "./types";
//sasha@gmail.com
//La;G7,8bP&V7

export const API_URL = import.meta.env.VITE_API_URL;

//-------------------------------------------------------------------------------------------------------------
//Get CSRF Cookie
//-------------------------------------------------------------------------------------------------------------
export const setCsrfCookie = async (): Promise<void> => {
  try {
    // Send a GET request to Laravel to set the CSRF cookie
    const response = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include', // Ensure credentials (cookies) are included
    });

    // Ensure that the response is successful
    if (!response.ok) {
      throw new Error('Failed to set CSRF cookie');
    }
    
    console.log('CSRF cookie set:', response.headers);
  } catch (error) {
    console.error('Error setting CSRF cookie', error);
  }
};
//Get CSRF Token from cookie
export const getCsrfTokenFromCookie = (): string => {
  // Retrieve the CSRF token from the cookie
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (!csrfToken) {
    throw new Error('CSRF token not found in cookies. Make sure the cookie is set.');
  }

  // Decode the cookie value in case it's URL encoded
  return decodeURIComponent(csrfToken);
};
// Function to get the auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");  
};

//-------------------------------------------------------------------------------------------------------------
//REGISTER
//-------------------------------------------------------------------------------------------------------------
// Define types for the API response
interface RegisterResponse {
  success: boolean;
  errors?: Record<string, string[]>; // Backend validation errors
  data?: {
    user: {
      id: string;
      username: string;
      email: string;
      role_id: string;
      created_at: string;
      updated_at: string;
    };
    csrfToken: string;
  };
}
export const register = async (
  formData: FormData
): Promise<RegisterResponse> => {
  const csrfToken = getCsrfTokenFromCookie();

  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      "X-XSRF-TOKEN": csrfToken,
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    if (response.status === 422) {
      return { success: false, errors: responseBody.errors };
    }
    throw new Error(responseBody.message || "Registration failed");
  }

  return { success: true, data: responseBody };
};

//-------------------------------------------------------------------------------------------------------------
//LOGIN
//-------------------------------------------------------------------------------------------------------------
// Define types for the API response
interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  csrfToken: string;
  token: string;
}
export const login = async (
  email: string,
  password: string,
  rememberMe: boolean,
  csrfToken: string // Expecting CSRF token from the frontend
): Promise<LoginResponse> => {
  // Ensure CSRF token is URL-decoded
  const decodedCsrfToken = decodeURIComponent(csrfToken);
  
  console.log('Decoded CSRF Token:', decodedCsrfToken);

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': decodedCsrfToken, // Pass the decoded token
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password, remember_me: rememberMe }),
    credentials: 'include', // Include credentials (cookies)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  // Store the token and user data in localStorage
  if (data.token) {
    localStorage.setItem("auth_token", data.token); // Store token in localStorage
    localStorage.setItem("auth_user", JSON.stringify(data.user)); // Store user data
  }

  return data; // Return the response data
};

//-------------------------------------------------------------------------------------------------------------
//GET USER BY ID
//-------------------------------------------------------------------------------------------------------------
// Function to fetch the user ID from localStorage
export const getUserIdFromLocalStorage = (): string | null => {
  const storedUser = localStorage.getItem('auth_user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    return parsedUser.id || null; // Return the user ID
  }
  return null;
};
// Function to get user profile by profileId
export const getUserProfileByProfileId = async (profileId: string): Promise<UserProfileType | null> => {
  try {
    const csrfToken = getCsrfTokenFromCookie();
    const decodedCsrfToken = decodeURIComponent(csrfToken);

    const response = await fetch(`${API_URL}/api/users/profile/${profileId}`, {
      method: 'GET',
      headers: {
        'X-XSRF-TOKEN': decodedCsrfToken,
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile data');
    }

    const result = await response.json();
    return result.profile ? result.profile : null;  // Ensure the profile is returned
  } catch (error) {
    console.error('Error fetching user profile by profileId', error);
    throw error;
  }
};
// Function to get the profileId by userId
export const getProfileIdByUserId = async (userId: string): Promise<string | null> => {
  try {
    const csrfToken = getCsrfTokenFromCookie();
    const decodedCsrfToken = decodeURIComponent(csrfToken);

    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'X-XSRF-TOKEN': decodedCsrfToken,
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile ID');
    }

    const result = await response.json();
    const profile = result.profiles.find((profile: { user_id: string }) => profile.user_id === userId);
    return profile?.id || null;
  } catch (error) {
    console.error('Error fetching profile ID by userId', error);
    throw error;
  }
};


//-------------------------------------------------------------------------------------------------------------
//USER PROFILE
//-------------------------------------------------------------------------------------------------------------

// Function to create user profile (POST method)
export const createUserProfile = async (profileData: UserProfileType): Promise<UserProfileType> => {
  try {
    const csrfToken = getCsrfTokenFromCookie();

    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken,
        'Accept': 'application/json',
      },
      body: JSON.stringify(profileData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to create profile');
    }

    const result = await response.json();
    return result.profile;
  } catch (error) {
    console.error('Error creating profile', error);
    throw error;
  }
};
// Function to update user profile (PUT method)
export const updateUserProfile = async (profileData: UserProfileType): Promise<UserProfileType> => {
  try {
    const csrfToken = getCsrfTokenFromCookie();

    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken,
        'Accept': 'application/json',
      },
      body: JSON.stringify(profileData),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving profile', error);
    throw error;
  }
};
// Function to upload an avatar
export const uploadAvatar = async (file: File): Promise<UploadResponse> => {
  try {
    const csrfToken = getCsrfTokenFromCookie();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/uploads/avatar`, {
      method: 'POST',
      headers: {
        'X-XSRF-TOKEN': csrfToken,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    const result = await response.json();
    return result; // Return the upload response as per your model
  } catch (error) {
    console.error('Error uploading avatar', error);
    throw error;
  }
};
//Fetch avatar URL
export const fetchAvatarUrl = async (avatarId: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/api/uploads/${avatarId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getCsrfTokenFromCookie(), // Ensure the CSRF token is included
      },
      credentials: 'include',
    });

    // Log the response to see what is returned
    console.log('Avatar URL response:', response);

    if (!response.ok) {
      console.error('Failed to fetch avatar URL:', response);
      throw new Error('Failed to fetch avatar URL');
    }

    const data = await response.json();

    // Log the data to check the fetched content
    console.log('Fetched Avatar Data:', data);

    return data?.file_url ? `${API_URL}${data.file_url}` : null;
  } catch (error) {
    console.error('Error fetching avatar URL', error);
    return null;
  }
};
// Change User Password
// export const changePassword = async (
//   oldPassword: string,
//   newPassword: string
// ): Promise<void> => {
//   try {
//     const csrfToken = getCsrfTokenFromCookie();

//     const response = await fetch(`${API_URL}/api/auth/update`, {
//       method: 'PUT',
//       headers: {
//         'X-XSRF-TOKEN': csrfToken,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         old_password: oldPassword,
//         new_password: newPassword,
//       }),
//       credentials: 'include',
//     });

//     if (!response.ok) {
//       throw new Error('Failed to change password');
//     }

//     const result = await response.json();
//     console.log('Password changed successfully', result);
//   } catch (error) {
//     console.error('Error changing password', error);
//     throw error;
//   }
// };
// Delete User Account (DELETE Request)
export const deleteUserAccount = async (): Promise<void> => {
  try {
    const csrfToken = getCsrfTokenFromCookie();

    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'DELETE',
      headers: {
        'X-XSRF-TOKEN': csrfToken,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete account');
    }

    const result = await response.json();
    console.log('Account deleted successfully', result);
  } catch (error) {
    console.error('Error deleting account', error);
    throw error;
  }
};
// Logout User (POST Request)
export const logout = async (csrfToken: string): Promise<void> => {
  try {
    // Decode the CSRF token to handle any URL-encoded characters
    const decodedCsrfToken = decodeURIComponent(csrfToken);

    console.log('Decoded CSRF Token for Logout:', decodedCsrfToken);

    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': decodedCsrfToken, 
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to log out');
    }

    // Remove authentication data from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error; // Rethrow the error for further handling by the calling function
  }
};
//Get all the artworks related to user
export const fetchUserArtworks = async (userId: string): Promise<ArtworkResponse[]> => {
  try {
    const csrfToken = getCsrfTokenFromCookie();
    const authToken = localStorage.getItem('auth_token');

    if (!authToken) {
      throw new Error('Authentication token is missing');
    }

    const response = await fetch(`${API_URL}/api/artworks?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken,
        'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error fetching artworks: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};


