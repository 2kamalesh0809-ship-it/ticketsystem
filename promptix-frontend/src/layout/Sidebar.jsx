
import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Ticket as TicketIcon,
    Users,
    User,
    Phone,
    BarChart3,
    Shield,
    PlayCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tickets', label: 'Tickets', icon: TicketIcon },
    { id: 'agent-view', label: 'Member View', icon: PlayCircle },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'call-logs', label: 'Call Logs', icon: Phone },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'audit-report', label: 'Ticket Reports', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User }
];

const Sidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse }) => {
    const { user } = useAuth();
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay Background */}
            <div
                className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
                onClick={onClose}
            />

            {/* Main Sidebar Component Container */}
            <aside className={`sidebar-container ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>

                <div className="sidebar-header">
                    {!isCollapsed && (
                        <div className="logo-container">
                            <img src="/logo.jpg" alt="Logo" className="sidebar-logo-img" />
                            <h2 className="logo-text">PROMPTIX <span className="logo-text-small">SUPPORT SYSTEM</span></h2>
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="logo-container-collapsed">
                            <img src="/logo.jpg" alt="L" className="sidebar-logo-img-sm" />
                        </div>
                    )}

                    {/* Collapse Button (Desktop Only) */}
                    <button className="desktop-collapse-btn" onClick={onToggleCollapse}>
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <nav className="sidebar-menu">
                    {navItems.filter(item => {
                        if (!user) return false;
                        if (user.role === 'Admin') return true;
                        if (user.role === 'Support Member') return ['dashboard', 'tickets', 'agent-view', 'customers', 'profile'].includes(item.id);
                        if (user.role === 'Manager') return ['dashboard', 'tickets', 'reports', 'audit-report', 'profile'].includes(item.id);
                        return false;
                    }).map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.id}
                                to={`/${item.id}`}
                                className={`menu-item ${location.pathname.startsWith(`/${item.id}`) ? 'active' : ''}`}
                                onClick={() => {
                                    if (onClose) onClose();
                                }}
                                title={isCollapsed ? item.label : ''}
                            >
                                <Icon size={20} className="menu-icon" />
                                {!isCollapsed && <span className="menu-label">{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom Profile Section */}
                <div className="sidebar-footer">
                    <Link to="/profile" className="user-profile-sm" onClick={() => onClose && onClose()}>
                        <div className="avatar-placeholder">{user?.name ? user.name.charAt(0) : 'A'}</div>
                        {!isCollapsed && (
                            <div className="user-details">
                                <span className="user-name">{user?.name}</span>
                                <span className="user-role">{user?.role}</span>
                            </div>
                        )}
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
