import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProfileMenu from '../../components/ProfileMenu';
import { Calendar, MapPin, Users, Plus, Edit, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const EventList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(() => {
        const tab = searchParams.get('tab');
        return tab === 'created' || tab === 'registered' ? tab : 'upcoming';
    });

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                if (user) {
                    // Fetch dashboard events for logged-in users
                    const { data } = await api.get('/events/dashboard', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    setEvents(data);
                } else {
                    // For non-logged-in users, fetch all events
                    const { data } = await api.get('/events');
                    setEvents(data);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user]);

    // Handle tab change from URL query params
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'created' || tab === 'registered') {
            setActiveTab(tab);
        } else if (tab === 'upcoming' || !tab) {
            setActiveTab('upcoming');
        }
    }, [searchParams]);

    // Update URL when tab changes
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    // Filter events based on active tab
    const getFilteredEvents = () => {
        if (!user) {
            // For non-logged-in users, show all upcoming events
            const currentDate = new Date();
            return events.filter(event => new Date(event.dateTime) >= currentDate);
        }

        const currentDate = new Date();
        const userId = user._id;

        switch (activeTab) {
            case 'upcoming':
                return events.filter(event => new Date(event.dateTime) >= currentDate);
            case 'created':
                return events.filter(event =>
                    event.createdBy && String(event.createdBy._id) === String(userId)
                );
            case 'registered':
                return events.filter(event => event.isRegistered === true);
            default:
                return events;
        }
    };

    const filteredEvents = getFilteredEvents();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            {/* Modern Header */}
            <header style={{
                background: 'white',
                borderBottom: '1px solid var(--border-color)',
                padding: '1.25rem 0',
                boxShadow: 'var(--shadow-sm)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.95)'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Link to="/" style={{
                        fontSize: '1.875rem',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                        letterSpacing: '-0.02em',
                        textTransform: 'none'
                    }}>
                        BookMySpot
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {user ? (
                            <>
                                <Link to="/create-event" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Plus size={18} />
                                    Create Event
                                </Link>
                                <ProfileMenu />
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline">Log In</Link>
                                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section for non-logged-in users */}
            {!user && (
                <section style={{
                    padding: '6rem 0',
                    marginBottom: '3rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'var(--dark-charcoal)'
                }}>
                    {/* Grid pattern overlay */}
                    <div
                        className="hero-grid-pattern"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: 0.4,
                            zIndex: 0
                        }}
                    />
                    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                        {/* Headline */}
                        <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: 'var(--bright-green)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '1.5rem',
                            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                        }}>
                            A POWERFUL VALUE PROPOSITION
                        </div>

                        {/* Main Title */}
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            fontWeight: '900',
                            marginBottom: '2rem',
                            lineHeight: '1.1',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                            color: 'white',
                            position: 'relative'
                        }}>
                            EXPERIENCE EVENTS THAT MATTER
                            {/* Decorative lines under text */}
                            <span style={{
                                display: 'block',
                                marginTop: '0.5rem',
                                height: '3px',
                                width: '200px',
                                background: 'var(--bright-green)',
                                position: 'relative'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '210px',
                                    top: '0',
                                    height: '2px',
                                    width: '150px',
                                    background: 'var(--bright-green)',
                                    opacity: 0.6
                                }}></span>
                                <span style={{
                                    position: 'absolute',
                                    left: '370px',
                                    top: '0',
                                    height: '1px',
                                    width: '100px',
                                    background: 'var(--bright-green)',
                                    opacity: 0.4
                                }}></span>
                            </span>
                        </h1>

                        {/* Description */}
                        <p style={{
                            fontSize: '1.125rem',
                            marginBottom: '3rem',
                            color: 'var(--light-grey)',
                            maxWidth: '700px',
                            lineHeight: '1.7',
                            fontWeight: '400',
                            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                        }}>
                            From tech meetups to cultural nights — discover events, book instantly, and be part of something exciting.
                        </p>

                        {/* CTA Button */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link
                                to="/signup"
                                className="btn"
                                style={{
                                    fontSize: '1rem',
                                    padding: '1rem 2.5rem',
                                    background: 'var(--bright-green)',
                                    color: 'white',
                                    fontWeight: '600',
                                    borderRadius: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    transition: 'all 0.3s ease',
                                    border: 'none',
                                    textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--bright-green-hover)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bright-green)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                to="/login"
                                className="btn"
                                style={{
                                    background: 'transparent',
                                    color: 'var(--light-grey)',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    fontSize: '1rem',
                                    padding: '1rem 2rem',
                                    fontWeight: '500',
                                    borderRadius: '0.5rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--bright-green)';
                                    e.currentTarget.style.color = 'var(--bright-green)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                    e.currentTarget.style.color = 'var(--light-grey)';
                                }}
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            <div className="container" style={{ padding: '0 1rem 2rem' }}>
                {user && (
                    <div style={{ marginBottom: '3rem' }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            marginBottom: '2rem',
                            background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Your Dashboard
                        </h1>

                        {/* Modern Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            borderBottom: '2px solid var(--border-color)',
                            marginBottom: '2rem',
                            background: 'white',
                            padding: '0.5rem',
                            borderRadius: '0.75rem',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <button
                                onClick={() => handleTabChange('upcoming')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    background: activeTab === 'upcoming' ? 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' : 'transparent',
                                    color: activeTab === 'upcoming' ? 'white' : 'var(--text-secondary)',
                                    fontWeight: activeTab === 'upcoming' ? '600' : '500',
                                    cursor: 'pointer',
                                    borderRadius: '0.5rem',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Upcoming Events
                            </button>
                            <button
                                onClick={() => handleTabChange('created')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    background: activeTab === 'created' ? 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' : 'transparent',
                                    color: activeTab === 'created' ? 'white' : 'var(--text-secondary)',
                                    fontWeight: activeTab === 'created' ? '600' : '500',
                                    cursor: 'pointer',
                                    borderRadius: '0.5rem',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Created Events
                            </button>
                            <button
                                onClick={() => handleTabChange('registered')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    background: activeTab === 'registered' ? 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' : 'transparent',
                                    color: activeTab === 'registered' ? 'white' : 'var(--text-secondary)',
                                    fontWeight: activeTab === 'registered' ? '600' : '500',
                                    cursor: 'pointer',
                                    borderRadius: '0.5rem',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Registered Events
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '1.125rem' }}>Loading events...</div>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>No events found</p>
                        <p style={{ fontSize: '0.875rem' }}>
                            {user && activeTab === 'created' && 'You haven\'t created any events yet.'}
                            {user && activeTab === 'registered' && 'You haven\'t registered for any events yet.'}
                            {(!user || activeTab === 'upcoming') && 'There are no upcoming events at the moment.'}
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '2rem'
                    }}>
                        {filteredEvents.map((event, index) => {
                            const isFull = event.attendeesCount >= event.capacity;
                            const isUpcoming = new Date(event.dateTime) >= new Date();
                            const isOwner = user && event.createdBy && String(event.createdBy._id) === String(user._id);
                            const showModifyButton = activeTab === 'created' && isOwner;

                            return (
                                <div
                                    key={event._id}
                                >
                                    <div
                                        className="card"
                                        style={{
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            padding: 0,
                                            overflow: 'hidden',
                                            borderRadius: '1.25rem',
                                            background: 'white'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 20px rgba(16, 185, 129, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                        }}
                                        onClick={() => {
                                            navigate(`/events/${event._id}`);
                                        }}
                                    >
                                        {/* Image-first design */}
                                        <div style={{
                                            width: '100%',
                                            height: '240px',
                                            overflow: 'hidden',
                                            backgroundColor: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                                            position: 'relative'
                                        }}>
                                            {event.imageUrl ? (
                                                <img
                                                    src={event.imageUrl}
                                                    alt={event.title}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        display: 'block',
                                                        transition: 'transform 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '3rem',
                                                    fontWeight: '800',
                                                    opacity: 0.8
                                                }}>
                                                    {event.title.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: isFull ? 'rgba(220, 38, 38, 0.9)' : (isUpcoming ? 'rgba(16, 185, 129, 0.9)' : 'rgba(107, 114, 128, 0.9)'),
                                                color: 'white',
                                                padding: '0.375rem 0.875rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                backdropFilter: 'blur(10px)'
                                            }}>
                                                {isFull ? 'Full' : (isUpcoming ? 'Upcoming' : 'Past')}
                                            </span>
                                        </div>

                                        <div style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            padding: '1.5rem'
                                        }}>
                                            <h3 style={{
                                                fontSize: '1.375rem',
                                                fontWeight: '700',
                                                margin: '0 0 1rem 0',
                                                lineHeight: '1.3',
                                                color: 'var(--text-main)'
                                            }}>
                                                {event.title}
                                            </h3>

                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.75rem',
                                                marginBottom: '1.25rem',
                                                flex: 1,
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.875rem'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <Calendar size={18} style={{ color: 'var(--primary-color)' }} />
                                                    <span style={{ fontWeight: '500' }}>{formatDate(event.dateTime)}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <MapPin size={18} style={{ color: 'var(--primary-color)' }} />
                                                    <span style={{ fontWeight: '500' }}>{event.location}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <Users size={18} style={{ color: 'var(--primary-color)' }} />
                                                    <span style={{ fontWeight: '500' }}>{event.attendeesCount} / {event.capacity} attendees</span>
                                                </div>
                                            </div>

                                            <p style={{
                                                fontSize: '0.875rem',
                                                color: 'var(--text-main)',
                                                margin: '0 0 1.25rem 0',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                lineHeight: '1.6'
                                            }}>
                                                {event.description}
                                            </p>

                                            {user && event.isRegistered && (
                                                <div style={{
                                                    marginBottom: '1rem',
                                                    padding: '0.75rem',
                                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                                                    borderRadius: '0.75rem',
                                                    fontSize: '0.875rem',
                                                    color: 'var(--primary-color)',
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    border: '2px solid rgba(16, 185, 129, 0.2)'
                                                }}>
                                                    ✓ Registered
                                                </div>
                                            )}

                                            {showModifyButton && (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        fontSize: '0.875rem',
                                                        padding: '0.75rem 1rem'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/modify-event/${event._id}`);
                                                    }}
                                                >
                                                    <Edit size={16} />
                                                    Modify Event
                                                </button>
                                            )}

                                            {!showModifyButton && (
                                                <div style={{
                                                    padding: '0.75rem',
                                                    background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                                                    borderRadius: '0.75rem',
                                                    color: 'white',
                                                    fontWeight: '700',
                                                    textAlign: 'center',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: 'var(--shadow-md)'
                                                }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.02)';
                                                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/events/${event._id}`);
                                                    }}
                                                >
                                                    {isFull ? 'View Details' : 'Book Now'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventList;

