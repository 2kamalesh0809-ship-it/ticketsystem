import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { Camera, User, Mail, Smartphone, Hash, Save, Edit3 } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Initializing with mock data and context data
    const [profileData, setProfileData] = useState({
        fullName: user?.name || 'Admin User',
        email: 'admin.user@promptix.com',
        phone: '+91 98765 43210',
        employeeId: 'PRX-4082',
        role: user?.role || 'Administrator'
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Logic for "Save" would go here normally
            alert('Settings saved successfully.');
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="profile-container">
            {/* Page Header */}
            <PageHeader
                title="Profile"
                subtitle="Manage your account profile and personal settings."
            />

            {/* Section 1 — Profile Information */}
            <div className="profile-card">
                <div className="profile-card-header">
                    <h2 className="profile-section-title">Profile Information</h2>
                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                        Last updated: Feb 23, 2026
                    </span>
                </div>

                {/* Avatar Section */}
                <div className="avatar-section">
                    <div className="avatar-preview">
                        <User size={40} />
                    </div>
                    <div className="avatar-actions">
                        <button className="btn-upload flex-center gap-2">
                            <Camera size={14} /> Change Avatar
                        </button>
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                            JPG, GIF or PNG. Max size of 800K
                        </p>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="profile-form-grid">
                    <div className="profile-field-group">
                        <label className="profile-label">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            className="profile-input"
                            value={profileData.fullName}
                            disabled={!isEditing}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="profile-field-group">
                        <label className="profile-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="profile-input"
                            value={profileData.email}
                            disabled={!isEditing}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="profile-field-group">
                        <label className="profile-label">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            className="profile-input"
                            value={profileData.phone}
                            disabled={!isEditing}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="profile-field-group">
                        <label className="profile-label">Employee ID</label>
                        <input
                            type="text"
                            name="employeeId"
                            className="profile-input"
                            value={profileData.employeeId}
                            disabled={!isEditing}
                            onChange={handleInput}
                        />
                    </div>

                    <div className="profile-field-group profile-field-full">
                        <label className="profile-label">Role</label>
                        <input
                            type="text"
                            className="profile-input"
                            value={profileData.role}
                            disabled={true} // Read-only as per request
                        />
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                            Role permissions are managed by system administrators.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="profile-button-group">
                    <button
                        className="btn-edit flex-center gap-2"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel' : <><Edit3 size={16} /> Edit Profile</>}
                    </button>
                    <button
                        className="btn-save-profile flex-center gap-2"
                        onClick={toggleEdit}
                        disabled={!isEditing}
                        style={{ opacity: isEditing ? 1 : 0.5, cursor: isEditing ? 'pointer' : 'default' }}
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Additional Professional Placeholder Sections to fill the max-w-5xl space as requested */}
            <div className="profile-card">
                <h2 className="profile-section-title mb-6">Security & Authentication</h2>
                <div className="flex-center justify-between">
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Password</p>
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>Last changed 4 months ago</p>
                    </div>
                    <button className="btn-edit">Change Password</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
