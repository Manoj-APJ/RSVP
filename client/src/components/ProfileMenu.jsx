import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ChevronDown } from 'lucide-react';

const ProfileMenu = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const hoverTimeoutRef = useRef(null);
    const leaveTimeoutRef = useRef(null);

    const handleMouseEnter = () => {
        // Clear any pending hide timeout
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
        // Add small delay to avoid flickering
        hoverTimeoutRef.current = setTimeout(() => {
            setIsOpen(true);
        }, 150);
    };

    const handleMouseLeave = () => {
        // Clear any pending show timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        // Add small delay before hiding
        leaveTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 100);
    };

    const handleFocus = () => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setIsOpen(true);
        }, 150);
    };

    const handleBlur = (e) => {
        // Only hide if focus is moving outside the menu
        if (menuRef.current && !menuRef.current.contains(e.relatedTarget)) {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
            }
            leaveTimeoutRef.current = setTimeout(() => {
                setIsOpen(false);
            }, 100);
        }
    };

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
            if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
            }
        };
    }, []);

    if (!user) return null;

    return (
        <div
            style={{ position: 'relative' }}
            ref={menuRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s'
                }}
            >
                <div style={{
                    background: '#ecfdf5',
                    padding: '0.25rem',
                    borderRadius: '50%',
                    color: 'var(--primary-color)',
                    display: 'flex'
                }}>
                    <User size={20} />
                </div>
                <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{user.name}</span>
                <ChevronDown size={16} color="var(--text-secondary)" />
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: '120%',
                        width: '250px',
                        background: 'white',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        zIndex: 50,
                        overflow: 'hidden'
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</p>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{user.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            border: 'none',
                            background: 'transparent',
                            color: '#dc2626',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
