'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import AddUserModal from './AddUserModal';

const Header = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="header flex justify-between items-center pl-0 pr-0 py-6">
        <h1 className="text-primary text-2xl font-bold">Users</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-button button-secondary"
            aria-label="Toggle theme"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="add-user-button button-primary font-medium flex items-center justify-center"
          >
            Add User
          </button>
        </div>
      </header>

      <AddUserModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Header;