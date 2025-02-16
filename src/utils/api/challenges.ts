import { API_URL, getAuthToken, getCsrfTokenFromCookie, getUserIdFromLocalStorage } from "../api";
import { SponsorChallenge, SponsorChallengeDetail,Submission, Vote} from "../types";

/**
 * Fetches all the sponsor challenges.
 * @returns {Promise<SponsorChallenge[]>} A list of sponsor challenges.
 * @throws {Error} If fetching sponsor challenges fails.
 */
  export const getChallenges = async (): Promise<SponsorChallenge[]> => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      //const authToken = localStorage.getItem('auth_token');
  
      // if (!authToken) {
      //   throw new Error('Authentication token is missing');
      // }
      const response = await fetch(`${API_URL}/api/sponsor-challenges`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
          //'Authorization': `Bearer ${authToken}`,
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

/**
 * Fetches the details of a specific sponsor challenge.
 * @param {string} challengeId - The ID of the sponsor challenge to fetch.
 * @returns {Promise<SponsorChallengeDetail>} The details of the sponsor challenge.
 * @throws {Error} If fetching challenge details fails.
 */
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

/**
 * Submits a user's artwork to a sponsor challenge.
 * @param {string} challengeId - The ID of the challenge to submit the artwork to.
 * @param {FormData} formData - The form data containing the artwork and other information.
 * @param {string} csrfToken - The CSRF token to prevent CSRF attacks.
 * @returns {Promise<Submission>} The submission data after the submission is successful.
 * @throws {Error} If the submission fails.
 */
  export const submitWork = async (
    challengeId: string,
    formData: FormData,
    csrfToken: string
  ): Promise<Submission> => {
    try {  
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

/**
 * Fetches all submissions for a given sponsor challenge.
 * @param {string} challengeId - The ID of the sponsor challenge whose submissions are to be fetched.
 * @returns {Promise<Submission[]>} A list of submissions for the specified challenge.
 * @throws {Error} If fetching submissions fails.
 */
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

/**
 * Deletes a submission for a specific sponsor challenge.
 * @param {string} submissionId - The ID of the submission to delete.
 * @param {string} challengeId - The ID of the sponsor challenge to delete the submission from.
 * @returns {Promise<string>} A message confirming the submission deletion.
 * @throws {Error} If the deletion fails.
 */
  export const deleteSubmission = async (submissionId: string, challengeId: string): Promise<string> => {
    try {
      // Get CSRF token from cookies
      const csrfToken = getCsrfTokenFromCookie();
  
      const response = await fetch(`${API_URL}/api/sponsor-challenges/${challengeId}/submissions/${submissionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,
          "Authorization": `Bearer ${getAuthToken()}`,
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete submission.");
      }
  
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error("Error deleting submission:", error);
      throw error;
    }
  };

/**
 * Allows a user to vote for a submission in a sponsor challenge.
 * @param {string} challengeId - The ID of the sponsor challenge to vote in.
 * @param {string} submissionId - The ID of the submission to vote for.
 * @returns {Promise<Vote>} The vote data after the voting process.
 * @throws {Error} If the voting process fails.
 */
  export const voteForSubmission = async (challengeId: string, submissionId: string): Promise<Vote> => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      const authToken = localStorage.getItem("auth_token");
  
      if (!authToken) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await fetch(`${API_URL}/api/sponsor-challenges/${challengeId}/submissions/${submissionId}/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`Error voting: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error voting for submission:", error);
      throw error;
    }
  };

/**
 * Removes a user's vote for a submission in a sponsor challenge.
 * @param {string} challengeId - The ID of the sponsor challenge to remove the vote from.
 * @param {string} submissionId - The ID of the submission to remove the vote from.
 * @returns {Promise<void>} Resolves when the vote is removed successfully.
 * @throws {Error} If removing the vote fails.
 */
  export const removeVote = async (challengeId: string, submissionId: string): Promise<void> => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      const authToken = localStorage.getItem("auth_token");
  
      if (!authToken) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await fetch(`${API_URL}/api/sponsor-challenges/${challengeId}/submissions/${submissionId}/votes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`Error removing vote: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error removing vote:", error);
      throw error;
    }
  };
  
/**
 * Checks whether a user has already voted for a specific submission in a sponsor challenge.
 * @param {string} challengeId - The ID of the sponsor challenge to check votes for.
 * @param {string} submissionId - The ID of the submission to check votes for.
 * @returns {Promise<boolean>} True if the user has voted for the submission, false otherwise.
 * @throws {Error} If checking the vote status fails.
 */
  export const checkUserVote = async (challengeId: string, submissionId: string): Promise<boolean> => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      const authToken = localStorage.getItem("auth_token");
  
      if (!authToken) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await fetch(`${API_URL}/api/sponsor-challenges/${challengeId}/submissions/${submissionId}/votes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`Error checking vote status: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.some((vote: { user_id: string }) => vote.user_id === getUserIdFromLocalStorage());
    } catch (error) {
      console.error("Error checking vote status:", error);
      return false;
    }
  };  

  export const getVotesCount = async (challengeId: string, submissionId: string): Promise<number> => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      const authToken = localStorage.getItem("auth_token");
  
      if (!authToken) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await fetch(`${API_URL}/api/sponsor-challenges/${challengeId}/submissions/${submissionId}/votes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching votes: ${response.statusText}`);
      }
  
      const votes = await response.json();
      return votes.length; // Count the total votes
    } catch (error) {
      console.error("Error fetching votes count:", error);
      return 0; // Return 0 on error to prevent app crashes
    }
  };
  
 
