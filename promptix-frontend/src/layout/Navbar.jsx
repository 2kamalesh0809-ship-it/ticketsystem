import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, LogOut, Clock, MessageSquare, User as UserIcon } from 'lucide-react';
import notificationService from '../services/notificationService';
import './Navbar.css';

const Navbar = ({ pageTitle = "Dashboard" }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const unreadCount = notifications.filter(n => !n.read).length;

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsNotifOpen(false);
    };

    const toggleNotif = () => {
        setIsNotifOpen(!isNotifOpen);
        setIsProfileOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const handleNotifClick = async (notif) => {
        if (!notif.read) {
            await notificationService.markAsRead(notif._id);
            setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
        }

        if (notif.relatedId) {
            // Check if relatedId is a ticket ID (TCK-xxxx) or mongoId
            // Actually, in our context, we usually navigate by mongoId but let's see
            // If it's a TCK-ID, we might need to search for it, but for now we'll assume it's navigable
            navigate(`/tickets/${notif.relatedId}`);
        }
        setIsNotifOpen(false);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'New Ticket': return <Clock size={16} />;
            case 'Assignment': return <UserIcon size={16} />;
            case 'Update': return <MessageSquare size={16} />;
            default: return <Bell size={16} />;
        }
    };

    const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

    return (
        <header className="top-navbar">
            <div className="navbar-left">
                <h1 className="navbar-title">{pageTitle}</h1>
            </div>

            <div className="navbar-right">
                <div className="navbar-search desktop-only">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search tickets, customers..."
                        className="search-input"
                    />
                </div>

                <div className="notification-wrapper" style={{ position: 'relative' }}>
                    <button className="icon-btn notification-btn" onClick={toggleNotif}>
                        <Bell size={20} />
                        {unreadCount > 0 && <span className="notification-dot"></span>}
                    </button>

                    {isNotifOpen && (
                        <div className="notifications-dropdown">
                            <div className="notifications-header">
                                <h3>Notifications ({unreadCount})</h3>
                                {unreadCount > 0 && (
                                    <button className="btn-mark-all" onClick={markAllAsRead}>
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="notifications-list">
                                {notifications.length > 0 ? (
                                    notifications.map(n => (
                                        <div
                                            key={n._id}
                                            className={`notification-item ${!n.read ? 'unread' : ''}`}
                                            onClick={() => handleNotifClick(n)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="notification-icon-circle">
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="notification-content">
                                                <span className="notification-title">{n.title}</span>
                                                <span className="notification-message">{n.message}</span>
                                                <span className="notification-time">
                                                    {new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="notification-empty">
                                        <Bell size={32} style={{ opacity: 0.2, margin: '0 auto' }} />
                                        <p>No notifications yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="profile-dropdown-container">
                    <button className="profile-trigger" onClick={toggleProfile}>
                        <div className="avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {user?.avatar ? (
                                <img src={`${API_BASE_URL}${user.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                (user?.name ? user.name.charAt(0) : 'A')
                            )}
                        </div>
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
