import { useState, useEffect } from 'react';
import { fetchCurrentTheme, getCsrfTokenFromCookie, submitArtwork } from '../../utils/api'; // Ensure you have your API call
import { ArtworkResponse, Theme } from '../../utils/types';

const ArtWorks = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [error, setError] = useState<string | null>(null); // Error state for catching errors
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null); // Handle errors during submission
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null); // Handle success message
  const [submittedArtwork, setSubmittedArtwork] = useState<ArtworkResponse | null>(null);
  const [allArtworks, setAllArtworks] = useState<ArtworkResponse[]>([]); // State to store all artworks

  // Fetch the current theme on component mount
  useEffect(() => {
    const getTheme = async () => {
      try {
        const theme = await fetchCurrentTheme();
        setCurrentTheme(theme); // If theme is found, set it in state
      } catch (error) {
        setError('Failed to fetch current theme');
        console.error('Error fetching theme:', error);
      }
    };

    const getArtworks = async () => {
      try {
        const response = await fetch('/api/artworks');
        const data = await response.json();
        setAllArtworks(data); // Set the fetched artworks in state
      } catch (error) {
        setError('Failed to fetch artworks');
        console.error('Error fetching artworks:', error);
      }
    };

    getTheme();
    getArtworks(); // Fetch all artworks when the component mounts
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!imageFile || !description) {
      setSubmitError('Image and Description are required');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('image', imageFile); // Append the image file to the FormData
      formData.append('description', description); // Append the description
      if (currentTheme) {
        formData.append('theme_id', currentTheme.id); // Append the theme ID
      }

      // Get the CSRF token from cookies
      const csrfToken = getCsrfTokenFromCookie();
  
      // Call the submitArtwork function and pass the FormData and CSRF token
      const response = await submitArtwork(formData, csrfToken);
  
      if (response) {
        setSubmitSuccess('Artwork posted successfully!');
        setSubmitError(null); // Reset the error message
        setSubmittedArtwork(response); // Save the artwork response
        setAllArtworks(prevState => [...prevState, response]); // Update the state with the new artwork
      }
    } catch (error) {
      setSubmitError('Failed to submit artwork');
      setSubmitSuccess(null); // Reset success message if submission fails
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <h1>Current Theme: {currentTheme ? currentTheme.theme_name : 'Loading...'}</h1>

      {submitError && <div style={{ color: 'red' }}>{submitError}</div>}
      {submitSuccess && <div style={{ color: 'green' }}>{submitSuccess}</div>}

      {submittedArtwork && (
        <div>
          <h2>Submitted Artwork</h2>
          {submittedArtwork.image_path && (
            <img
            src="http://localhost:8000/storage/artworks/pvc1wGH0NOslTOuM6Vaw88hdF9WLKW9M0WsF58U8.jpg"
            alt="Submitted Artwork"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          
          
          )}
          <p>{submittedArtwork.description}</p>
        </div>
      )}

      <h2>All Artworks</h2>
      {allArtworks.length === 0 && <p>No artworks available.</p>}
      {allArtworks.map(artwork => (
        <div key={artwork.id}>
          <img
            src={artwork.image_path}
            alt="Artwork"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <p>{artwork.description}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter artwork description"
          />
        </div>

        <div>
          <button type="submit">Submit Artwork</button>
        </div>
      </form>
    </div>
  );
};
export default ArtWorks;
