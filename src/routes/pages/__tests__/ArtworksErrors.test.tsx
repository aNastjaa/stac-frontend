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
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(() => 'mock-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });

  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: 'XSRF-TOKEN=mocked-csrf-token',
  });

  // Mock alert to avoid errors in tests
  global.alert = vi.fn();

  // Mock URL.createObjectURL to prevent errors in tests
  global.URL.createObjectURL = vi.fn().mockImplementation(() => 'mocked-url');
});

afterAll(() => {
  vi.restoreAllMocks();
});

beforeEach(async () => {
  await setCsrfCookie();
});

describe('ArtWorks Component', () => {
  test('displays error message when form is submitted with empty fields', async () => {
    render(
      <MemoryRouter>
        <ArtWorks />
      </MemoryRouter>
    );

    // Open the submit form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Wait for the form to be rendered
    const form = await screen.findByText('Submit Your Artwork');
    expect(form).toBeInTheDocument();

    // Submit the form with empty fields
    const submitFormButton = screen.getByText('Submit Artwork');
    fireEvent.click(submitFormButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Image and Description are required')).toBeInTheDocument();
    });

    // Verify the submitArtwork function was not called
    await waitFor(() => expect(vi.mocked(submitArtwork)).not.toHaveBeenCalled());
  });
});
