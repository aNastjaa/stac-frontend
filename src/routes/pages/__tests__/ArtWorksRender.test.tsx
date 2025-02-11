import { render, screen, act} from '@testing-library/react';
import ArtWorks from '../ArtWorks';
import { vi } from 'vitest';
import { setCsrfCookie } from '../../../utils/api'; // Corrected imports
import { MemoryRouter } from 'react-router';

// Mocking the API functions
vi.mock('../../../utils/api', () => ({
  // Directly mock necessary functions here
  API_URL: 'http://localhost:8000', // Set your API_URL mock
  setCsrfCookie: vi.fn().mockResolvedValue(undefined),
  fetchUserArtworks: vi.fn(() => Promise.resolve([])), // Updated function name
  getCsrfTokenFromCookie: vi.fn().mockResolvedValue('mocked-csrf-token'), // Mocked getCsrfTokenFromCookie
  fetchCurrentTheme: vi.fn(() => Promise.resolve({/* mock theme data */})),
  fetchArtworks: vi.fn(() => Promise.resolve({/* mock artworks data */})),
}));

// Mocking localStorage for testing
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(() => 'mock-token'), // Mock token value
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });

  // Mocking cookies to return a CSRF token
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: 'XSRF-TOKEN=mocked-csrf-token', // Mock the CSRF token in the cookies
  });
});

beforeEach(async () => {
  // Ensure the CSRF cookie is set correctly before each test
  await act(async () => {
    await setCsrfCookie(); // Mocked function call to set the CSRF cookie
  });
});

// --- TEST ARTWORK RENDER ---
describe('ArtWorks Component', () => {
  test('renders the ArtWorks component correctly', async () => {
    // Render the component with the MemoryRouter for routing context
    await act(async () => {
      render(
        <MemoryRouter>
          <ArtWorks />
        </MemoryRouter>
      );
    });

    // Wait for the ArtWorks heading to be rendered
    const headings = await screen.findAllByText(/ArtWorks/i);
    expect(headings.length).toBeGreaterThan(0);
  });
});
