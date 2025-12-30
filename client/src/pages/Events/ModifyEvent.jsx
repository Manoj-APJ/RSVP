import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Trash2 } from 'lucide-react';

const ModifyEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState('');
    const [image, setImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);

                // Check if user is the owner
                if (data.createdBy && data.createdBy._id !== user._id) {
                    toast.error('You are not authorized to modify this event');
                    navigate('/');
                    return;
                }

                // Pre-fill form with existing data
                setTitle(data.title || '');
                setDescription(data.description || '');

                // Format dateTime for datetime-local input
                if (data.dateTime) {
                    const date = new Date(data.dateTime);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    setDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
                }

                setLocation(data.location || '');
                setCapacity(data.capacity?.toString() || '');
                setCurrentImageUrl(data.imageUrl || '');
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || 'Failed to load event');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchEvent();
        } else {
            toast.error('Please login to modify events');
            navigate('/login');
        }
    }, [id, user, navigate]);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

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

            await api.put(`/events/${id}`, formData, config);
            toast.success('Event updated successfully!');
            navigate('/?tab=created');
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Failed to update event';
            if (error.response?.status === 403) {
                toast.error('You are not authorized to modify this event');
            } else if (error.response?.status === 404) {
                toast.error('Event not found');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone and will remove all related registrations.')) {
            return;
        }

        setDeleting(true);
        try {
            await api.delete(`/events/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Event deleted successfully');
            navigate('/?tab=created');
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Failed to delete event';
            if (error.response?.status === 403) {
                toast.error('You are not authorized to delete this event');
            } else if (error.response?.status === 404) {
                toast.error('Event not found');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <div>Loading event details...</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '2rem 1rem' }}>
            <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <Link to="/?tab=created" className="btn btn-outline" style={{
                    marginBottom: '2rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>

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
                        Modify Event
                    </h1>
                    <p style={{
                        marginTop: '0.75rem',
                        fontSize: '1rem',
                        opacity: 0.9,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        Update your event details
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
                            {currentImageUrl && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <img
                                        src={currentImageUrl}
                                        alt="Current event"
                                        style={{
                                            width: '100%',
                                            maxHeight: '250px',
                                            objectFit: 'cover',
                                            borderRadius: '0.75rem',
                                            marginBottom: '0.75rem',
                                            border: '2px solid var(--border-color)'
                                        }}
                                    />
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)',
                                        fontStyle: 'italic'
                                    }}>
                                        Current image. Upload a new image to replace it.
                                    </p>
                                </div>
                            )}
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
                        </div>

                        <div style={{
                            marginTop: '2rem',
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap',
                            paddingTop: '2rem',
                            borderTop: '2px solid var(--border-color)'
                        }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving || deleting}
                                style={{
                                    flex: 1,
                                    minWidth: '150px',
                                    padding: '1rem',
                                    fontSize: '1rem',
                                    fontWeight: '600'
                                }}
                            >
                                {saving ? 'Updating...' : '✨ Update Event'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => navigate('/?tab=created')}
                                disabled={saving || deleting}
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '1rem',
                                    fontWeight: '600'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={handleDelete}
                                disabled={saving || deleting}
                                style={{
                                    color: '#dc2626',
                                    borderColor: '#fee2e2',
                                    padding: '1rem 1.5rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Trash2 size={18} />
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModifyEvent;

