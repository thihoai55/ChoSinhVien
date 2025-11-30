import { useEffect, useRef, useState } from 'react';

export default function AdminNotificationDropdown({ notifications = [], onClose, onNotificationClick }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        setVisible(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose?.();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const filteredNotifications =
        activeTab === 'all' ? notifications : notifications.filter((n) => !n.read);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_pending_post':
                return 'bi-clock-history';
            case 'post_rejected':
                return 'bi-x-circle';
            case 'post_approved':
                return 'bi-check-circle';
            default:
                return 'bi-bell';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'new_pending_post':
                return '#f59e0b';
            case 'post_rejected':
                return '#ef4444';
            case 'post_approved':
                return '#10b981';
            default:
                return '#2563eb';
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'Vừa xong';
        try {
            const time = new Date(timeString);
            const now = new Date();
            const diff = now - time;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) return 'Vừa xong';
            if (minutes < 60) return `${minutes} phút trước`;
            if (hours < 24) return `${hours} giờ trước`;
            if (days < 7) return `${days} ngày trước`;
            return time.toLocaleDateString('vi-VN');
        } catch {
            return 'Vừa xong';
        }
    };

    const container = {
        position: 'absolute',
        top: '110%',
        right: 0,
        width: 400,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        zIndex: 1000,
        maxHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 0.3s ease',
        border: '1px solid #e5e7eb',
    };

    const header = {
        position: 'sticky',
        top: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
        color: '#fff',
        fontWeight: 700,
        fontSize: 18,
        zIndex: 10,
    };

    const closeBtn = {
        cursor: 'pointer',
        fontSize: 20,
        border: 'none',
        background: 'transparent',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: 4,
        transition: 'all 0.2s',
    };

    const tabBar = {
        display: 'flex',
        borderBottom: '2px solid #e5e7eb',
        background: '#f8fafc',
        position: 'sticky',
        top: 58,
        zIndex: 9,
    };

    const tabBtn = (active) => ({
        flex: 1,
        padding: '12px 16px',
        cursor: 'pointer',
        textAlign: 'center',
        fontWeight: active ? 700 : 500,
        background: active ? '#fff' : 'transparent',
        borderBottom: active ? '3px solid #2563eb' : '3px solid transparent',
        transition: 'all 0.2s ease',
        fontSize: 14,
        color: active ? '#2563eb' : '#6b7280',
    });

    const listContainer = {
        overflowY: 'auto',
        flex: 1,
        padding: '8px',
        maxHeight: 500,
    };

    const item = {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 16px',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: '#fff',
        marginBottom: 4,
        border: '1px solid transparent',
    };

    const itemHover = {
        background: '#eff6ff',
        borderColor: '#dbeafe',
        transform: 'translateX(4px)',
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)',
    };

    const itemUnread = {
        background: '#eff6ff',
        borderLeft: '4px solid #2563eb',
    };

    const iconContainer = {
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    };

    const messageContainer = {
        flex: 1,
        minWidth: 0,
    };

    const messageStyle = (read) => ({
        fontWeight: read ? 500 : 600,
        fontSize: 14,
        color: '#111827',
        lineHeight: 1.5,
        marginBottom: 4,
    });

    const timeStyle = {
        fontSize: 12,
        color: '#6b7280',
    };

    const emptyState = {
        padding: 40,
        textAlign: 'center',
        color: '#9ca3af',
    };

    return (
        <div ref={ref} style={container}>
            <div style={header}>
                <span>
                    <i className="bi bi-bell-fill" style={{ marginRight: 8 }} />
                    Thông báo
                </span>
                <button
                    style={closeBtn}
                    onClick={onClose}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <i className="bi bi-x-lg" />
                </button>
            </div>

            <div style={tabBar}>
                <div
                    style={tabBtn(activeTab === 'all')}
                    onClick={() => setActiveTab('all')}
                    onMouseEnter={(e) => {
                        if (activeTab !== 'all') {
                            e.currentTarget.style.background = '#f1f5f9';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeTab !== 'all') {
                            e.currentTarget.style.background = 'transparent';
                        }
                    }}
                >
                    Tất cả
                </div>
                <div
                    style={tabBtn(activeTab === 'unread')}
                    onClick={() => setActiveTab('unread')}
                    onMouseEnter={(e) => {
                        if (activeTab !== 'unread') {
                            e.currentTarget.style.background = '#f1f5f9';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeTab !== 'unread') {
                            e.currentTarget.style.background = 'transparent';
                        }
                    }}
                >
                    Chưa đọc
                </div>
            </div>

            <div style={listContainer}>
                {filteredNotifications.length === 0 ? (
                    <div style={emptyState}>
                        <i className="bi bi-inbox" style={{ fontSize: 48, marginBottom: 12, display: 'block' }} />
                        <p>Không có thông báo</p>
                    </div>
                ) : (
                    filteredNotifications.map((n) => {
                        const iconColor = getNotificationColor(n.type);
                        const isUnread = !n.read;
                        return (
                            <div
                                key={n.id}
                                style={isUnread ? { ...item, ...itemUnread } : item}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, itemHover)}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = isUnread ? '#eff6ff' : '#fff';
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                onClick={() => {
                                    onNotificationClick?.(n);
                                }}
                            >
                                <div
                                    style={{
                                        ...iconContainer,
                                        background: `${iconColor}15`,
                                        color: iconColor,
                                    }}
                                >
                                    <i className={`bi ${getNotificationIcon(n.type)}`} style={{ fontSize: 18 }} />
                                </div>
                                <div style={messageContainer}>
                                    <div style={messageStyle(n.read)}>{n.message}</div>
                                    <div style={timeStyle}>{formatTime(n.time)}</div>
                                </div>
                                {isUnread && (
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: '#2563eb',
                                            flexShrink: 0,
                                            marginTop: 6,
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

