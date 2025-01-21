import { useState, useEffect, useRef } from 'react';
import { ArtworkResponse, Theme } from '../../utils/types';
import { fetchCurrentTheme, submitArtwork, fetchArtworks } from '../../utils/api/artworks';
import { ButtonCTA, ButtonLong, ButtonPrimary } from '../../components/Buttons';
import ArtworkCard from '../../components/artworks/ArtworkCard';
import { ImagePlus } from 'lucide-react';
import "../../css/artworks/artworkPage.css";
import { getCsrfTokenFromCookie } from '../../utils/api';
import DotLoader from '../../components/DotLoader'; // Import DotLoader component

const ArtWorks = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [allArtworks, setAllArtworks] = useState<ArtworkResponse[]>([]);
  const [visibleArtworks, setVisibleArtworks] = useState<ArtworkResponse[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState<boolean>(false); // Global loading state

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
      setLoading(true); // Set loading state to true
      try {
        const artworks = await fetchArtworks(); 
        setAllArtworks(artworks); // Save all artworks data
        setVisibleArtworks(artworks.slice(0, 9)); // Show first 9 posts initially
        setHasMore(artworks.length > 9); // Check if there are more artworks
      } catch (error) {
        console.error('Error fetching artworks:', error);
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };

    getTheme();
    loadArtworks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!imageFile || !description) {
      alert('Image and Description are required');
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
      setVisibleArtworks((prevState) => [...prevState, newArtwork]); // Add new artwork to the visible list
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
    setLoading(true); // Show loader while loading more artworks
    const nextBatch = allArtworks.slice(visibleArtworks.length, visibleArtworks.length + 9);
    setVisibleArtworks((prev) => [...prev, ...nextBatch]); // Load next 9 posts
    setHasMore(allArtworks.length > visibleArtworks.length + nextBatch.length); // Check if there are more posts to load
    setLoading(false); // Hide loader after loading is complete
  };

  return (
    <div className='artwork-page'>
      <section className='artwork-submit-section'>
        <h1 className='current-theme-title'>
          Current Theme: <br /> <span className='current-theme-name'>{currentTheme ? currentTheme.theme_name : 'Loading...'}</span>
        </h1>
        <p className='current-theme-description'>
          Capture the beauty and mystery of the horizon and what lies beyond it. Whether it’s a stunning landscape, 
          a dream of what’s ahead, or a creative interpretation of what the horizon represents, this theme is your 
          chance to showcase how you see and imagine it.
        </p>
        <ButtonLong onClick={() => setShowForm(true)} text='Submit' />
      </section>

      {showForm && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className='close-button' onClick={() => setShowForm(false)}>&times;</button>
            <h2>Submit Your Artwork</h2>
            <form onSubmit={handleSubmit} className='artwork-submit-form'>
              <div className='form-group artwork-image'>
                <label className='form-label' onClick={handleIconClick}>
                  <ImagePlus size={50} color="#131313" className="image-icon" />
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-input"
                  className='form-input'
                  onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                  style={{ display: 'none' }}
                />
                {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className='image-preview' />}
              </div>

              <div className='form-group artwork-description'>
                <label className='form-label'>Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter artwork description"
                  className='form-textarea'
                />
              </div>

              <div className='form-group'>
                <ButtonCTA text="Submit Artwork" link="#" onClick={handleSubmit} />
              </div>
            </form>
          </div>
        </div>
      )}

        <section className='this-month-artworks'>
          <h2 className='section-title'>This Month's Artworks</h2>
          <div className="artworks-gallery">
            {loading ? (
              <DotLoader />
            ) : (
              visibleArtworks.length === 0 && <p className='no-artworks'>No artworks available.</p>
            )}
            {visibleArtworks
              .filter((artwork) => artwork.status === 'accepted')
              .map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork} // Pass the whole artwork object
                />
              ))}
          </div>
          {hasMore && !loading && (
            <ButtonPrimary onClick={loadMoreArtworks} text='See more'/>
          )}
        </section>
    </div>
  );
};

export default ArtWorks;
