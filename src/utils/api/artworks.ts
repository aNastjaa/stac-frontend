//-------------------------------------------------------------------------------------------------------------
//POST (Artworks routing)
//-------------------------------------------------------------------------------------------------------------

import { API_URL, getCsrfTokenFromCookie} from "../api";
import { ArtworkResponse, Theme } from "../types";

// Fetch the current theme for the artwork
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
// Submit artwork
  export const submitArtwork = async (
    formData: FormData,
    csrfToken: string
  ): Promise<ArtworkResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/artworks`, {
        method: 'POST',
        headers: {
          'X-XSRF-TOKEN': csrfToken, 
        },
        body: formData,
        credentials: 'include', 
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit artwork');
      }
  
      return await response.json(); 
    } catch (error) {
      console.error('Error submitting artwork', error);
      throw error;
    }
  };
//Get all artworks
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
// Get post data by id
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