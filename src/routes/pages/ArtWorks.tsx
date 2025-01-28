import React, { useState, useEffect, useRef } from 'react';
import { ArtworkResponse, Theme } from '../../utils/types';
import { fetchCurrentTheme, submitArtwork, fetchArtworks } from '../../utils/api/artworks';
import { ButtonCTA, ButtonLong, ButtonPrimary } from '../../components/Buttons';
import ArtworkCard from '../../components/artworks/ArtworkCard';
import { ImagePlus, Info } from 'lucide-react';
import "../../css/artworks/artworkPage.css";
import { getCsrfTokenFromCookie } from '../../utils/api';
import DotLoader from '../../components/DotLoader';
import FullScreenPost from '../../components/artworks/FullScreenPost';

const ArtWorks = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New state for error messages
  const [allArtworks, setAllArtworks] = useState<ArtworkResponse[]>([]);
  const [visibleArtworks, setVisibleArtworks] = useState<ArtworkResponse[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getTheme = async () => {
      try {
        const theme = await fetchCurrentTheme();
        setCurrentTheme(theme);
      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    const loadArtworks = async () => {
      setLoading(true);
      try {
        const artworks = await fetchArtworks();
        setAllArtworks(artworks);
        setVisibleArtworks(artworks.slice(0, 9));
        setHasMore(artworks.length > 9);
      } catch (error) {
        console.error('Error fetching artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    getTheme();
    loadArtworks();
  }, []);

  const handlePostClick = (artwork: ArtworkResponse) => {
    setSelectedArtwork(artwork);
  };

  const closeFullScreenPost = () => {
    setSelectedArtwork(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile || !description) {
      setErrorMessage('Image and Description are required');
      return;
    }

    try {
      const csrfToken = getCsrfTokenFromCookie();
      if (!csrfToken) {
        throw new Error('CSRF token is missing');
      }

      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('description', description);
      if (currentTheme) {
        formData.append('theme_id', currentTheme.id);
      }

      const newArtwork = await submitArtwork(formData, csrfToken);
      setAllArtworks((prevState) => [...prevState, newArtwork]);
      setVisibleArtworks((prevState) => [...prevState, newArtwork]);
      setShowForm(false);
      alert('Artwork posted successfully!');
    } catch (error) {
      alert('Failed to submit artwork');
      console.error('Error submitting artwork:', error);
    }
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const loadMoreArtworks = () => {
    setLoading(true);
    const nextBatch = allArtworks.slice(visibleArtworks.length, visibleArtworks.length + 9);
    setVisibleArtworks((prev) => [...prev, ...nextBatch]);
    setHasMore(allArtworks.length > visibleArtworks.length + nextBatch.length);
    setLoading(false);
  };

  return (
    <div className="artwork-page">
      {/* Render FullScreenPost if a post is selected */}
      {selectedArtwork && (
        <FullScreenPost
          post={{
            id: selectedArtwork.id,
            imageUrl: selectedArtwork.image_path,
            username: selectedArtwork.user.username,
            avatarUrl: selectedArtwork.user.avatar_url,
            userId: selectedArtwork.user.id,
            themeName: selectedArtwork.theme.theme_name,
            likes_count: selectedArtwork.likes,
            comments_count: (selectedArtwork.comments?.length ?? 0),
            createdAt: selectedArtwork.created_at,
            description: selectedArtwork.description,
          }}
          onClose={closeFullScreenPost}
        />
      )}

      {/* Artwork submission form and gallery */}
      <section className="artwork-submit-section">
        <h1 className="current-theme-title">
          Current Theme: <br /> <span className="current-theme-name">{currentTheme ? currentTheme.theme_name : 'Loading...'}</span>
        </h1>
        <p className="current-theme-description">
          Capture the beauty and mystery of the horizon and what lies beyond it. Whether it’s a stunning landscape,
          a dream of what’s ahead, or a creative interpretation of what the horizon represents, this theme is your
          chance to showcase how you see and imagine it.
        </p>
        <ButtonLong onClick={() => setShowForm(true)} text="Submit" />
      </section>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowForm(false)}>&times;</button>
            <h2>Submit Your Artwork</h2>
            <form onSubmit={handleSubmit} className="artwork-submit-form">
              <div className="form-group artwork-image">
                <label className="form-label" onClick={handleIconClick}>
                  <ImagePlus size={50} color="#131313" className="image-icon" />
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-input"
                  className="form-input"
                  onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                  style={{ display: 'none' }}
                />
                {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="image-preview" />}
              </div>

              <div className="form-group artwork-description">
                <label className="form-label">Description:</label>
                <div className="textarea-container">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter artwork description"
                    className="form-textarea"
                  />
                  <button
                    className="info-button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowInfo(true);
                    }}
                    aria-label="Show information"
                  >
                    <Info size={20} color="#888" />
                  </button>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
              </div>

              <div className="form-group">
                <ButtonCTA text="Submit Artwork" link="#" onClick={handleSubmit} />
              </div>

              {showInfo && (
                <div className="info-modal">
                  <div className="info-modal-content">
                    <button
                      className="info-close-button"
                      onClick={() => setShowInfo(false)}
                    >
                      &times;
                    </button>
                    <p>When you submit an artwork, it will be reviewed to ensure it matches the current theme. After approval, your artwork will appear on your profile for everyone to admire!</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <section className="this-month-artworks">
        <h2 className="section-title">This Month's Artworks</h2>
        <div className="artworks-gallery">
          {loading ? (
            <DotLoader />
          ) : (
            visibleArtworks.length === 0 && <p className="no-artworks">No artworks available.</p>
          )}
          {visibleArtworks
            .filter((artwork) => artwork.status === 'accepted')
            .map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onClick={() => handlePostClick(artwork)}
                userId={artwork.user.id}
              />
            ))}
        </div>

        {hasMore && !loading && (
          <ButtonPrimary onClick={loadMoreArtworks} text="Load More" />
        )}
      </section>
    </div>
  );
};

export default ArtWorks;
