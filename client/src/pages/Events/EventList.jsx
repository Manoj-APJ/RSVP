import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/events');
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading events...</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Upcoming Events</h1>
                {user && (
                    <Link to="/create-event" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                        <Plus size={18} /> Create Event
                    </Link>
                )}
                {!user && (
                    <Link to="/login" className="btn btn-primary">Login to Create</Link>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {events.map((event) => (
                    <div key={event._id} className="card">
                        {event.imageUrl && (
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.375rem', marginBottom: '1rem' }}
                            />
                        )}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{event.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {event.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <span>{new Date(event.dateTime).toLocaleDateString()}</span>
                            <span>{event.attendeesCount} / {event.capacity} Filled</span>
                        </div>
                        <Link
                            to={`/events/${event._id}`}
                            className="btn btn-outline"
                            style={{ width: '100%', marginTop: '1rem', textAlign: 'center' }}
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '3rem' }}>
                    No events found. Be the first to create one!
                </div>
            )}
        </div>
    );
};

export default EventList;
