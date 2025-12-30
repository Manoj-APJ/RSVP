import { ExternalLink, MessageSquare, Github } from 'lucide-react';
import { useState } from 'react';
import FeedbackModal from './FeedbackModal';

const Footer = () => {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    return (
        <footer style={{
            marginTop: 'auto',
            padding: '4rem 1rem 2rem',
            background: '#0a0a0a',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderTop: '1px solid #222'
        }}>
            {/* Watermark Background */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '15vw',
                fontWeight: '900',
                color: 'white',
                opacity: 0.03,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 0
            }}>
                BOOKMYSPOT
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>

                {/* Main Content Area */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: 'var(--primary-color)',
                        marginBottom: '1rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                    }}>
                        Your Partner in Event Management
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '900',
                        margin: 0,
                        color: '#222',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        lineHeight: 1
                    }}>
                        <span style={{ color: '#ffffff' }}>BOOK</span>
                        <span style={{ color: '#333' }}>MY</span>
                        <span style={{ color: '#ffffff' }}>SPOT</span>
                    </h2>
                </div>

                {/* Actions & Links */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    paddingTop: '2rem'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={() => setIsFeedbackOpen(true)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '2rem',
                                padding: '0.75rem 1.5rem',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--primary-color)';
                                e.currentTarget.style.borderColor = 'var(--primary-color)';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.color = 'white';
                            }}
                        >
                            <MessageSquare size={16} />
                            Drop us a Review
                        </button>

                        <a
                            href="https://github.com/Manoj-APJ/RSVP"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '2rem',
                                padding: '0.75rem 1.5rem',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'white';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                        >
                            <Github size={16} />
                            Contribute on GitHub
                        </a>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#666',
                        fontSize: '0.875rem'
                    }}>
                        <span>&copy; {new Date().getFullYear()} BookMySpot. All rights reserved.</span>
                        <span style={{ margin: '0 0.5rem' }}>|</span>
                        <span>Designed by</span>
                        <a
                            href="https://manojtalent.netlify.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'var(--primary-color)',
                                fontWeight: '600',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            Manoj <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
            </div>

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
        </footer>
    );
};

export default Footer;
