import {ArtworkResponse, UploadResponse, UserProfileType,} from "./types";
//sasha@gmail.com
//La;G7,8bP&V7

// API base URL from the environment variable
export const API_URL = import.meta.env.VITE_API_URL;

//-------------------------------------------------------------------------------------------------------------
// Get CSRF Cookie
//-------------------------------------------------------------------------------------------------------------
/**
 * Sets the CSRF cookie by making a request to the backend.
 * This cookie is needed to protect against CSRF attacks.
 */
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
//-------------------------------------------------------------------------------------------------------------
// Get CSRF Token from Cookie
//-------------------------------------------------------------------------------------------------------------
/**
 * Retrieves the CSRF token from the cookies for subsequent requests.
 * @returns {string} CSRF token string
 * @throws Will throw an error if the CSRF token is not found.
 */
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
//-------------------------------------------------------------------------------------------------------------
// Get Auth Token from LocalStorage
//-------------------------------------------------------------------------------------------------------------
/**
 * Retrieves the authentication token from localStorage.
 * @returns {string | null} Auth token string or null if not found.
 */
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    // If no token in localStorage, redirect user to login page or handle accordingly
    redirectToLogin();
    return null;
  }
  return token;
};
/**
 * Validates the user's authentication token by sending it to the backend for verification.
 * @param authToken - The authentication token used to verify the user's session.
 * @param csrfToken - The CSRF token used to protect against cross-site request forgery attacks.
 * @returns {Promise<boolean>} Returns true if the token is valid, otherwise false.
 */
export const validateToken = async (authToken: string, csrfToken: string) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/validate-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'X-XSRF-TOKEN': csrfToken,  // Include the CSRF token in the request headers
      },
      credentials: 'include', // Include credentials (cookies) in the request
    });

    if (!response.ok) {
      throw new Error('Token validation failed');
    }

    // If the response is successful, return true
    return true;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
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
/**
 * Registers a new user by submitting a form with user data.
 * @param formData - Form data containing user registration information.
 * @returns {Promise<RegisterResponse>} The response data including success flag and potential validation errors.
 */
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
/**
 * Logs in a user with their credentials and retrieves a token.
 * @param email - User's email.
 * @param password - User's password.
 * @param rememberMe - Flag to remember the user (for session).
 * @param csrfToken - CSRF token for security.
 * @returns {Promise<LoginResponse>} The login response containing user data and tokens.
 */
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
/**
 * Fetches the user ID from localStorage.
 * @returns {string | null} The user ID if available, or null if not found.
 */
export const getUserIdFromLocalStorage = (): string | null => {
  const storedUser = localStorage.getItem('auth_user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    return parsedUser.id || null; // Return the user ID or null if not present
  }
  return null;
};

/**
 * Fetches the user profile based on the provided profileId.
 * @param profileId - The ID of the profile to fetch.
 * @returns {Promise<UserProfileType | null>} The user profile data if found, or null if not found.
 * @throws {Error} If the profile fetch fails.
 */
export const getUserProfileByProfileId = async (profileId: string): Promise<UserProfileType | null> => {
  try {
    const csrfToken = getCsrfTokenFromCookie();
    const decodedCsrfToken = decodeURIComponent(csrfToken);

    const response = await fetch(`${API_URL}/api/users/profile/${profileId}`, {
      method: 'GET',
      headers: {
        'X-XSRF-TOKEN': decodedCsrfToken, // CSRF token for security
        'Accept': 'application/json', // Request for JSON response
      },
      credentials: 'include', // Include credentials (cookies) in the request
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

/**
 * Fetches the profile ID based on the user ID.
 * @param userId - The ID of the user whose profile ID is to be fetched.
 * @returns {Promise<string | null>} The profile ID if found, or null if not found.
 * @throws {Error} If the profile ID fetch fails.
 */
export const getProfileIdByUserId = async (userId: string): Promise<string | null> => {
  try {
    const csrfToken = getCsrfTokenFromCookie();
    const decodedCsrfToken = decodeURIComponent(csrfToken);

    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'X-XSRF-TOKEN': decodedCsrfToken, // CSRF token for security
        'Accept': 'application/json', // Request for JSON response
      },
      credentials: 'include', // Include credentials (cookies) in the request
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

/**
 * Creates a new user profile.
 * @param profileData - The data for the user profile to be created.
 * @returns {Promise<UserProfileType>} The newly created user profile.
 * @throws {Error} If the profile creation fails.
 */
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

/**
 * Updates the user profile with the provided data.
 * @param profileData - The data to update the user profile with.
 * @returns {Promise<UserProfileType>} The updated user profile.
 * @throws {Error} If the profile update fails.
 */
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

/**
 * Uploads a user's avatar image.
 * @param file - The avatar image file to be uploaded.
 * @returns {Promise<UploadResponse>} The upload response containing the avatar data.
 * @throws {Error} If the avatar upload fails.
 */
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

/**
 * Fetches the avatar URL for a given avatar ID.
 * @param avatarId - The ID of the avatar to fetch.
 * @returns {Promise<string | null>} The URL of the avatar image, or null if not found.
 * @throws {Error} If fetching the avatar URL fails.
 */
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

/**
 * Deletes the user's account.
 * @returns {Promise<void>} A promise that resolves when the account is deleted.
 * @throws {Error} If the account deletion fails.
 */
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

/**
 * Logs the user out by invalidating the session.
 * @param csrfToken - The CSRF token for the logout request.
 * @returns {Promise<void>} A promise that resolves when the user is logged out.
 * @throws {Error} If the logout process fails.
 */
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

/**
 * Fetches all the artworks associated with a user.
 * @param userId - The ID of the user whose artworks are to be fetched.
 * @returns {Promise<ArtworkResponse[]>} A list of artworks related to the user.
 * @throws {Error} If fetching the artworks fails.
 */
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
