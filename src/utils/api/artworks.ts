import { API_URL, getAuthToken, getCsrfTokenFromCookie} from "../api";
import { ArtworkResponse, Theme } from "../types";

/**
 * Fetches the current theme for the artwork.
 * @returns {Promise<Theme | null>} The current theme if available, otherwise null.
 * @throws {Error} If fetching the theme fails.
 */
export const fetchCurrentTheme = async (): Promise<Theme | null> => {
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
        throw new Error('Failed to fetch current theme');
      }
  
      const themeData: Theme[] = await response.json(); 
  
      if (themeData.length > 0) {
        return themeData[0]; 
      }
  
      return null; 
    } catch (error) {
      console.error('Error fetching current theme:', error);
      throw error;
    }
  };

/**
 * Submits artwork to the server.
 * @param {FormData} formData - The artwork data to be submitted.
 * @param {string} csrfToken - The CSRF token for authentication.
 * @returns {Promise<{ message: string; post?: ArtworkResponse }>} Response message and optional artwork data.
 * @throws {Error} If submission fails.
 */
  export const submitArtwork = async (
    formData: FormData,
    csrfToken: string
  ): Promise<{ message: string; post?: ArtworkResponse }> => {
    try {
      const response = await fetch(`${API_URL}/api/artworks`, {
        method: "POST",
        headers: {
          "X-XSRF-TOKEN": csrfToken,
        },
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 422) {
          // Handle Laravel validation errors
          const data = await response.json();
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat().join(" ");
            throw new Error(errorMessages);
          } else {
            throw new Error(data.message || "Validation failed");
          }
        }

        throw new Error("Failed to submit artwork");
      }

      return await response.json(); // Success response
    } catch (error) {
      console.error("Error submitting artwork", error);
      throw error;
    }
  };
/**
 * Fetches all artworks.
 * @returns {Promise<ArtworkResponse[]>} List of artworks.
 * @throws {Error} If fetching artworks fails.
 */
  export const fetchArtworks = async (): Promise<ArtworkResponse[]> => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      //const authToken = localStorage.getItem('auth_token');

      // if (!authToken) {
      //   throw new Error('Authentication token is missing');
      // }

      const response = await fetch(`${API_URL}/api/artworks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
          // 'Authorization': `Bearer ${authToken}`,
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
/**
 * Fetches post data by its ID.
 * @param {string} postId - The ID of the post.
 * @returns {Promise<ArtworkResponse>} The fetched post data.
 * @throws {Error} If fetching the post fails.
 */
  export const fetchPostById = async (postId: string): Promise<ArtworkResponse> => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      const authToken = localStorage.getItem('auth_token');
  
      if (!authToken) {
        throw new Error('Authentication token is missing');
      }
  
      const response = await fetch(`${API_URL}/api/artworks/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
          'Authorization': `Bearer ${authToken}`,
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching post by ID: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
    }
  };
/**
 * Deletes a post by its ID.
 * @param {string} postId - The ID of the post to delete.
 * @returns {Promise<{ message: string }>} Response message.
 * @throws {Error} If deleting the post fails.
 */
export const deletePost = async (postId: string): Promise<{ message: string }> => {
  try {
    const csrfToken = getCsrfTokenFromCookie();

    const response = await fetch(`${API_URL}/api/artworks/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken,
        "Authorization": `Bearer ${getAuthToken()}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete post.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};





