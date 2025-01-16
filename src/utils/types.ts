export interface CustomError {
    message: string;
    response?: {
      data: {
        message: string;
      };
    };
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
    theme_id: string;
    image_path: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface UserProfileType {
    username: string;
    avatar_id?: string | null;
    avatar_url: string | null;
    posts_count: number;
    comments_count: number;
    likes_count: number;
    full_name: string | null;
    bio: string | null;
    external_links?: string[];  // Optional field
  }

  export interface UploadResponse {
    file_url: string;
    file_type?: string;
    avatar_url?: string;
  }

  export interface Role {
    id: string;
    name: "basic" | "pro" | "admin";
  }
  
  export interface User {
    id: string;
    username: string;
    email: string;
    role: Role; // The role information associated with the user
    email_verified_at?: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface SponsorChallenge {
    id: string;
    title: string;
    brief: string;
    brand_name: string;
    brand_logo_id: string; 
    submission_deadline: string; 
    submissions: SponsorSubmission[]; 
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
    theme_id: string;
    title: string;
    description: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    updated_at: string;
  }
  
  export interface Submission {
    id: string;
    user_id: string;
    sponsor_challenge_id: string; // Associated sponsor challenge
    status: "pending" | "approved" | "rejected";
    description: string;
    created_at: string;
    updated_at: string;
  }
  