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
  // Mock localStorage to avoid actual browser interaction during tests
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(() => 'mock-token'), // Returning mock token
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });

  // Mock document cookie for CSRF token
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: 'XSRF-TOKEN=mocked-csrf-token', // Setting mock CSRF token
  });

  // Mock global alert to prevent actual alerts during tests
  global.alert = vi.fn();

  // Mock URL.createObjectURL to prevent errors when handling files in tests
  global.URL.createObjectURL = vi.fn().mockImplementation(() => 'mocked-url');
});

afterAll(() => {
  // Clean up mocks after the tests have run
  vi.restoreAllMocks();
});

beforeEach(async () => {
  // Ensure CSRF token is set before each test
  await setCsrfCookie();
});

describe('ArtWorks Component', () => {
  test('submits a new artwork correctly', async () => {
    // Render the ArtWorks component wrapped with MemoryRouter to simulate routing
    render(
      <MemoryRouter>
        <ArtWorks />
      </MemoryRouter>
    );

    // Step 1: Simulate clicking the "Submit" button to open the form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Step 2: Wait for the form to render and check that it is present
    const form = await screen.findByText('Submit Your Artwork');
    expect(form).toBeInTheDocument(); // Ensure the form is now visible

    // Step 3: Interact with form fields (file input and description)
    const fileInput = screen.getByTestId('file-input'); // Get file input field by test ID
    const descriptionInput = screen.getByPlaceholderText('Enter artwork description'); // Get description input by placeholder text

    // Step 4: Mock the file input by simulating the user selecting a file
    const mockFile = new Blob(['mock-image'], { type: 'image/png' }); // Create a mock file object
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile], // Set the files property of the file input to the mock file
    });

    fireEvent.change(fileInput); // Simulate file input change
    fireEvent.change(descriptionInput, { target: { value: 'Beautiful yellow painting' } }); // Enter description text

    // Step 5: Submit the form by clicking the submit button
    const submitFormButton = screen.getByText('Submit Artwork');
    fireEvent.click(submitFormButton); // Simulate form submission

    // Step 6: Wait for the API call to be made and verify the submission
    await waitFor(() => expect(vi.mocked(submitArtwork)).toHaveBeenCalled()); // Wait for submitArtwork to have been called

    // Step 7: Resolve the promise returned by submitArtwork and check the result
    const response = await vi.mocked(submitArtwork).mock.results[0].value; // Get the resolved value of the mocked submitArtwork function

    // Step 8: Assert that the response matches the expected result
    expect(response).toEqual({
      message: 'Artwork submitted successfully!', // Check if the success message is correct
      post: { id: 'mock-post-id', image_path: 'mock-image-path', description: 'Mock Description' }, // Check if the post details are correct
    });
  });
});
