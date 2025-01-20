import { useState, useEffect } from 'react';
import { ButtonLong, ButtonPrimary } from '../../components/Buttons';
import { Theme } from '../../utils/types';
import { createTheme, updateTheme, archiveTheme, deleteTheme, fetchAllThemes } from '../../utils/api/admin';
import { fetchCurrentTheme} from '../../utils/api/artworks'; 
import '../../css/admin_dashboard_styling/themesList.css';

const ThemeList = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null); // State for the current theme
  const [allThemes, setAllThemes] = useState<Theme[]>([]); // State for all themes
  const [newThemeName, setNewThemeName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(''); // State to store start date
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state for async actions

  // Fetch the current theme
  useEffect(() => {
    const loadCurrentTheme = async () => {
      try {
        const theme = await fetchCurrentTheme();
        setCurrentTheme(theme);
      } catch (error) {
        console.error('Failed to fetch current theme', error);
      }
    };
    loadCurrentTheme();
  }, []);

  // Fetch all themes
  useEffect(() => {
    const loadAllThemes = async () => {
      try {
        const themes = await fetchAllThemes();
        setAllThemes(themes);
      } catch (error) {
        console.error('Failed to fetch all themes', error);
      }
    };
    loadAllThemes();
  }, []);

  const handleThemeCreation = async () => {
    if (!newThemeName || !startDate) return; // Validate that both fields are filled
    try {
      setLoading(true); // Set loading to true when the creation starts
      const theme = await createTheme(newThemeName, startDate);
      setAllThemes([...allThemes, theme]); // Add the new theme to the list of all themes
      setNewThemeName('');
      setStartDate(''); // Reset the start date after theme creation
      alert('Theme created successfully');
    } catch (error) {
      console.error('Failed to create theme', error);
      alert('Error creating theme');
    } finally {
      setLoading(false); // Ensure loading state is reset after action
    }
  };

  const handleThemeUpdate = async (themeId: string, updatedThemeName: string, startDate: string) => {
    try {
      setLoading(true); // Set loading to true when the update starts
      const updatedTheme = await updateTheme(themeId, updatedThemeName, startDate);
  
      // Update allThemes state
      setAllThemes((prevThemes) =>
        prevThemes.map((theme) => (theme.id === themeId ? updatedTheme : theme))
      );
  
      // Update currentTheme if it's the same as the updated one
      if (currentTheme && currentTheme.id === themeId) {
        setCurrentTheme(updatedTheme);
      }
  
      // Show success alert
      alert('Theme updated successfully!');
    } catch (error) {
      console.error('Failed to update theme:', error);
      alert('An error occurred while updating the theme. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleMoveToArchive = async (themeId: string) => {
    try {
      setLoading(true); 
      await archiveTheme(themeId); 
      setAllThemes(allThemes.filter((theme) => theme.id !== themeId)); 
      alert('Theme archived successfully');
    } catch (error) {
      console.error('Failed to archive theme', error);
      alert('Error archiving theme');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleThemeDelete = async (themeId: string) => {
    try {
      setLoading(true); // Set loading to true when deleting the theme
      await deleteTheme(themeId);
      setAllThemes(allThemes.filter((theme) => theme.id !== themeId)); // Remove deleted theme from the list
      if (currentTheme && currentTheme.id === themeId) {
        setCurrentTheme(null); // Clear the current theme if deleted
      }
      alert('Theme deleted successfully');
    } catch (error) {
      console.error('Failed to delete theme', error);
      alert('Error deleting theme');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="theme-list-container">
      <h2>Themes</h2>
      <div className="theme-creation">
        <h3>Create Theme</h3>
        <input
          type="text"
          placeholder="Enter theme name"
          value={newThemeName}
          onChange={(e) => setNewThemeName(e.target.value)}
          disabled={loading} // Disable input when loading
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={loading} // Disable input when loading
        />
        <ButtonLong onClick={handleThemeCreation} text="Create Theme" disabled={loading} /> {/* Disable button when loading */}
      </div>
  
      <section className="current-theme">
        <h3>Current Theme:</h3>
        {currentTheme ? (
          <div className='current-theme-info'>
            <p>Name: <span className='theme-name'>{currentTheme.theme_name}</span></p>
            <p>Start Date: <span className='theme-date'>{currentTheme.start_date}</span></p>
          </div>
        ) : (
          <p>No current theme available.</p>
        )}
      </section>
  
      <section className="all-themes">
        <h3>All Themes:</h3>
        {allThemes.length > 0 ? (
              <ul>
              {allThemes.map((theme) => (
                <li key={theme.id}>
                  <p><span className='theme-name'>{theme.theme_name}</span></p>
                  <p>Start Date: {theme.start_date}</p>
                  <div>
                    <ButtonPrimary
                      onClick={() => setSelectedTheme(theme)}
                      text="Edit"
                      disabled={loading} 
                    />
                    <ButtonPrimary
                      onClick={() => handleMoveToArchive(theme.id)}
                      text="Move to Archive"
                      disabled={loading} 
                    />
                    <ButtonPrimary
                      onClick={() => handleThemeDelete(theme.id)}
                      text="Delete Theme"
                      disabled={loading} 
                    />
                  </div>
                </li>
              ))}
            </ul>
        ) : (
          <p>No themes available.</p>
        )}
      </section>
  
      {selectedTheme && (
        <div className="edit-theme">
          <h3>Edit Theme</h3>
          <input
            type="text"
            placeholder="Theme Name"
            value={selectedTheme.theme_name}
            onChange={(e) =>
              setSelectedTheme({ ...selectedTheme, theme_name: e.target.value })
            }
            disabled={loading} // Disable input when loading
          />
          <input
            type="date"
            value={selectedTheme.start_date}
            onChange={(e) =>
              setSelectedTheme({ ...selectedTheme, start_date: e.target.value })
            }
            disabled={loading} // Disable input when loading
          />
          <ButtonPrimary
            onClick={() => {
              handleThemeUpdate(
                selectedTheme.id,
                selectedTheme.theme_name,
                selectedTheme.start_date
              );
            }}
            text="Update Theme"
            disabled={loading} // Disable button when loading
          />
        </div>
      )}

      {loading && <p>Loading...</p>} {/* Show loading indicator */}
    </div>
  );
};

export default ThemeList;
