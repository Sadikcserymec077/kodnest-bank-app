import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        uid: '',
        username: '',
        email: '',
        password: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="animated-bg">
            <div className="auth-container">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join Kodbank today to manage your finances securely.</p>
                </div>

                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>UID (Unique ID)</label>
                        <input
                            type="number"
                            name="uid"
                            value={formData.uid}
                            onChange={handleChange}
                            required
                            placeholder="Enter a unique number"
                        />
                    </div>

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a strong password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Register Account
                    </button>
                </form>

                <div className="link-text">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
