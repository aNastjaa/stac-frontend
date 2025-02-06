import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  getUserIdFromLocalStorage,
  getProfileIdByUserId,
  getUserProfileByProfileId,
  createUserProfile,
  updateUserProfile,
  uploadAvatar,
  fetchAvatarUrl,
  deleteUserAccount,
  logout,
  getCsrfTokenFromCookie,
} from "../utils/api";
import { ButtonLong, ButtonPrimary } from "./Buttons";
import "../css/userProfile.css";
import { CircleUserRound } from "lucide-react";
import { UserProfileType } from "../utils/types";
import FullScreenProUpgrade from "./FullScreenProUpgrade";

const EditProfile = () => {
  const [profile, setProfile] = useState<UserProfileType>({
    id: "",
    username: "",
    avatar_url: null,
    avatar_id: "",
    posts_count: 0,
    comments_count: 0,
    likes_count: 0,
    full_name: "",
    bio: "",
    external_links: [],
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAvatarEditMode, setIsAvatarEditMode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNewProfile, setIsNewProfile] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = getUserIdFromLocalStorage();
        if (!userId) {
          console.error("No user ID found in localStorage");
          navigate("/login");
          return;
        }

        const profileId = await getProfileIdByUserId(userId);
        if (profileId) {
          const userProfile = await getUserProfileByProfileId(profileId);
          if (userProfile) {
            setProfile(userProfile);
            setIsNewProfile(false);

            // Fetch role from localStorage
            const storedUser = localStorage.getItem('auth_user');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              setRole(parsedUser.role_name || ''); // Set role based on the stored data
            }

            if (userProfile.avatar_id) {
              const avatarUrl = await fetchAvatarUrl(userProfile.avatar_id);
              setAvatarUrl(avatarUrl);
            }
          }
        } else {
          setIsNewProfile(true);
        }
      } catch (error) {
        console.error("Error fetching user profile", error);
        setIsNewProfile(true);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      let updatedProfile;
      let avatarId = profile.avatar_id;

      if (avatarFile) {
        const uploadResponse = await uploadAvatar(avatarFile);
        avatarId = uploadResponse.id;
        setAvatarUrl(await fetchAvatarUrl(avatarId));
      }

      if (isNewProfile) {
        updatedProfile = await createUserProfile({ ...profile, avatar_id: avatarId });
        alert("Profile created successfully!");
      } else {
        updatedProfile = await updateUserProfile({ ...profile, avatar_id: avatarId });
        alert("Profile updated successfully!");
      }

      setProfile(updatedProfile);
      navigate("/profile");
    } catch (error) {
      console.error("Error saving profile", error);
      setErrorMessage("Error saving profile");
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setProfile((prevProfile) => ({ ...prevProfile, avatar_id: "", avatar_url: null }));
      setAvatarUrl(null);
      setAvatarPreview(null);
      alert("Avatar deleted successfully");
    } catch (error) {
      console.error("Error deleting avatar", error);
      alert("Error deleting avatar");
    }
  };

  const handleLogout = async () => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      if (!csrfToken) {
        throw new Error("CSRF token not found");
      }

      await logout(csrfToken);
      navigate("/login");
      alert("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      navigate("/login");
      alert("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account", error);
      alert("Failed to delete account");
    }
  };

  return (
    <div className="edit-profile-container">
    <div className="edit-profile">
      <div className="header-section">
        <h2>{profile.full_name ? "Edit your profile" : "Create your account"}</h2>
      </div>

      {/* Avatar Section */}
      <div className="avatar-section">
        <div className="avatar-container">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar Preview" className="profile-avatar-thumbnail" />
          ) : avatarUrl ? (
            <img src={avatarUrl} alt="User Avatar" className="profile-avatar" />
          ) : (
            <CircleUserRound color="#131313" size={100} />
          )}
        </div>

        {isAvatarEditMode && (
          <div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        )}

        <div className="avatar-actions">
          <ButtonPrimary text="Edit Avatar" onClick={() => setIsAvatarEditMode((prev) => !prev)} />
          {avatarUrl && <ButtonPrimary text="Delete Avatar" onClick={handleDeleteAvatar} />}
        </div>
      </div>

      {/* Full Name Input */}
      <div className="full-name-input">
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          value={profile.full_name || ""}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
        />
      </div>

      {/* Bio Input */}
      <div className="bio-input">
        <label>Bio</label>
        <textarea
          placeholder="Add your bio here"
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
      </div>

      {/* External Links */}
      <div className="links-section">
        <label>Links</label>
        {role === "pro" ? (
          <input
            type="text"
            placeholder="Enter your links"
            value={(profile.external_links ?? []).join(", ")}
            onChange={(e) =>
              setProfile({
                ...profile,
                external_links: e.target.value
                  .split(", ")
                  .map(link => link.trim()) 
                  .filter(link => link !== ""), 
              })
            }
          />
        ) : (
          <p>
            Only <a href="/" className="link-to-pro" onClick={(e) => { e.preventDefault(); setShowUpgradeModal(true); }}>
            Pro users</a> <br />
            can add external links.
          </p>
        )}

        {/* FullScreenProUpgrade modal */}
        {showUpgradeModal && (
          <FullScreenProUpgrade onClose={() => setShowUpgradeModal(false)} />
        )}
      </div>

      <ButtonLong text="Save" onClick={handleSaveProfile} />
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Log Out and Delete Account Buttons */}
      <div className="action-buttons-profile">
        <ButtonPrimary text="Log Out" onClick={handleLogout} />
        <ButtonPrimary className="delete-account-button" text="Delete Account" onClick={handleDeleteAccount} />
      </div>
    </div>
    </div>
  );
};

export default EditProfile;
