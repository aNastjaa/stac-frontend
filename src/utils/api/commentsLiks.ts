import { API_URL, getCsrfTokenFromCookie } from "../api";
import { Comment, Like } from "../types";

// API functions for handling comments

/**
 * Fetches the comments associated with a specific post.
 * @param postId The ID of the post to fetch comments for.
 * @returns A list of comments for the post.
 */
export const fetchComments = async (postId: string): Promise<Comment[]> => {
    try {
        const response = await fetch(`${API_URL}/api/artworks/${postId}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrfTokenFromCookie(), // CSRF token for security
            },
            credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }

        const comments = await response.json();
        return comments;
    } catch (error) {
        console.error('Error fetching comments:', error);
        return []; // Return an empty array if an error occurs
    }
};

/**
 * Creates a new comment on a specific post.
 * @param postId The ID of the post to comment on.
 * @param commentText The text of the comment.
 * @returns The newly created comment.
 */
export const createComment = async (postId: string, commentText: string): Promise<Comment> => {
    try {
        const response = await fetch(`${API_URL}/api/artworks/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrfTokenFromCookie(), // CSRF token for security
            },
            body: JSON.stringify({ comment_text: commentText }),
            credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
            throw new Error('Failed to post comment');
        }

        const newComment = await response.json();
        return newComment;
    } catch (error) {
        console.error('Error posting comment:', error);
        throw error; // Propagate the error
    }
};

/**
 * Deletes a specific comment on a post.
 * @param postId The ID of the post containing the comment.
 * @param commentId The ID of the comment to delete.
 */
export const deleteComment = async (postId: string, commentId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/api/artworks/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': getCsrfTokenFromCookie(), // CSRF token for security
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error; // Propagate the error
    }
};

// API functions for handling likes

/**
 * Likes a specific post.
 * @param postId The ID of the post to like.
 * @returns The created like object.
 */
export const likePost = async (postId: string): Promise<Like> => {
    try {
        const response = await fetch(`${API_URL}/api/artworks/${postId}/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrfTokenFromCookie(), // CSRF token for security
            },
            credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
            throw new Error('Failed to like post');
        }

        const like = await response.json();
        return like;
    } catch (error) {
        console.error('Error liking post:', error);
        throw error; // Propagate the error
    }
};

/**
 * Unlikes a specific post.
 * @param postId The ID of the post to unlike.
 * @param likeId The ID of the like to remove.
 */
export const unlikePost = async (postId: string, likeId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/api/artworks/${postId}/likes/${likeId}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': getCsrfTokenFromCookie(), 
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        });

        if (!response.ok) {
            throw new Error('Failed to unlike post');
        }
    } catch (error) {
        console.error('Error unliking post:', error);
        throw error; // Propagate the error
    }
};

/**
 * Fetches the likes associated with a specific post.
 * @param postId The ID of the post to fetch likes for.
 * @returns A list of likes for the post.
 */
export const fetchLikes = async (postId: string): Promise<Like[]> => {
    try {
        console.log(`Fetching likes for post ID: ${postId}`);

        const response = await fetch(`${API_URL}/api/artworks/${postId}/likes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
            },
            credentials: 'include',
        });

        console.log('fetchLikes response status:', response.status);
        if (!response.ok) {
            throw new Error(`Failed to fetch likes (Status: ${response.status})`);
        }

        const likes = await response.json();
        console.log('Fetched likes:', likes);

        return likes;
    } catch (error) {
        console.error('Error fetching likes:', error);
        return [];
    }
};


/**
 * Checks if the user has liked a specific post.
 * @param postId The ID of the post to check.
 * @returns A boolean indicating whether the user liked the post.
 */
export const checkIfUserLiked = async (postId: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/api/artworks/${postId}/likes/check`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": getCsrfTokenFromCookie(), // CSRF token for security
            },
            credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
            throw new Error("Failed to check if user liked the post");
        }

        const data = await response.json();
        return data.liked; // Return whether the user liked the post
    } catch (error) {
        console.error("Error checking if user liked the post:", error);
        return false; // Return false if an error occurs
    }
};
