import React from 'react';
import { userData } from '../../userStore/userData';
import { useRecoilValue } from 'recoil';
import UserDropdown from './UserDropdown';

const Navbar = () => {
    const { user } = useRecoilValue(userData);

    // If no user logged in, don't show navbar (Login is in sidebar)
    if (!user || !user.email) {
        return null;
    }

    // Logged in state - show user dropdown
    return (
        <div className="flex items-center gap-4 px-3 py-1 relative">
            <UserDropdown />
        </div>
    );
};

export default Navbar;
