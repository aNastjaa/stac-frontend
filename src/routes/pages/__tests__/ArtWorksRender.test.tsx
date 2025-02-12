import { render, screen, act} from '@testing-library/react';
import ArtWorks from '../ArtWorks';
import { vi } from 'vitest';
import { setCsrfCookie } from '../../../utils/api';
import { MemoryRouter } from 'react-router';

// Mocking the API functions
vi.mock('../../../utils/api', () => ({
  API_URL: 'http://localhost:8000', 
  setCsrfCookie: vi.fn().mockResolvedValue(undefined),
  fetchUserArtworks: vi.fn(() => Promise.resolve([])), 
  getCsrfTokenFromCookie: vi.fn().mockResolvedValue('mocked-csrf-token'), 
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
    // Step 1: Render the ArtWorks component wrapped in a MemoryRouter
    // This simulates the router context, as the component may depend on it for routing.
    await act(async () => {
      render(
        <MemoryRouter>
          <ArtWorks />
        </MemoryRouter>
      );
    });

    // Step 2: Wait for the heading element with the text "ArtWorks" to be rendered
    // We are confirming that the component correctly displays the title "ArtWorks" on the screen.
    const headings = await screen.findAllByText(/ArtWorks/i);
    
    // Step 3: Assert that the heading is rendered by checking its presence on the screen
    // This ensures the component's content is correctly rendered and visible to the user.
    expect(headings.length).toBeGreaterThan(0); // The heading should be present at least once
  });
});
