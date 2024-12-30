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
    token: string;
  };
}

export const fetchCsrf = async (): Promise<void> => {
  try {
    const response = await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include", 
    });
    if (!response.ok) {
      console.error("Failed to fetch CSRF cookie:", response.statusText);
      throw new Error("Failed to fetch CSRF cookie");
    }
    console.log("CSRF cookie fetched successfully");
  } catch (error) {
    console.error("Error fetching CSRF cookie:", error);
    throw error;
  }
};

export const register = async (
  formData: FormData
): Promise<RegisterResponse> => {
  await fetchCsrf();

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (!token) {
    throw new Error("CSRF token not found");
  }

  const response = await fetch("http://localhost:8000/api/auth/register", {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      "X-XSRF-TOKEN": decodeURIComponent(token),
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    // Handle validation errors (status 422)
    if (response.status === 422) {
      return { success: false, errors: responseBody.errors };
    }

    // Throw error for other unexpected issues
    throw new Error(responseBody.message || "Registration failed");
  }

  return { success: true, data: responseBody };
};

// Import types
export const login = async (data: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("remember_me", data.rememberMe.toString());

  const response = await fetch("http://localhost:8000/api/auth/login", {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      "X-XSRF-TOKEN": decodeURIComponent(
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1] || ""
      ),
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { success: false, errors: errorData.errors || {} };
  }

  const responseData = await response.json();
  return { success: true, ...responseData };
};
