import { useState, useEffect } from 'react';
import { ButtonLong, ButtonPrimary } from '../../components/Buttons';
import { Theme } from '../../utils/types';
import { createTheme, archiveTheme, deleteTheme, fetchAllThemes, fetchArchivedThemes, updateTheme } from '../../utils/api/admin';
import { fetchCurrentTheme } from '../../utils/api/artworks';
import '../../css/admin_dashboard_styling/themesList.css';

const ThemeList = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null); // State for the current theme
  const [allThemes, setAllThemes] = useState<Theme[]>([]); // State for all themes
  const [archivedThemes, setArchivedThemes] = useState<Theme[]>([]); // State for archived themes
  const [newThemeName, setNewThemeName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(''); // State to store start date
  const [loading, setLoading] = useState<boolean>(false); // Loading state for async actions
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null); // State for the theme being edited

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

  // Fetch all themes and archived themes
  useEffect(() => {
    const loadAllThemes = async () => {
      try {
        const themes = await fetchAllThemes();
        const archivedThemes = await fetchArchivedThemes();

        // Set the state for archived themes
        setArchivedThemes(archivedThemes);

        // Filter out archived themes from the allThemes list
        const nonArchivedThemes = themes.filter(theme => 
          !archivedThemes.some(archivedTheme => archivedTheme.id === theme.id)
        );

        setAllThemes(nonArchivedThemes);

        // Determine the current theme by checking the start date with the current month
        const currentMonth = new Date().getMonth() + 1; // Current month (1-12)
        const currentTheme = nonArchivedThemes.find(theme => {
          const themeMonth = new Date(theme.start_date).getMonth() + 1;
          return themeMonth === currentMonth; // Match the current month
        });

        if (currentTheme) {
          setCurrentTheme(currentTheme); // Set current theme if found
        } else {
          setCurrentTheme(null); // No theme for current month
        }

      } catch (error) {
        console.error('Failed to fetch all themes', error);
      }
    };
    loadAllThemes();
  }, []);

  // Handle theme creation
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

  // Handle moving theme to archive
  const handleMoveToArchive = async (themeId: string) => {
    try {
      setLoading(true); 
      await archiveTheme(themeId); 

      // Remove the archived theme from allThemes and currentTheme if needed
      setAllThemes((prevThemes) => prevThemes.filter((theme) => theme.id !== themeId));
      
      if (currentTheme && currentTheme.id === themeId) {
        setCurrentTheme(null); // If the archived theme is the current theme, set currentTheme to null
      }

      // Add the archived theme to archivedThemes
      const archivedTheme = allThemes.find((theme) => theme.id === themeId);
      if (archivedTheme) {
        setArchivedThemes([...archivedThemes, archivedTheme]);
      }

      alert('Theme archived successfully');
    } catch (error) {
      console.error('Failed to archive theme', error);
      alert('Error archiving theme');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle theme update
  const handleThemeUpdate = async (themeId: string, themeName: string, startDate: string) => {
    try {
      setLoading(true);
      const updatedTheme = await updateTheme(themeId, themeName, startDate); // Send update request to the backend
      setAllThemes(allThemes.map(theme => theme.id === themeId ? updatedTheme : theme)); // Update the theme in the list
      setSelectedTheme(null); // Clear the selected theme after updating
      alert('Theme updated successfully');
    } catch (error) {
      console.error('Failed to update theme', error);
      alert('Error updating theme');
    } finally {
      setLoading(false);
    }
  };

  // Handle theme deletion
  const handleThemeDelete = async (themeId: string) => {
    try {
      setLoading(true);
      await deleteTheme(themeId); // Delete the theme using the backend API
      // Remove the theme from the state
      setAllThemes(prevThemes => prevThemes.filter(theme => theme.id !== themeId));
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
        <div className="input-field">
          <label htmlFor="new-theme-name">Theme Name:</label>
          <input
            id="new-theme-name"
            type="text"
            placeholder="Enter theme name"
            value={newThemeName}
            onChange={(e) => setNewThemeName(e.target.value)}
            disabled={loading} // Disable input when loading
          />
        </div>
        <div className="input-field">
          <label htmlFor="start-date">Start Date:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading} // Disable input when loading
          />
        </div>
        <ButtonLong onClick={handleThemeCreation} text="Create Theme" disabled={loading} />
      </div>

      <section className="current-theme">
        <h3>Current Theme:</h3>
        {currentTheme ? (
          <div className="current-theme-info">
            <p>Name: <span className="theme-name-admin">{currentTheme.theme_name}</span></p>
            <p>Start Date: <span className="theme-date">{currentTheme.start_date}</span></p>
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
                <p><span className="theme-name-admin">{theme.theme_name}</span></p>
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

      <section className="archived-themes">
        <h3>Archived Themes:</h3>
        {archivedThemes.length > 0 ? (
          <ul>
            {archivedThemes.map((theme) => (
              <li key={theme.id}>
                <p><span className="theme-name-admin">{theme.theme_name}</span></p>
                <p>Start Date: {theme.start_date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No archived themes available.</p>
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
            disabled={loading}
          />
          <input
            type="date"
            value={selectedTheme.start_date}
            onChange={(e) =>
              setSelectedTheme({ ...selectedTheme, start_date: e.target.value })
            }
            disabled={loading}
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
            disabled={loading}
          />
        </div>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default ThemeList;
