import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArtWorks from '../ArtWorks';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { submitArtwork } from '../../../utils/api/artworks';
import { setCsrfCookie } from '../../../utils/api';

// Mocking necessary functions
vi.mock('../../../utils/api/artworks', () => ({
  fetchCurrentTheme: vi.fn().mockResolvedValue({
    id: 'mock-theme-id',
    theme_name: 'Yellow Art',
  }),
  submitArtwork: vi.fn().mockResolvedValue({
    message: 'Artwork submitted successfully!',
    post: { id: 'mock-post-id', image_path: 'mock-image-path', description: 'Mock Description' },
  }),
  fetchArtworks: vi.fn().mockResolvedValue([]),
  getCsrfTokenFromCookie: vi.fn().mockResolvedValue('mocked-csrf-token'),
}));

beforeAll(() => {
  // Step 1: Mocking `localStorage` to simulate a stored token
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(() => 'mock-token'),  // Mock returning a mock token
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });

  // Step 2: Mocking `document.cookie` to simulate the presence of a CSRF token
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: 'XSRF-TOKEN=mocked-csrf-token',
  });

  // Step 3: Mocking global alert to prevent errors during the test
  global.alert = vi.fn();

  // Step 4: Mocking `URL.createObjectURL` to prevent errors in tests related to file handling
  global.URL.createObjectURL = vi.fn().mockImplementation(() => 'mocked-url');
});

afterAll(() => {
  // Step 5: Restore mocks after all tests
  vi.restoreAllMocks();
});

beforeEach(async () => {
  // Step 6: Ensure the CSRF cookie is set before each test
  await setCsrfCookie();
});

describe('ArtWorks Component', () => {
  test('displays error message when form is submitted with empty fields', async () => {
    // Step 7: Render the ArtWorks component within a router context (needed for routing)
    render(
      <MemoryRouter>
        <ArtWorks />
      </MemoryRouter>
    );

    // Step 8: Open the artwork submission form by clicking the "Submit" button
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Step 9: Wait for the form to be rendered and ensure it's visible on the screen
    const form = await screen.findByText('Submit Your Artwork');
    expect(form).toBeInTheDocument();

    // Step 10: Try submitting the form with empty fields (since no inputs are filled)
    const submitFormButton = screen.getByText('Submit Artwork');
    fireEvent.click(submitFormButton);

    // Step 11: Wait for the error message to appear, indicating that fields are required
    await waitFor(() => {
      expect(screen.getByText('Image and Description are required')).toBeInTheDocument();
    });

    // Step 12: Ensure that the `submitArtwork` function was not called, because the form validation failed
    await waitFor(() => expect(vi.mocked(submitArtwork)).not.toHaveBeenCalled());
  });
});
