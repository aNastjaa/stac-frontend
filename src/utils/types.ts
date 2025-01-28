export interface ErrorMessages {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}
 
  export interface Theme {
    id: string;
    theme_name: string;  // Updated field name
    start_date: string;
    posts: Post[]; // Associated posts
  }

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

  export interface UserProfileStatsType {
    posts_count: number;
    comments_count: number;
    likes_count: number;
  }

  export interface UploadResponse {
    id: string; 
    file_url: string;
    file_type?: string;
    avatar_url?: string;
    brand_logo_url?: string;
  }

  export interface Role {
    id: string;
    name: "basic" | "pro" | "admin";
  }
  
  export interface User {
    id: string;
    username: string;
    email: string;
    role: Role; 
    email_verified_at?: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface SponsorChallenge {
    id: string;
    title: string;
    brand_logo?: string;
    brand_logo_id: string;
    brief: string;
    brand_name: string;
    submission_deadline: string;
  }
  
  export interface SponsorSubmission {
    id: string;
    challenge_id: string;
    user_id: string;
    status: "pending" | "accepted" | "rejected";
    created_at: string;
    updated_at: string;
  }
  
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
  
  export interface Submission {
    id: string;
    user_id: string;
    user: string;
    image_path: string;
    sponsor_challenge_id: string; 
    status: "pending" | "approved" | "rejected";
    description: string;
    created_at: string;
    updated_at: string;
  }
  
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

  export interface Like {
    id: string; 
    user_id: string; 
    post_id: string; 
    created_at: string;
    updated_at: string; 
  }
