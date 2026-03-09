import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ pageTitle = "Dashboard", onMenuClick }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Close dropdown if clicked outside (simple mock logic)
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="top-navbar">
            {/* Left side: Page Title */}
            <div className="navbar-left">
                <h1 className="navbar-title">{pageTitle}</h1>
            </div>

            {/* Right side: Search, Notifications, Profile Dropdown */}
            <div className="navbar-right">

                {/* Search Field */}
                <div className="navbar-search desktop-only">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search tickets, customers..."
                        className="search-input"
                    />
                </div>

                {/* Notifications Icon */}
                <button className="icon-btn notification-btn">
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>

                {/* Profile Dropdown Component */}
                <div className="profile-dropdown-container">
                    <button className="profile-trigger" onClick={toggleProfile}>
                        <div className="avatar">{user?.name ? user.name.charAt(0) : 'A'}</div>
                        <div className="profile-text desktop-only">
                            <span className="profile-name">{user?.name || 'User'}</span>
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-header">
                                <span className="dropdown-name">{user?.name || 'User'}</span>
                                <span className="dropdown-role">{user?.role || 'Guest'}</span>
                            </div>
                            <div className="dropdown-divider"></div>



                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Navbar;
