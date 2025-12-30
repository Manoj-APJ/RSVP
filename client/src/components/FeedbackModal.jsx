import { useState, useEffect } from 'react';
import { X, Star, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FeedbackModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        rating: 0
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({ name: '', email: '', message: '', rating: 0 });
            setSuccess(false);
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.message.trim()) {
            return toast.error('Please enter a message');
        }

        setLoading(true);
        try {
            const response = await fetch("https://formspree.io/f/xeeqwnpj", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(true);
                toast.success('Thank you for your feedback!');
                // Close modal after 2 seconds
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.2s ease-out'
                }}
            />

            {/* Modal */}
            <div
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    background: 'white',
                    position: 'relative',
                    zIndex: 1001,
                    padding: '2rem',
                    borderRadius: '1.5rem',
                    animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.25rem',
                        right: '1.25rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <X size={20} />
                </button>

                {success ? (
                    <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: '#d1fae5',
                            color: 'var(--primary-color)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto'
                        }}>
                            <Send size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Feedback Sent!</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Thank you for helping us improve.</p>
                    </div>
                ) : (
                    <>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Leave a Review</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>We'd love to hear your thoughts!</p>

                        <form onSubmit={handleSubmit}>
                            {/* Rating */}
                            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '0.25rem',
                                            color: (hoverRating || formData.rating) >= star ? '#fbbf24' : '#e5e7eb',
                                            transition: 'transform 0.2s',
                                            transform: (hoverRating >= star) ? 'scale(1.1)' : 'scale(1)'
                                        }}
                                    >
                                        <Star size={32} fill={(hoverRating || formData.rating) >= star ? 'currentColor' : 'none'} />
                                    </button>
                                ))}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Name (Optional)</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Email (Optional)</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Message *</label>
                                <textarea
                                    className="input-field"
                                    rows="4"
                                    required
                                    placeholder="Tell us about your experience..."
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    style={{ resize: 'vertical', minHeight: '100px' }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ width: '100%', padding: '1rem' }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="spin" size={20} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Feedback
                                        <Send size={18} style={{ marginLeft: '0.5rem' }} />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default FeedbackModal;
