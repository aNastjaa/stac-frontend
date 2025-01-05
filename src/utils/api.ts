// interface RegisterResponse {
//   success: boolean;
//   errors?: Record<string, string[]>; // Backend validation errors
//   data?: {
//     user: {
//       id: string;
//       username: string;
//       email: string;
//       role_id: string;
//       created_at: string;
//       updated_at: string;
//     };
//     token: string;
//   };
// }

// export const fetchCsrf = async (): Promise<void> => {
//   try {
//     const response = await fetch("http://localhost:8000/sanctum/csrf-cookie", {
//       credentials: "include", 
//     });
//     if (!response.ok) {
//       console.error("Failed to fetch CSRF cookie:", response.statusText);
//       throw new Error("Failed to fetch CSRF cookie");
//     }
//     console.log("CSRF cookie fetched successfully");
//   } catch (error) {
//     console.error("Error fetching CSRF cookie:", error);
//     throw error;
//   }
// };

// export const register = async (
//   formData: FormData
// ): Promise<RegisterResponse> => {
//   await fetchCsrf();

//   const token = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("XSRF-TOKEN="))
//     ?.split("=")[1];

//   if (!token) {
//     throw new Error("CSRF token not found");
//   }

//   const response = await fetch("http://localhost:8000/api/auth/register", {
//     method: "POST",
//     body: formData,
//     credentials: "include",
//     headers: {
//       "X-XSRF-TOKEN": decodeURIComponent(token),
//     },
//   });

//   const responseBody = await response.json();

//   if (!response.ok) {
//     // Handle validation errors (status 422)
//     if (response.status === 422) {
//       return { success: false, errors: responseBody.errors };
//     }

//     // Throw error for other unexpected issues
//     throw new Error(responseBody.message || "Registration failed");
//   }

//   return { success: true, data: responseBody };
// };




export const setCsrfCookie = async (): Promise<void> => {
  try {
    // Send a GET request to Laravel to set the CSRF cookie
    const response = await fetch('/sanctum/csrf-cookie', {
      method: 'GET',
      credentials: 'include', // Ensure credentials (cookies) are included
    });

    // Ensure that the response is successful
    if (!response.ok) {
      throw new Error('Failed to set CSRF cookie');
    }
    
    // Optionally, you can check the response headers or cookies here if needed
    console.log('CSRF cookie set');
  } catch (error) {
    console.error('Error setting CSRF cookie', error);
  }
};

export const getCsrfTokenFromCookie = (): string => {
  // Retrieve the CSRF token from the cookie
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (!csrfToken) {
    throw new Error('CSRF token not found in cookies. Make sure the cookie is set.');
  }

  return csrfToken;
};

// Define types for the API response
interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  csrfToken: string;
}
// Function to login the user
export const login = async (
  email: string,
  password: string,
  rememberMe: boolean,
  csrfToken: string
): Promise<LoginResponse> => {
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken, // Include CSRF token here
    },
    body: JSON.stringify({ email, password, remember_me: rememberMe }),
    credentials: 'include', // Include cookies for session-based authentication
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data; // Return the user and token
};


