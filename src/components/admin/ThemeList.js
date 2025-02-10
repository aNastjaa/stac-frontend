import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { ButtonLong, ButtonPrimary } from '../../components/Buttons';
import { createTheme, archiveTheme, deleteTheme, fetchAllThemes, fetchArchivedThemes, updateTheme } from '../../utils/api/admin';
import { fetchCurrentTheme } from '../../utils/api/artworks';
import '../../css/admin_dashboard_styling/themesList.css';
const ThemeList = () => {
    const [currentTheme, setCurrentTheme] = useState(null); // State for the current theme
    const [allThemes, setAllThemes] = useState([]); // State for all themes
    const [archivedThemes, setArchivedThemes] = useState([]); // State for archived themes
    const [newThemeName, setNewThemeName] = useState('');
    const [startDate, setStartDate] = useState(''); // State to store start date
    const [loading, setLoading] = useState(false); // Loading state for async actions
    const [selectedTheme, setSelectedTheme] = useState(null); // State for the theme being edited
    // Fetch the current theme
    useEffect(() => {
        const loadCurrentTheme = async () => {
            try {
                const theme = await fetchCurrentTheme();
                setCurrentTheme(theme);
            }
            catch (error) {
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
                const nonArchivedThemes = themes.filter(theme => !archivedThemes.some(archivedTheme => archivedTheme.id === theme.id));
                setAllThemes(nonArchivedThemes);
                // Determine the current theme by checking the start date with the current month
                const currentMonth = new Date().getMonth() + 1; // Current month (1-12)
                const currentTheme = nonArchivedThemes.find(theme => {
                    const themeMonth = new Date(theme.start_date).getMonth() + 1;
                    return themeMonth === currentMonth; // Match the current month
                });
                if (currentTheme) {
                    setCurrentTheme(currentTheme); // Set current theme if found
                }
                else {
                    setCurrentTheme(null); // No theme for current month
                }
            }
            catch (error) {
                console.error('Failed to fetch all themes', error);
            }
        };
        loadAllThemes();
    }, []);
    // Handle theme creation
    const handleThemeCreation = async () => {
        if (!newThemeName || !startDate)
            return; // Validate that both fields are filled
        try {
            setLoading(true); // Set loading to true when the creation starts
            const theme = await createTheme(newThemeName, startDate);
            setAllThemes([...allThemes, theme]); // Add the new theme to the list of all themes
            setNewThemeName('');
            setStartDate(''); // Reset the start date after theme creation
            alert('Theme created successfully');
        }
        catch (error) {
            console.error('Failed to create theme', error);
            alert('Error creating theme');
        }
        finally {
            setLoading(false); // Ensure loading state is reset after action
        }
    };
    // Handle moving theme to archive
    const handleMoveToArchive = async (themeId) => {
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
        }
        catch (error) {
            console.error('Failed to archive theme', error);
            alert('Error archiving theme');
        }
        finally {
            setLoading(false); // Reset loading state
        }
    };
    // Handle theme update
    const handleThemeUpdate = async (themeId, themeName, startDate) => {
        try {
            setLoading(true);
            const updatedTheme = await updateTheme(themeId, themeName, startDate); // Send update request to the backend
            setAllThemes(allThemes.map(theme => theme.id === themeId ? updatedTheme : theme)); // Update the theme in the list
            setSelectedTheme(null); // Clear the selected theme after updating
            alert('Theme updated successfully');
        }
        catch (error) {
            console.error('Failed to update theme', error);
            alert('Error updating theme');
        }
        finally {
            setLoading(false);
        }
    };
    // Handle theme deletion
    const handleThemeDelete = async (themeId) => {
        try {
            setLoading(true);
            await deleteTheme(themeId); // Delete the theme using the backend API
            // Remove the theme from the state
            setAllThemes(prevThemes => prevThemes.filter(theme => theme.id !== themeId));
            alert('Theme deleted successfully');
        }
        catch (error) {
            console.error('Failed to delete theme', error);
            alert('Error deleting theme');
        }
        finally {
            setLoading(false); // Reset loading state
        }
    };
    return (_jsxs("div", { className: "theme-list-container", children: [_jsx("h2", { children: "Themes" }), _jsxs("div", { className: "theme-creation", children: [_jsx("h3", { children: "Create Theme" }), _jsxs("div", { className: "input-field", children: [_jsx("label", { htmlFor: "new-theme-name", children: "Theme Name:" }), _jsx("input", { id: "new-theme-name", type: "text", placeholder: "Enter theme name", value: newThemeName, onChange: (e) => setNewThemeName(e.target.value), disabled: loading })] }), _jsxs("div", { className: "input-field", children: [_jsx("label", { htmlFor: "start-date", children: "Start Date:" }), _jsx("input", { id: "start-date", type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), disabled: loading })] }), _jsx(ButtonLong, { onClick: handleThemeCreation, text: "Create Theme", disabled: loading })] }), _jsxs("section", { className: "current-theme", children: [_jsx("h3", { children: "Current Theme:" }), currentTheme ? (_jsxs("div", { className: "current-theme-info", children: [_jsxs("p", { children: ["Name: ", _jsx("span", { className: "theme-name-admin", children: currentTheme.theme_name })] }), _jsxs("p", { children: ["Start Date: ", _jsx("span", { className: "theme-date", children: currentTheme.start_date })] })] })) : (_jsx("p", { children: "No current theme available." }))] }), _jsxs("section", { className: "all-themes", children: [_jsx("h3", { children: "All Themes:" }), allThemes.length > 0 ? (_jsx("ul", { children: allThemes.map((theme) => (_jsxs("li", { children: [_jsx("p", { children: _jsx("span", { className: "theme-name-admin", children: theme.theme_name }) }), _jsxs("p", { children: ["Start Date: ", theme.start_date] }), _jsxs("div", { children: [_jsx(ButtonPrimary, { onClick: () => setSelectedTheme(theme), text: "Edit", disabled: loading }), _jsx(ButtonPrimary, { onClick: () => handleMoveToArchive(theme.id), text: "Move to Archive", disabled: loading }), _jsx(ButtonPrimary, { onClick: () => handleThemeDelete(theme.id), text: "Delete Theme", disabled: loading })] })] }, theme.id))) })) : (_jsx("p", { children: "No themes available." }))] }), _jsxs("section", { className: "archived-themes", children: [_jsx("h3", { children: "Archived Themes:" }), archivedThemes.length > 0 ? (_jsx("ul", { children: archivedThemes.map((theme) => (_jsxs("li", { children: [_jsx("p", { children: _jsx("span", { className: "theme-name-admin", children: theme.theme_name }) }), _jsxs("p", { children: ["Start Date: ", theme.start_date] })] }, theme.id))) })) : (_jsx("p", { children: "No archived themes available." }))] }), selectedTheme && (_jsxs("div", { className: "edit-theme", children: [_jsx("h3", { children: "Edit Theme" }), _jsx("input", { type: "text", placeholder: "Theme Name", value: selectedTheme.theme_name, onChange: (e) => setSelectedTheme({ ...selectedTheme, theme_name: e.target.value }), disabled: loading }), _jsx("input", { type: "date", value: selectedTheme.start_date, onChange: (e) => setSelectedTheme({ ...selectedTheme, start_date: e.target.value }), disabled: loading }), _jsx(ButtonPrimary, { onClick: () => {
                            handleThemeUpdate(selectedTheme.id, selectedTheme.theme_name, selectedTheme.start_date);
                        }, text: "Update Theme", disabled: loading })] })), loading && _jsx("p", { children: "Loading..." })] }));
};
export default ThemeList;
