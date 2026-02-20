import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData, {
                withCredentials: true,
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);

            // Redirect to User Dashboard
            navigate('/userdashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="animated-bg">
            <div className="auth-container">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Login to your Kodbank dashboard</p>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Secure Login
                    </button>
                </form>

                <div className="link-text">
                    Don't have an account? <Link to="/register">Create one now</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
