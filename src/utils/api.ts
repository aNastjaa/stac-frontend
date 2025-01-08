const API_URL = import.meta.env.VITE_API_URL;
//Get CSRF Cookie
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
//REGISTER
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

//LOGIN
// Define types for the API response
interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  csrfToken: string;
}

// Function to make a login request with the CSRF token
export const login = async (
  email: string,
  password: string,
  rememberMe: boolean,
  csrfToken: string // Expecting the token here
): Promise<LoginResponse> => {
  // Ensure CSRF token is URL-decoded
  const decodedCsrfToken = decodeURIComponent(csrfToken);

  console.log('Decoded CSRF Token:', decodedCsrfToken); // Check the format here

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': decodedCsrfToken, // Pass the decoded token
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password, remember_me: rememberMe }),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data; // Return the response data
};



