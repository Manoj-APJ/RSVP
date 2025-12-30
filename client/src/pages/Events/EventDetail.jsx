import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Calendar, Users, ArrowLeft } from 'lucide-react';

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
                const { data } = await axios.get(`http://localhost:5000/api/events/${id}`);
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
                    const { data } = await axios.get(`http://localhost:5000/api/rsvp/${id}/check`, {
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
            await axios.post(`http://localhost:5000/api/rsvp/${id}`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('RSVP Successful!');
            setEvent(newEvtData);
            setHasJoined(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'RSVP failed');
        } finally {
            setRsvpLoading(false);
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
    if (!event) return null;

    const isFull = event.attendeesCount >= event.capacity;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <Link to="/" className="btn btn-outline" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={16} /> Back to Events
            </Link>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', overflow: 'hidden' }}>
                {event.imageUrl && (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
                    />
                )}

                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{event.title}</h1>
                        <span style={{
                            background: isFull ? '#fee2e2' : '#d1fae5',
                            color: isFull ? '#b91c1c' : '#047857',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                        }}>
                            {isFull ? 'Sold Out' : 'Open'}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={20} />
                            <span>{new Date(event.dateTime).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={20} />
                            <span>{event.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={20} />
                            <span>{event.attendeesCount} / {event.capacity} Attendees</span>
                        </div>
                    </div>

                    <div style={{ margin: '1.5rem 0' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>About this Event</h3>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>
                            {event.description}
                        </p>
                    </div>

                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                        {/* 
                            Logic for button state:
                            - Not logged in -> "Login to RSVP"
                            - Logged in -> 
                                - Check if already RSVPed (Hard without separate endpoint, so we try/catch or disable if known)
                                - If full -> Disable
                        */}
                        <button
                            className={`btn ${isFull || hasJoined ? 'btn-outline' : 'btn-primary'}`}
                            style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                            onClick={handleRSVP}
                            disabled={isFull || rsvpLoading || hasJoined}
                        >
                            {rsvpLoading ? 'Processing...' : hasJoined ? 'You have joined this event' : isFull ? 'Event Full' : 'RSVP Now'}
                        </button>
                        {!user && (
                            <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
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
