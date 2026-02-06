import React from 'react';
import { userData } from '../../userStore/userData';
import { useRecoilValue } from 'recoil';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import UserDropdown from './UserDropdown';

const Navbar = () => {
    const { user } = useRecoilValue(userData);
    const { theme, setTheme } = useTheme();

    // If no user logged in, don't show navbar (Login is in sidebar)
    if (!user || !user.email) {
        return null;
    }

    // Logged in state - show user dropdown
    return (
        <div className="flex items-center gap-4 px-3 py-1 relative">
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-surface border border-border text-subtext hover:text-primary transition-all"
            >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <UserDropdown />
        </div>
    );
};

export default Navbar;
