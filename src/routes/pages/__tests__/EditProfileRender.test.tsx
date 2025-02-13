import { render, screen, act } from '@testing-library/react';
import UserProfile from '../UserProfile';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { useNavigate } from 'react-router-dom';

// Mocking useNavigate directly
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
    Link: vi.fn(() => <div>Mock Link</div>),
  }));

// Mocking API functions
vi.mock('../../../utils/api', () => ({
  getUserIdFromLocalStorage: vi.fn(() => 'mock-user-id'),
  getProfileIdByUserId: vi.fn(() => Promise.resolve('mock-profile-id')),
  getUserProfileByProfileId: vi.fn(() =>
    Promise.resolve({
      full_name: 'Mock User',
      bio: 'Mock bio',
      avatar_id: 'mock-avatar-id',
    })
  ),
  fetchAvatarUrl: vi.fn(() => Promise.resolve('mock-avatar-url')),
  fetchUserArtworks: vi.fn(() => Promise.resolve([])),
}));

vi.mock('../../../utils/api/challenges', () => ({
  getChallenges: vi.fn(() => Promise.resolve([])),
  getSubmissions: vi.fn(() => Promise.resolve([])),
}));

// Mock localStorage for auth data
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key) => {
        if (key === 'auth_user') {
          return JSON.stringify({ username: 'MockUser', role_name: 'basic' });
        }
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });
});

// --- TEST USER PROFILE RENDER ---
describe('UserProfile Component', () => {
  test('renders the UserProfile component correctly', async () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    await act(async () => {
      render(
        <MemoryRouter>
          <UserProfile />
        </MemoryRouter>
      );
    });

    // Ensure the username is displayed
    expect(await screen.findByText('@MockUser')).toBeInTheDocument();

    // Ensure the user's full name is displayed
    expect(await screen.findByText('Mock User')).toBeInTheDocument();

    // Ensure the user's bio is displayed
    expect(await screen.findByText('Mock bio')).toBeInTheDocument();
  });
});
