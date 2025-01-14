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