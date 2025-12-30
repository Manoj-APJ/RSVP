import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Calendar, Users, ArrowLeft, Trash2 } from 'lucide-react';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rsvpLoading, setRsvpLoading] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (error) {
                toast.error('Event not found');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        const checkRSVP = async () => {
            if (user) {
                try {
                    const { data } = await api.get(`/rsvp/${id}/check`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    setHasJoined(data.hasRSVPed);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        fetchEvent();
        checkRSVP();
    }, [id, navigate, user]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            await api.delete(`/events/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Event deleted successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const handleRSVP = async () => {
        if (!user) {
            toast.error('Please login to RSVP');
            return navigate('/login');
        }

        if (event.attendeesCount >= event.capacity) {
            toast.error('Event is full!');
            return;
        }

        setRsvpLoading(true);
        try {
            await api.post(`/rsvp/${id}`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('RSVP Successful!');
            const { data } = await api.get(`/events/${id}`);
            setEvent(data);
            setHasJoined(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'RSVP failed');
        } finally {
            setRsvpLoading(false);
        }
    };

    if (loading) return (
        <div className="container" style={{
            marginTop: '2rem',
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>Loading...</div>
        </div>
    );
    if (!event) return null;

    const isFull = event.attendeesCount >= event.capacity;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            {/* Hero Section with Gradient */}
            <section className="hero-gradient" style={{
                padding: '3rem 0',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '3rem'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(5, 150, 105, 0.3) 0%, transparent 50%)',
                    opacity: 0.5
                }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/" className="btn" style={{
                        marginBottom: '2rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <ArrowLeft size={16} /> Back to Events
                    </Link>

                    {event.imageUrl && (
                        <div style={{
                            width: '100%',
                            maxWidth: '900px',
                            height: '400px',
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            marginBottom: '2rem',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                        }}>
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ maxWidth: '900px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h1 style={{
                                fontSize: '3rem',
                                fontWeight: '800',
                                margin: 0,
                                lineHeight: '1.1',
                                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                flex: 1,
                                minWidth: '300px'
                            }}>
                                {event.title}
                            </h1>
                            <span style={{
                                background: isFull ? 'rgba(220, 38, 38, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                                color: 'white',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '999px',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                backdropFilter: 'blur(10px)',
                                whiteSpace: 'nowrap'
                            }}>
                                {isFull ? 'Sold Out' : 'Open'}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '2rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                                <Calendar size={22} />
                                <span style={{ fontWeight: '500' }}>{new Date(event.dateTime).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                                <MapPin size={22} />
                                <span style={{ fontWeight: '500' }}>{event.location}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem' }}>
                                <Users size={22} />
                                <span style={{ fontWeight: '500' }}>{event.attendeesCount} / {event.capacity} Attendees</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" style={{ padding: '0 1rem 2rem', maxWidth: '900px' }}>
                <div className="card" style={{
                    marginBottom: '2rem',
                    borderRadius: '1.25rem',
                    padding: '2.5rem'
                }}>
                    {user && event.createdBy && user._id === event.createdBy._id && (
                        <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '2px solid var(--border-color)' }}>
                            <button
                                onClick={handleDelete}
                                className="btn btn-outline"
                                style={{
                                    color: '#dc2626',
                                    borderColor: '#fee2e2',
                                    padding: '0.75rem 1.5rem',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Trash2 size={16} /> Delete Event
                            </button>
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            color: 'var(--text-main)'
                        }}>
                            About this Event
                        </h2>
                        <p style={{
                            lineHeight: '1.8',
                            color: 'var(--text-main)',
                            fontSize: '1rem'
                        }}>
                            {event.description}
                        </p>
                    </div>

                    <div style={{
                        marginTop: '2rem',
                        borderTop: '2px solid var(--border-color)',
                        paddingTop: '2rem'
                    }}>
                        <button
                            className={isFull || hasJoined ? 'btn btn-outline' : 'btn btn-accent'}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                borderRadius: '1rem'
                            }}
                            onClick={handleRSVP}
                            disabled={isFull || rsvpLoading || hasJoined}
                        >
                            {rsvpLoading ? 'Processing...' : hasJoined ? '✓ You have joined this event' : isFull ? 'Event Full' : '🎉 RSVP Now'}
                        </button>
                        {!user && (
                            <p style={{
                                textAlign: 'center',
                                marginTop: '1rem',
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)'
                            }}>
                                You must be logged in to RSVP.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
