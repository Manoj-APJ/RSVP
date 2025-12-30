import { useState } from 'react';
import axios from 'axios';
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

            await axios.post('http://localhost:5000/api/events', formData, config);
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
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Create New Event</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Event Title</label>
                        <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Description</label>
                        <textarea className="input-field" rows="4" value={description} onChange={e => setDescription(e.target.value)} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label className="input-label">Date & Time</label>
                            <input type="datetime-local" className="input-field" value={dateTime} onChange={e => setDateTime(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Capacity</label>
                            <input type="number" className="input-field" min="1" value={capacity} onChange={e => setCapacity(e.target.value)} required />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Location</label>
                        <input type="text" className="input-field" value={location} onChange={e => setLocation(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Event Image</label>
                        <input type="file" className="input-field" onChange={handleFileChange} accept="image/*" />
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
