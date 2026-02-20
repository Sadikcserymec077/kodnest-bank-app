import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const [username, setUsername] = useState('');
    const [tokenStr, setTokenStr] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    const { width, height } = useWindowSize();

    useEffect(() => {
        // Check if user is logged in
        const storedUsername = localStorage.getItem('username');
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
        } else {
            setUsername(storedUsername || 'User');
            setTokenStr(token);
        }
    }, [navigate]);

    const handleCheckBalance = async () => {
        setError('');
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No balance without login');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${apiUrl}/api/auth/balance`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            setBalance(response.data.balance);

            // Trigger Confetti Animation
            setShowConfetti(true);
            setTimeout(() => {
                setShowConfetti(false);
            }, 5000); // Stop confetti after 5 seconds

        } catch (err) {
            // Handle expired or invalid token
            if (err.response?.status === 401) {
                setError(err.response?.data?.error || 'Session expired. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                setTimeout(() => navigate('/login'), 2500);
            } else {
                setError(err.response?.data?.error || 'Failed to fetch balance');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div className="animated-bg" style={{ minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
            {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} gravity={0.15} />}

            <nav className="navbar">
                <div className="logo">
                    <div className="logo-icon">K</div>
                    Kodbank
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    Sign Out
                </button>
            </nav>

            <div className="dashboard-container">
                <div className="glass-card">
                    <h1 className="welcome-text">
                        Welcome, <span>{username}</span>!
                    </h1>
                    <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>
                        Manage your finances seamlessly with Kodbank's secure dashboard.
                    </p>

                    {error && <div className="error-msg" style={{ maxWidth: '80%', margin: '0 auto 1.5rem auto' }}>{error}</div>}

                    {/* Token Display Section */}
                    {tokenStr && (
                        <div className="token-display-box" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: '500' }}>Your JWT Token</span>
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <button
                                        onClick={() => setShowToken(!showToken)}
                                        style={{ background: 'none', border: 'none', color: '#818CF8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        title={showToken ? "Hide Token" : "Show Token"}
                                    >
                                        {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(tokenStr);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        style={{ background: 'none', border: 'none', color: copied ? '#10B981' : '#818CF8', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                                        title="Copy Token"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div style={{ wordBreak: 'break-all', fontSize: '0.85rem', color: showToken ? '#E0E7FF' : '#475569', fontFamily: 'monospace', filter: showToken ? 'none' : 'blur(4px)', transition: 'all 0.3s ease', userSelect: showToken ? 'auto' : 'none' }}>
                                {tokenStr}
                            </div>
                        </div>
                    )}

                    <button onClick={handleCheckBalance} className="balance-btn">
                        Check Balance
                    </button>

                    {balance !== null && (
                        <div className={`balance-display ${balance !== null ? 'visible' : ''}`}>
                            <div className="balance-label">Your balance is:</div>
                            <div className="balance-amount">
                                <span className="currency-symbol">$</span>
                                {parseFloat(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
