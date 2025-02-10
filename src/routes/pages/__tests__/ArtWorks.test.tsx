import { it, expect, vi } from 'vitest';
import { fetchCurrentTheme, submitArtwork, fetchArtworks, fetchPostById, deletePost } from '../../../utils/api/artworks';
import { getCsrfTokenFromCookie } from '../../../utils/api'; // Correct import for CSRF token function
import { ArtworkResponse, Theme } from '../../../utils/types';

// Mocking API module at the top
vi.mock('../../../utils/api', async () => {
  const actual = await vi.importActual('../../../utils/api');
  return {
    ...actual,
    getCsrfTokenFromCookie: vi.fn().mockReturnValue('mock-csrf-token'),
  };
});

// Mocked theme data
const mockTheme: Theme = {
  id: '1',
  theme_name: 'Art Theme',
  start_date: '2025-02-10',
  posts: [],
};

// Mocked CSRF token in document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: 'XSRF-TOKEN=mock-csrf-token',
});

// Mocked ArtworkResponse
const mockArtworkResponse: ArtworkResponse = {
  id: '1',
  user_id: '1',
  description: 'Artwork Description',
  image_path: 'path_to_image.jpg',
  created_at: '2025-02-10',
  updated_at: '2025-02-10',
  status: 'published',
  user: {
    id: '1',
    username: 'artist_username',
    avatar_url: 'avatar_url.jpg',
  },
  theme: {
    id: '1',
    theme_name: 'Art Theme',
  },
  likes: 10,
  comments: [
    {
      id: '1',
      username: 'commenter',
      text: 'Nice artwork!',
      created_at: '2025-02-10',
    },
  ],
  comments_count: 1,
  likes_count: 10,
};

// Mocked artworks response
const mockArtworks: ArtworkResponse[] = [mockArtworkResponse];

// Mock Auth Token function
const getAuthToken = (): string | null => 'mock-auth-token';

// Mock fetch API responses
vi.mock('../../../utils/api/artworks', () => ({
  fetchCurrentTheme: vi.fn().mockResolvedValue([mockTheme]),
  submitArtwork: vi.fn().mockResolvedValue({ 
    message: 'Artwork submitted successfully', 
    post: mockArtworkResponse 
  }),
  fetchArtworks: vi.fn().mockResolvedValue(mockArtworks),
  fetchPostById: vi.fn().mockResolvedValue(mockArtworkResponse),
  deletePost: vi.fn().mockResolvedValue({ message: 'Post deleted successfully' }),
}));


// **Tests**
it('should fetch the current theme and use CSRF token and auth token', async () => {
  const csrfToken = getCsrfTokenFromCookie();
  const authToken = getAuthToken();

  await fetchCurrentTheme();

  expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/api/themes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
      Authorization: `Bearer ${authToken}`,
    },
  });

  expect(getCsrfTokenFromCookie).toHaveBeenCalled();
});

it('should submit artwork and pass CSRF token and auth token', async () => {
  const formData = new FormData();
  formData.append('file', new Blob(['file contents'], { type: 'image/jpeg' }), 'artwork.jpg');

  const csrfToken = getCsrfTokenFromCookie();
  const authToken = getAuthToken();
  const result = await submitArtwork(formData, csrfToken);

  expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/api/artworks', {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-TOKEN': csrfToken,
      Authorization: `Bearer ${authToken}`,
    },
  });

  expect(getCsrfTokenFromCookie).toHaveBeenCalled();
  expect(result.message).toBe('Artwork submitted successfully');
  expect(result.post).toEqual(mockArtworkResponse);
});

it('should fetch all artworks and use CSRF token and auth token', async () => {
  const csrfToken = getCsrfTokenFromCookie();
  const authToken = getAuthToken();

  await fetchArtworks();

  expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/api/artworks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
      Authorization: `Bearer ${authToken}`,
    },
  });

  expect(getCsrfTokenFromCookie).toHaveBeenCalled();
});

it('should fetch post data by ID and use CSRF token and auth token', async () => {
  const postId = '1';
  const csrfToken = getCsrfTokenFromCookie();
  const authToken = getAuthToken();

  await fetchPostById(postId);

  expect(global.fetch).toHaveBeenCalledWith(`http://localhost:8000/api/artworks/${postId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
      Authorization: `Bearer ${authToken}`,
    },
  });

  expect(getCsrfTokenFromCookie).toHaveBeenCalled();
});

it('should delete post and use CSRF token and auth token', async () => {
  const postId = '1';
  const csrfToken = getCsrfTokenFromCookie();
  const authToken = getAuthToken();

  const result = await deletePost(postId);

  expect(global.fetch).toHaveBeenCalledWith(`http://localhost:8000/api/artworks/${postId}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
      Authorization: `Bearer ${authToken}`,
    },
  });

  expect(getCsrfTokenFromCookie).toHaveBeenCalled();
  expect(result.message).toBe('Post deleted successfully');
});
