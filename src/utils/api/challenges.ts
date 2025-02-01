import { API_URL, getCsrfTokenFromCookie } from "../api";
import { SponsorChallenge, SponsorChallengeDetail,Submission, VoteResponse } from "../types";

export const getChallenges = async (): Promise<SponsorChallenge[]> => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      const authToken = localStorage.getItem('auth_token');
  
      if (!authToken) {
        throw new Error('Authentication token is missing');
      }
  
      const response = await fetch(`${API_URL}/api/sponsor-challenges`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
          'Authorization': `Bearer ${authToken}`,
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching sponsor challenges: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching sponsor challenges:', error);
      throw error;
    }
  };
  export const getChallengeDetails = async (challengeId: string): Promise<SponsorChallengeDetail> => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      const authToken = localStorage.getItem('auth_token');
  
      if (!authToken) {
        throw new Error('Authentication token is missing');
      }
  
      const response = await fetch(`${API_URL}/api/sponsor-challenges/${challengeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
          'Authorization': `Bearer ${authToken}`,
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching challenge details: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching challenge details:', error);
      throw error;
    }
  };
  export const submitWork = async (
    challengeId: string,
    formData: FormData,
    csrfToken: string
  ): Promise<Submission> => {
    try {
      console.log('Submitting work...');
      console.log('Challenge ID:', challengeId);
      console.log('CSRF Token:', csrfToken);
  
      // Log form data keys and values
      for (const pair of formData.entries()) {
        console.log(`FormData - ${pair[0]}:`, pair[1]);
      }
  
      const response = await fetch(`${API_URL}/api/sponsor-challenges/${challengeId}/submissions`, {
        method: 'POST',
        headers: {
          'X-XSRF-TOKEN': csrfToken, // Ensure CSRF token is passed correctly
        },
        body: formData, // Use FormData to submit file and data
        credentials: 'include', // Include credentials to send cookies (if needed)
      });
  
      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response Body:', errorText);
        throw new Error(`Failed to submit work: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log('Submission successful:', responseData);
  
      return responseData;
    } catch (error) {
      console.error('Error submitting work:', error);
      throw error;
    }
  };
  
    export const getSubmissions = async (challengeId: string): Promise<Submission[]> => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      const authToken = localStorage.getItem("auth_token");
  
      if (!authToken) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await fetch(
        `${API_URL}/api/sponsor-challenges/${challengeId}/submissions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken,
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include",
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error fetching submissions: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Explicitly cast the response data to Submission[]
      return data as Submission[];
    } catch (error) {
      console.error("Error fetching submissions:", error);
      throw error;
    }
  };
    export const voteOnSubmission = async (
    challengeId: string,
    submissionId: string
  ): Promise<VoteResponse> => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      const authToken = localStorage.getItem('auth_token');
  
      if (!authToken) {
        throw new Error('Authentication token is missing');
      }
  
      const response = await fetch(`${API_URL}/api/sponsor-challenges/${challengeId}/submissions/${submissionId}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
          'Authorization': `Bearer ${authToken}`,
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to vote on submission');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error voting on submission:', error);
      throw error;
    }
  };
  