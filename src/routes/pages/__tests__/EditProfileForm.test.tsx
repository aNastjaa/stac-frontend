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
  global.alert = vi.fn();
  vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppresses console errors
});

beforeEach(async () => {
  await setCsrfCookie();
  vi.clearAllMocks(); // Ensure no old calls interfere
});

describe("EditProfile Component", () => {
  test("creates a new user profile if none exists", async () => {
    // Simulate no existing profile (return null)
    vi.mocked(getProfileIdByUserId).mockResolvedValueOnce(null);

    render(
      <MemoryRouter>
        <EditProfile />
      </MemoryRouter>
    );

    // Wait for profile ID lookup
    await waitFor(() => {
      expect(getProfileIdByUserId).toHaveBeenCalledTimes(1);
    });

    // Ensure form is empty since there's no existing profile
    expect(screen.getByPlaceholderText("Full Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Add your bio here")).toHaveValue("");

    const fullNameInput = screen.getByPlaceholderText("Full Name");
    const bioInput = screen.getByPlaceholderText("Add your bio here");
    const saveButton = screen.getByRole("button", { name: /save/i });

    // Fill out the form
    await userEvent.type(fullNameInput, "John Doe");
    await userEvent.type(bioInput, "New bio");

    // Save profile (should call createUserProfile)
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(createUserProfile).toHaveBeenCalledTimes(1);
    });

    expect(global.alert).toHaveBeenCalledWith("Profile created successfully!");
  });

  test("loads an existing user profile and allows editing", async () => {
    render(
      <MemoryRouter>
        <EditProfile />
      </MemoryRouter>
    );

    // Wait for profile ID to be fetched
    await waitFor(() => {
      expect(getProfileIdByUserId).toHaveBeenCalledTimes(1);
    });

    // Wait for user profile data to be fetched
    await waitFor(() => {
      expect(getUserProfileByProfileId).toHaveBeenCalledTimes(1);
    });

    // Ensure form is pre-filled
    expect(screen.getByPlaceholderText("Full Name")).toHaveValue("John Doe");
    expect(screen.getByPlaceholderText("Add your bio here")).toHaveValue("Artist");

    const fullNameInput = screen.getByPlaceholderText("Full Name");
    const bioInput = screen.getByPlaceholderText("Add your bio here");
    const saveButton = screen.getByRole("button", { name: /save/i });

    // Edit profile
    await userEvent.clear(fullNameInput);
    await userEvent.type(fullNameInput, "John Doe Updated");
    await userEvent.clear(bioInput);
    await userEvent.type(bioInput, "Updated bio");

    await userEvent.click(saveButton);

    // Ensure API call is made
    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledTimes(1);
    });

    expect(global.alert).toHaveBeenCalledWith("Profile updated successfully!");
  });

  test("displays error message if loading profile fails", async () => {
    // Mock the function to simulate an error loading the profile
    vi.mocked(getUserProfileByProfileId).mockRejectedValueOnce(new Error("Failed to load profile"));
    
    render(
      <MemoryRouter>
        <EditProfile />
      </MemoryRouter>
    );
  
    // Step 1: Wait for the component to finish loading
    await waitFor(() => screen.getByText(/create your account/i));
  
    // Step 2: Check for the error message related to loading failure
    const errorMessage = await screen.findByText(/Error fetching user profile/i);
    
    // Step 3: Assert that the error message is displayed
    expect(errorMessage).toBeInTheDocument();
  });
  
  
});
