import { render, screen, waitFor } from "@testing-library/react";
import EditProfile from "../../../components/EditProfile";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {
  createUserProfile,
  updateUserProfile,
  getProfileIdByUserId,
  getUserProfileByProfileId,
  setCsrfCookie,
} from "../../../utils/api";

// Mock API functions
vi.mock("../../../utils/api", () => ({
  uploadAvatar: vi.fn().mockResolvedValue({ id: "mock-avatar-id" }),
  createUserProfile: vi.fn().mockResolvedValue({
    id: "mock-profile-id",
    full_name: "John Doe",
    bio: "Artist",
  }),
  updateUserProfile: vi.fn().mockResolvedValue({
    id: "mock-profile-id",
    full_name: "John Doe Updated",
    bio: "Updated bio",
  }),
  getProfileIdByUserId: vi.fn().mockResolvedValue("mock-profile-id"),
  getUserProfileByProfileId: vi.fn().mockResolvedValue({
    id: "mock-profile-id",
    full_name: "John Doe",
    bio: "Artist",
  }),
  setCsrfCookie: vi.fn().mockResolvedValue("mocked-csrf-token"),
  getUserIdFromLocalStorage: vi.fn().mockReturnValue("mock-user-id"),
}));

beforeAll(() => {
  global.alert = vi.fn(); // Mock the alert function
  vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppresses console errors
});

beforeEach(async () => {
  await setCsrfCookie(); // Ensures CSRF cookie is set before each test
  vi.clearAllMocks(); // Clear any previous mock calls before each test
});

describe("EditProfile Component", () => {
  
  // Test: Create a new user profile if none exists
  test("creates a new user profile if none exists", async () => {
    // Simulate no existing profile (return null)
    vi.mocked(getProfileIdByUserId).mockResolvedValueOnce(null);

    // Render the EditProfile component inside MemoryRouter to handle routing
    render(
      <MemoryRouter>
        <EditProfile />
      </MemoryRouter>
    );

    // Step 1: Wait for the profile ID lookup to be called
    await waitFor(() => {
      expect(getProfileIdByUserId).toHaveBeenCalledTimes(1); // Ensure the profile lookup was triggered
    });

    // Step 2: Ensure form is empty because there's no existing profile
    expect(screen.getByPlaceholderText("Full Name")).toHaveValue(""); // Full Name field should be empty
    expect(screen.getByPlaceholderText("Add your bio here")).toHaveValue(""); // Bio field should be empty

    // Step 3: Fill out the form with new data
    const fullNameInput = screen.getByPlaceholderText("Full Name");
    const bioInput = screen.getByPlaceholderText("Add your bio here");
    const saveButton = screen.getByRole("button", { name: /save/i });

    await userEvent.type(fullNameInput, "John Doe"); // Simulate typing in the full name
    await userEvent.type(bioInput, "New bio"); // Simulate typing in the bio

    // Step 4: Simulate clicking the save button (should call createUserProfile)
    await userEvent.click(saveButton);

    // Step 5: Wait for the createUserProfile API call to be made
    await waitFor(() => {
      expect(createUserProfile).toHaveBeenCalledTimes(1); // Ensure the profile creation API call was made
    });

    // Step 6: Assert that the profile creation alert is displayed
    expect(global.alert).toHaveBeenCalledWith("Profile created successfully!");
  });

  // Test: Load an existing user profile and allow editing
  test("loads an existing user profile and allows editing", async () => {
    // Render the EditProfile component inside MemoryRouter to handle routing
    render(
      <MemoryRouter>
        <EditProfile />
      </MemoryRouter>
    );

    // Step 1: Wait for profile ID to be fetched
    await waitFor(() => {
      expect(getProfileIdByUserId).toHaveBeenCalledTimes(1); // Ensure profile ID lookup was called
    });

    // Step 2: Wait for user profile data to be fetched
    await waitFor(() => {
      expect(getUserProfileByProfileId).toHaveBeenCalledTimes(1); // Ensure the profile data fetching API call was made
    });

    // Step 3: Ensure form is pre-filled with existing profile data
    expect(screen.getByPlaceholderText("Full Name")).toHaveValue("John Doe"); // Full Name field should be pre-filled
    expect(screen.getByPlaceholderText("Add your bio here")).toHaveValue("Artist"); // Bio field should be pre-filled

    // Step 4: Edit the form data
    const fullNameInput = screen.getByPlaceholderText("Full Name");
    const bioInput = screen.getByPlaceholderText("Add your bio here");
    const saveButton = screen.getByRole("button", { name: /save/i });

    await userEvent.clear(fullNameInput); // Clear the existing full name
    await userEvent.type(fullNameInput, "John Doe Updated"); // Type the new full name
    await userEvent.clear(bioInput); // Clear the existing bio
    await userEvent.type(bioInput, "Updated bio"); // Type the new bio

    // Step 5: Simulate clicking the save button (should call updateUserProfile)
    await userEvent.click(saveButton);

    // Step 6: Wait for the updateUserProfile API call to be made
    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledTimes(1); // Ensure the profile update API call was made
    });

    // Step 7: Assert that the profile updated alert is displayed
    expect(global.alert).toHaveBeenCalledWith("Profile updated successfully!");
  });

  // Test: Display error message if loading profile fails
  test("displays error message if loading profile fails", async () => {
    // Mock the function to simulate an error loading the profile
    vi.mocked(getUserProfileByProfileId).mockRejectedValueOnce(new Error("Failed to load profile"));
    
    // Render the EditProfile component inside MemoryRouter to handle routing
    render(
      <MemoryRouter>
        <EditProfile />
      </MemoryRouter>
    );
  
    // Step 1: Wait for the component to finish loading
    await waitFor(() => screen.getByText(/create your account/i)); // Wait for the "create your account" text to show
  
    // Step 2: Check for the error message related to loading failure
    const errorMessage = await screen.findByText(/Error fetching user profile/i); // Find the error message in the DOM
    
    // Step 3: Assert that the error message is displayed
    expect(errorMessage).toBeInTheDocument(); // Ensure the error message is displayed in the DOM
  });
});
