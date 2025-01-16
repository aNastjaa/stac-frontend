import { useState } from 'react';
import { Theme } from '../../utils/types';

type ThemeListProps = {
  themes: Theme[];
  handleCreateTheme: (theme: Omit<Theme, 'id'>) => void;
  handleUpdateTheme: (themeId: string, updatedTheme: Partial<Theme>) => void;
  handleDeleteTheme: (themeId: string) => void;
};

const ThemeList = ({ themes, handleCreateTheme, handleUpdateTheme, handleDeleteTheme }: ThemeListProps) => {
  const [newThemeName, setNewThemeName] = useState('');
  const [newStartDate, setNewStartDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateTheme({ theme_name: newThemeName, start_date: newStartDate });
  };

  return (
    <div>
      <h2>Theme Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newThemeName}
          onChange={(e) => setNewThemeName(e.target.value)}
          placeholder="Theme Name"
        />
        <input
          type="date"
          value={newStartDate}
          onChange={(e) => setNewStartDate(e.target.value)}
        />
        <button type="submit">Create Theme</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Theme Name</th>
            <th>Start Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {themes.map(theme => (
            <tr key={theme.id}>
              <td>{theme.theme_name}</td>
              <td>{theme.start_date}</td>
              <td>
                <button onClick={() => handleUpdateTheme(theme.id, { theme_name: 'Updated' })}>Update</button>
                <button onClick={() => handleDeleteTheme(theme.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ThemeList;
