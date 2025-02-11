import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArtWorks from '../ArtWorks';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // Wrap in MemoryRouter
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
  test('submits a new artwork correctly', async () => {
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

    // Interact with form fields (file input, description)
    const fileInput = screen.getByTestId('file-input');
    const descriptionInput = screen.getByPlaceholderText('Enter artwork description');
    
    // Mock file input
    const mockFile = new Blob(['mock-image'], { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile],
    });

    fireEvent.change(fileInput);
    fireEvent.change(descriptionInput, { target: { value: 'Beautiful yellow painting' } });

    // Submit the form
    const submitFormButton = screen.getByText('Submit Artwork');
    fireEvent.click(submitFormButton);

    // Wait for the response and check that it's received
    await waitFor(() => expect(vi.mocked(submitArtwork)).toHaveBeenCalled());

    // Resolve the promise and check the result
    const response = await vi.mocked(submitArtwork).mock.results[0].value;

    // Assert that the response is correct
    expect(response).toEqual({
      message: 'Artwork submitted successfully!',
      post: { id: 'mock-post-id', image_path: 'mock-image-path', description: 'Mock Description' },
    });
  });
});
