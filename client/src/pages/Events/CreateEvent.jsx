import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const CreateEvent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth(); // just to double check token usage
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('dateTime', dateTime);
        formData.append('location', location);
        formData.append('capacity', capacity);
        if (image) {
            formData.append('image', image);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await api.post('/events', formData, config);
            toast.success('Event created successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '2rem 1rem' }}>
            <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Hero Section */}
                <div className="hero-gradient" style={{
                    padding: '3rem 2rem',
                    borderRadius: '1.5rem 1.5rem 0 0',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '-1px'
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
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        margin: 0,
                        position: 'relative',
                        zIndex: 1,
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        Create New Event
                    </h1>
                    <p style={{
                        marginTop: '0.75rem',
                        fontSize: '1rem',
                        opacity: 0.9,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        Share your event with the community
                    </p>
                </div>

                {/* Form Card */}
                <div className="card" style={{
                    borderRadius: '0 0 1.5rem 1.5rem',
                    padding: '2.5rem'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Event Title</label>
                            <input
                                type="text"
                                className="input-field"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="Enter event title"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Description</label>
                            <textarea
                                className="input-field"
                                rows="5"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                placeholder="Describe your event..."
                                style={{
                                    resize: 'vertical',
                                    minHeight: '120px',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div className="input-group">
                                <label className="input-label">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    className="input-field"
                                    value={dateTime}
                                    onChange={e => setDateTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Capacity</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    min="1"
                                    value={capacity}
                                    onChange={e => setCapacity(e.target.value)}
                                    required
                                    placeholder="Max attendees"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Location</label>
                            <input
                                type="text"
                                className="input-field"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                required
                                placeholder="Event location"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Event Image</label>
                            <input
                                type="file"
                                className="input-field"
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{
                                    padding: '0.75rem',
                                    cursor: 'pointer'
                                }}
                            />
                            <p style={{
                                marginTop: '0.5rem',
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)'
                            }}>
                                Upload an image to make your event stand out
                            </p>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{
                                flex: 1,
                                minWidth: '150px',
                                padding: '1rem',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}>
                                {loading ? 'Creating...' : '✨ Create Event'}
                            </button>
                            <button type="button" className="btn btn-outline" onClick={() => navigate('/')} style={{
                                padding: '1rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
