import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import userService from '../services/userService';
import { Camera, User, Mail, Smartphone, Hash, Save, Edit3, X, CheckCircle, AlertCircle } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        employeeId: user?.employeeId || '',
        role: user?.role || 'Support Member'
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                employeeId: user.employeeId || '',
                role: user.role || 'Support Member'
            });
        }
    }, [user]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordInput = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const clearMessage = () => setTimeout(() => setMessage({ type: '', text: '' }), 5000);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedUser = await userService.updateProfile(profileData);
            updateUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            clearMessage();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
            clearMessage();
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            await userService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            clearMessage();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <PageHeader
                title="Profile"
                subtitle="Manage your account profile and personal settings."
            />

            {message.text && (
                <div className={`status-toast ${message.type === 'success' ? 'success' : 'error'} mb-4`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: message.type === 'success' ? '#065f46' : '#991b1b',
                    border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                    marginBottom: '20px'
                }}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="profile-card">
                <div className="profile-card-header">
                    <h2 className="profile-section-title">Profile Information</h2>
                </div>

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

                <div className="profile-form-grid">
                    <div className="profile-field-group">
                        <label className="profile-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="profile-input"
                            value={profileData.name}
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
                            placeholder="+91 XXXXX XXXXX"
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
                            placeholder="PRX-XXXX"
                        />
                    </div>

                    <div className="profile-field-group profile-field-full">
                        <label className="profile-label">Role</label>
                        <input
                            type="text"
                            className="profile-input"
                            value={profileData.role}
                            disabled={true}
                        />
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                            Role permissions are managed by system administrators.
                        </p>
                    </div>
                </div>

                <div className="profile-button-group">
                    <button
                        className="btn-edit flex-center gap-2"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel' : <><Edit3 size={16} /> Edit Profile</>}
                    </button>
                    <button
                        className="btn-save-profile flex-center gap-2"
                        onClick={handleSave}
                        disabled={!isEditing || loading}
                        style={{ opacity: isEditing ? 1 : 0.5, cursor: isEditing ? 'pointer' : 'default' }}
                    >
                        {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                    </button>
                </div>
            </div>

            <div className="profile-card">
                <h2 className="profile-section-title mb-6">Security & Authentication</h2>
                <div className="flex-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Password</p>
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>Update your password to keep your account secure.</p>
                    </div>
                    <button className="btn-edit" onClick={() => setShowPasswordModal(true)}>Change Password</button>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay flex-center" style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="modal-content card" style={{ width: '100%', maxWidth: '400px', padding: '24px', backgroundColor: 'white', borderRadius: '12px' }}>
                        <div className="flex-center justify-between mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 className="section-title">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={20} color="#6b7280" />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordChange}>
                            <div className="profile-field-group mb-4" style={{ marginBottom: '15px' }}>
                                <label className="profile-label">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="profile-input"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordInput}
                                    required
                                />
                            </div>
                            <div className="profile-field-group mb-4" style={{ marginBottom: '15px' }}>
                                <label className="profile-label">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="profile-input"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordInput}
                                    required
                                />
                            </div>
                            <div className="profile-field-group mb-6" style={{ marginBottom: '20px' }}>
                                <label className="profile-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="profile-input"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordInput}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary w-100" style={{
                                width: '100%', padding: '12px', backgroundColor: 'var(--primary)',
                                color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
                            }} disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
