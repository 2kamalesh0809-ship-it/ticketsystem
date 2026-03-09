import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import {
    Settings as GeneralIcon,
    Ticket,
    CheckCircle2,
    Users,
    Bell,
    Palette,
    Lock,
    Check,
    Save
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [toast, setToast] = useState(null);

    // Mock initial settings data
    const initialSettings = {
        general: {
            siteName: 'Promptix Support',
            supportEmail: 'support@promptix.io',
            timezone: 'UTC+5:30',
            language: 'English'
        },
        ticket: {
            autoAssign: true,
            slaHours: '24',
            mandatoryNotes: true,
            allowAttachments: true
        },
        notifications: {
            emailAlerts: true,
            browserPush: false,
            newTicketSound: true,
            weeklyReports: true
        },
        appearance: {
            theme: 'light',
            primaryColor: '#2563eb',
            compactMode: false,
            showAvatars: true
        },
        security: {
            twoFactor: false,
            passwordExpiry: '90',
            sessionTimeout: '30',
            ipRestriction: false
        }
    };

    const [formData, setFormData] = useState(initialSettings);
    const [savedState, setSavedState] = useState(initialSettings);

    const tabs = [
        { id: 'general', label: 'General', icon: GeneralIcon },
        { id: 'ticket', label: 'Ticket Settings', icon: Ticket },
        { id: 'status', label: 'Status & Priority', icon: CheckCircle2 },
        { id: 'users', label: 'Users & Roles', icon: Users },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'security', label: 'Security', icon: Lock }
    ];

    const currentTabData = formData[activeTab] || {};
    const hasChanges = useMemo(() => {
        return JSON.stringify(formData[activeTab]) !== JSON.stringify(savedState[activeTab]);
    }, [formData, savedState, activeTab]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        setSavedState(prev => ({
            ...prev,
            [activeTab]: formData[activeTab]
        }));

        showToast(`Settings for ${activeTab} saved successfully!`);
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="settings-form-section">
                        <div className="settings-group">
                            <label className="settings-label">Platform Name</label>
                            <input
                                type="text"
                                className="settings-input"
                                value={currentTabData.siteName}
                                onChange={(e) => handleInputChange('siteName', e.target.value)}
                            />
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">Support Email Address</label>
                            <input
                                type="email"
                                className="settings-input"
                                value={currentTabData.supportEmail}
                                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                            />
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">Default Timezone</label>
                            <select
                                className="settings-select"
                                value={currentTabData.timezone}
                                onChange={(e) => handleInputChange('timezone', e.target.value)}
                            >
                                <option value="UTC-8:00">PST (UTC-8:00)</option>
                                <option value="UTC+0:00">GMT (UTC+0:00)</option>
                                <option value="UTC+5:30">IST (UTC+5:30)</option>
                            </select>
                        </div>
                    </div>
                );
            case 'ticket':
                return (
                    <div className="settings-form-section">
                        <div className="toggle-wrapper">
                            <div className="toggle-info">
                                <span className="toggle-title">Auto-assign Tickets</span>
                                <span className="toggle-desc">Automatically distribute new tickets to available agents.</span>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={currentTabData.autoAssign}
                                    onChange={(e) => handleInputChange('autoAssign', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">Default SLA (Hours)</label>
                            <input
                                type="number"
                                className="settings-input"
                                value={currentTabData.slaHours}
                                onChange={(e) => handleInputChange('slaHours', e.target.value)}
                            />
                        </div>
                        <div className="toggle-wrapper">
                            <div className="toggle-info">
                                <span className="toggle-title">Mandatory Internal Notes</span>
                                <span className="toggle-desc">Require a note before closing a ticket.</span>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={currentTabData.mandatoryNotes}
                                    onChange={(e) => handleInputChange('mandatoryNotes', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="settings-form-section">
                        <div className="toggle-wrapper">
                            <div className="toggle-info">
                                <span className="toggle-title">Email Notifications</span>
                                <span className="toggle-desc">Receive updates via your registered email.</span>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={currentTabData.emailAlerts}
                                    onChange={(e) => handleInputChange('emailAlerts', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="toggle-wrapper">
                            <div className="toggle-info">
                                <span className="toggle-title">Browser Push</span>
                                <span className="toggle-desc">Real-time desktop alerts for new tickets.</span>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={currentTabData.browserPush}
                                    onChange={(e) => handleInputChange('browserPush', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                );
            case 'appearance':
                return (
                    <div className="settings-form-section">
                        <div className="settings-group">
                            <label className="settings-label">System Theme</label>
                            <div className="theme-options">
                                <select
                                    className="settings-select"
                                    value={currentTabData.theme}
                                    onChange={(e) => handleInputChange('theme', e.target.value)}
                                >
                                    <option value="light">Light Mode (Default)</option>
                                    <option value="dark">Dark Mode</option>
                                    <option value="system">Follow System</option>
                                </select>
                            </div>
                        </div>
                        <div className="toggle-wrapper">
                            <div className="toggle-info">
                                <span className="toggle-title">Compact View</span>
                                <span className="toggle-desc">Show more data on tables with less spacing.</span>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={currentTabData.compactMode}
                                    onChange={(e) => handleInputChange('compactMode', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="settings-form-section">
                        <div className="toggle-wrapper">
                            <div className="toggle-info">
                                <span className="toggle-title">Two-Factor Authentication</span>
                                <span className="toggle-desc">Add an extra layer of security to your account.</span>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={currentTabData.twoFactor}
                                    onChange={(e) => handleInputChange('twoFactor', e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">Password Expiry (Days)</label>
                            <input
                                type="number"
                                className="settings-input"
                                value={currentTabData.passwordExpiry}
                                onChange={(e) => handleInputChange('passwordExpiry', e.target.value)}
                            />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="settings-empty">
                        <div className="card text-center p-8">
                            <Lock size={48} className="text-muted mb-4" />
                            <h3>Under Development</h3>
                            <p className="text-muted">This settings module is currently being configured.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="settings-page">
            <PageHeader
                title="System Settings"
                subtitle="Configure platform behavior, notifications, and security protocols"
            />

            <div className="settings-container">
                {/* Left Tabs */}
                <div className="settings-sidebar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={18} className="tab-icon" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="settings-content-card">
                    <div className="settings-card-header">
                        <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
                        <p>Manage your {activeTab} preferences and account configurations.</p>
                    </div>

                    <div className="settings-card-body">
                        {renderTabContent()}
                    </div>

                    <div className="settings-footer">
                        <button
                            className="btn-save-settings"
                            disabled={!hasChanges}
                            onClick={handleSave}
                        >
                            <Save size={16} className="mr-2" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            {toast && (
                <div className="settings-toast">
                    <Check size={20} className="toast-icon" />
                    <span>{toast}</span>
                </div>
            )}
        </div>
    );
};

export default Settings;
