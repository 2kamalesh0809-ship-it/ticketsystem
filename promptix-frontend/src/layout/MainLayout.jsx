import React, { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem('sidebarCollapsed') === 'true';
    });

    const location = useLocation();

    const pageTitle = useMemo(() => {
        const path = location.pathname;
        if (path.includes('/dashboard')) return 'Dashboard Overview';
        if (path.includes('/tickets/create')) return 'Create New Ticket';
        if (path.includes('/tickets/')) return 'Ticket Details';
        if (path.includes('/tickets')) return 'Ticket Management';
        if (path.includes('/customers/')) return 'Customer Profile';
        if (path.includes('/customers')) return 'Customers';
        if (path.includes('/call-logs')) return 'Communication Logs';
        if (path.includes('/reports')) return 'System Reports';
        if (path.includes('/audit-report')) return 'Audit Trail';
        if (path.includes('/agent-view')) return 'Agent Workspace';
        if (path.includes('/profile')) return 'My Profile';
        if (path.includes('/settings')) return 'System Settings';
        return 'SaaS Platform';
    }, [location.pathname]);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const toggleCollapse = () => {
        setIsCollapsed(prev => {
            const newState = !prev;
            localStorage.setItem('sidebarCollapsed', newState);
            return newState;
        });
    };

    return (
        <div className={`app-layout ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Fixed Left Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isCollapsed}
                onClose={closeSidebar}
                onToggleCollapse={toggleCollapse}
            />

            {/* Main Content Wrapper */}
            <div className="main-wrapper">
                {/* Top Navbar */}
                <Navbar
                    onMenuClick={toggleSidebar}
                    pageTitle={pageTitle}
                />

                {/* Scrollable Page Content Area */}
                <main className="main-content">
                    <div className="content-container">
                        {/* Render children if passed directly, else fallback to Router's Outlet */}
                        {children || <Outlet />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
