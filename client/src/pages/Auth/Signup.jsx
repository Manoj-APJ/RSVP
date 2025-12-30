import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        const result = await signup(name, email, password);
        if (result.success) {
            toast.success('Account created! Welcome.');
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            background: 'var(--bg-color)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                animation: 'fadeInUp 0.5s ease-out'
            }}>
                {/* Hero Section */}
                <div className="hero-gradient" style={{
                    padding: '3rem 2rem',
                    borderRadius: '1.5rem 1.5rem 0 0',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                        opacity: 0.5
                    }}></div>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        margin: 0,
                        position: 'relative',
                        zIndex: 1,
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        Create Account
                    </h2>
                    <p style={{
                        marginTop: '0.75rem',
                        fontSize: '1rem',
                        opacity: 0.9,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        Join us and start discovering events
                    </p>
                </div>

                {/* Form Card */}
                <div className="card" style={{
                    borderRadius: '0 0 1.5rem 1.5rem',
                    marginTop: '-1px',
                    padding: '2.5rem'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <input
                                type="text"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <input
                                type="email"
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                            <p style={{
                                marginTop: '0.5rem',
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)'
                            }}>
                                Must be at least 6 characters
                            </p>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            marginTop: '0.5rem'
                        }}>
                            Sign Up
                        </button>
                    </form>
                    <p style={{
                        marginTop: '1.5rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)'
                    }}>
                        Already have an account? <Link to="/login" style={{
                            color: 'var(--primary-color)',
                            fontWeight: '600',
                            textDecoration: 'none'
                        }}>Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
