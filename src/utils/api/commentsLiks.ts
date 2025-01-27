// API functions for handling comments

import { API_URL, getCsrfTokenFromCookie } from "../api";
import { Comment, Like } from "../types";

export const fetchComments = async (postId: string): Promise<Comment[]> => {
    try {
      const response = await fetch(`${API_URL}/api/artworks/${postId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
  
      const comments = await response.json();
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };
  
  export const createComment = async (postId: string, commentText: string): Promise<Comment> => {
    try {
      const response = await fetch(`${API_URL}/api/artworks/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
        },
        body: JSON.stringify({ comment_text: commentText }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
  
      const newComment = await response.json();
      return newComment;
    } catch (error) {
      console.error('Error posting comment:', error);
      throw error;
    }
  };
  
  export const deleteComment = async (postId: string, commentId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/artworks/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };
  
  // API functions for handling likes

export const likePost = async (postId: string): Promise<Like> => {
    try {
      const response = await fetch(`${API_URL}/api/artworks/${postId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
  
      const like = await response.json();
      return like;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  };
  
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
      throw error;
    }
  };
  
  export const fetchLikes = async (postId: string): Promise<Like[]> => {
    try {
      const response = await fetch(`${API_URL}/api/artworks/${postId}/likes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch likes');
      }
  
      const likes = await response.json();
      return likes;
    } catch (error) {
      console.error('Error fetching likes:', error);
      return [];
    }
  };
  
// Function to check if the user has liked the post
    export const checkIfUserLiked = async (postId: string): Promise<boolean> => {
        try {
        const response = await fetch(`${API_URL}/api/artworks/${postId}/likes/check`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfTokenFromCookie(),
            },
            credentials: "include",
        });
    
        if (!response.ok) {
            throw new Error("Failed to check if user liked the post");
        }
    
        const data = await response.json();
        return data.liked;
        } catch (error) {
        console.error("Error checking if user liked the post:", error);
        return false;
        }
    };
  