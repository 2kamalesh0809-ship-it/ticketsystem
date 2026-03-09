import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TextInput from '../components/forms/TextInput';
import SelectInput from '../components/forms/SelectInput';
import FormButton from '../components/forms/FormButton';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Admin');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password, role });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card card">
                <div className="login-header">
                    <img src="/logo.jpg" alt="Promptix Logo" className="login-logo-img" />
                    <h1 className="logo-text text-center mt-4">PROMPTIX SUPPORT SYSTEM</h1>
                    <p className="login-subtitle">Sign in to your account</p>
                </div>

                {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <TextInput
                        label="Email Address"
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <TextInput
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <SelectInput
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        options={[
                            { label: 'Administrator', value: 'Admin' },
                            { label: 'Support Member', value: 'Support Member' },
                            { label: 'Manager', value: 'Manager' }
                        ]}
                    />

                    <FormButton type="submit" className="login-btn w-100" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </FormButton>
                </form>
            </div>
        </div>
    );
};

export default Login;
