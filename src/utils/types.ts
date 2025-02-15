  // Interface for holding error messages related to user inputs.
  export interface ErrorMessages {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  }
  // Interface representing a theme in the application.
  export interface Theme {
    id: string;
    theme_name: string; 
    start_date: string;
    posts: Post[];
  }
  // Interface for the response data when fetching artwork details.
  export interface ArtworkResponse {
    id: string;
    user_id: string;
    image_path: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
    user: { 
      id: string;
      username: string;
      avatar_url: string; 
    };
    theme: { 
      id: string;
      theme_name: string;
    };
    likes: number;
    comments: Array<{
      id: string;
      username: string;
      text: string;
      created_at: string;
  }>; 
  comments_count?: number;
  likes_count?: number;
  }
  // Interface representing the user profile data.
  export interface UserProfileType {
    id: string;
    username: string;
    avatar_id?: string | null;
    avatar_url: string | null;
    posts_count: number;
    comments_count: number;
    likes_count: number;
    full_name: string | null;
    bio: string | null;
    external_links?: string[]; 
  }
  // Interface for user profile statistics (posts, comments, likes counts).
  export interface UserProfileStatsType {
    posts_count: number;
    comments_count: number;
    likes_count: number;
  }
  // Interface for the response data after uploading a file.
  export interface UploadResponse {
    id: string; 
    file_url: string;
    file_type?: string;
    avatar_url?: string;
    brand_logo_url?: string;
  }
  // Interface representing a role of a user (basic, pro, or admin).
  export interface Role {
    id: string;
    name: "basic" | "pro" | "admin";
  }
  // Interface representing a user in the application.
  export interface User {
    id: string;
    username: string;
    email: string;
    role: Role; 
    email_verified_at?: string | null;
    created_at: string;
    updated_at: string;
  }
  // Interface representing a sponsor challenge.
  export interface SponsorChallenge {
    id: string;
    title: string;
    brand_logo?: string;
    brand_logo_id: string;
    brief: string;
    brand_name: string;
    submission_deadline: string;
  } 
  // Interface representing detailed information about a sponsor challenge.
  export interface SponsorChallengeDetail {
    id: string; 
    title: string; 
    description: string;  
    start_date: string;  
    end_date: string;  
    submissions_count: number;
    created_at: string; 
    updated_at: string;
    brand_logo?: string;
    brand_logo_id: string;
    brief: string;
    brand_name: string;
    submission_deadline: string;
}
  // Interface representing a user's submission to a sponsor challenge.
  export interface Submission {
    id: string;
    user_id: string;
    user: {
      id: string;
      username: string;
      avatar_url?: string;
    };
    image_path: string;
    challenge_id: string; 
    status: "pending" | "accepted" | "rejected";
    description: string;
    created_at: string;
    updated_at: string;
    votes_count: number; 
    challengeName?: string;
  }
  // Interface representing a post created by a user in the application.
  export interface Post {
    id: string;
    user_id: string;
    user: string;
    theme_id: string;
    image_path: string;
    description: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    updated_at: string;
  }
  // Interface representing a comment made by a user on a post.
  export interface Comment {
    id: string; 
    user_id: string; 
    post_id: string; 
    comment_text: string; 
    created_at: string; 
    updated_at: string; 
    user: {
      id: string; 
      username: string; 
      avatar_url?: string | null; 
    };
  }
  // Interface representing a like made by a user on a post.
  export interface Like {
    id: string; 
    user_id: string; 
    post_id: string; 
    created_at: string;
    updated_at: string; 
  }
  // Interface representing a vote made by a user on a submission.
  export interface Vote {
    id: string;
    user_id: string;
    submission_id: string;
  }
  