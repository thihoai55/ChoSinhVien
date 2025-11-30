import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import AdminPanel from './AdminPanel';
import AdminNotificationDropdown from './admin/AdminNotificationDropdown';

export default function AdminLayout({ onNavigate }) {
    const { user, logout } = useAuth();
    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    const [hovered, setHovered] = useState(null);
    const [showNotify, setShowNotify] = useState(false);

    // Kiểm tra quyền admin
    if (!user || user.role !== 'admin') {
        return (
            <div style={{ 
                textAlign: 'center', 
                padding: 40, 
                background: '#f8fafc', 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <i className="bi bi-shield-x" style={{ fontSize: 64, color: '#ef4444', marginBottom: 16 }} />
                <h3 style={{ marginBottom: 16, color: '#ef4444' }}>Bạn không có quyền truy cập trang này</h3>
                <p style={{ color: '#6b7280', marginBottom: 24 }}>Chỉ quản trị viên mới có thể truy cập trang quản trị</p>
                <button
                    onClick={() => onNavigate?.('home')}
                    style={{
                        padding: '12px 24px',
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 16,
                        fontWeight: 600,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    <i className="bi bi-house" style={{ marginRight: 8 }} />
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    // Styles cho Admin Header - màu đậm và đẹp hơn
    const adminHeader = {
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        color: '#fff',
        padding: '12px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '2px solid rgba(255,255,255,0.1)',
    };

    const headerContainer = {
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    const headerLeft = {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
    };

    const headerTitle = {
        fontSize: 22,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        letterSpacing: '0.5px',
    };

    const headerRight = {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    };

    const headerButton = {
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        background: 'rgba(255,255,255,0.2)',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.2s',
        backdropFilter: 'blur(10px)',
    };

    const headerButtonHover = {
        background: 'rgba(255,255,255,0.3)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    };

    const notifyButton = {
        position: 'relative',
        padding: '8px 12px',
        borderRadius: 8,
        border: 'none',
        background: 'rgba(255,255,255,0.2)',
        color: '#fff',
        fontSize: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        backdropFilter: 'blur(10px)',
    };

    const notifyBadge = {
        position: 'absolute',
        top: -4,
        right: -4,
        background: '#ef4444',
        color: '#fff',
        fontSize: 11,
        fontWeight: 700,
        borderRadius: 10,
        padding: '2px 6px',
        border: '2px solid #1e40af',
        minWidth: 20,
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    };

    const userInfo = {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    };

    const userAvatar = {
        width: 38,
        height: 38,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid rgba(255,255,255,0.4)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    };

    const userName = {
        fontSize: 14,
        fontWeight: 600,
    };

    // Styles cho Admin Footer - màu đậm và đẹp hơn
    const adminFooter = {
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        color: '#fff',
        padding: '16px 20px',
        textAlign: 'center',
        marginTop: 'auto',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.15)',
        borderTop: '2px solid rgba(255,255,255,0.1)',
    };

    const footerText = {
        fontSize: 13,
        margin: 0,
        opacity: 0.9,
        fontWeight: 500,
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            background: '#f8fafc'
        }}>
            {/* Admin Header */}
            <header style={adminHeader}>
                <div style={headerContainer}>
                    <div style={headerLeft}>
                        <div style={headerTitle}>
                            <i className="bi bi-shield-check" style={{ fontSize: 24 }} />
                            <span>Trang Quản Trị</span>
                        </div>
                    </div>
                    <div style={headerRight}>
                        <div style={userInfo}>
                            <img 
                                src={user.avatar || 'https://i.pravatar.cc/150?img=1'} 
                                alt={user.name} 
                                style={userAvatar}
                            />
                            <span style={userName}>{user.name}</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <button
                                style={hovered === 'notify' ? { ...notifyButton, ...headerButtonHover } : notifyButton}
                                onClick={() => {
                                    if (!showNotify) {
                                        markAllAsRead?.();
                                    }
                                    setShowNotify(!showNotify);
                                }}
                                onMouseEnter={() => setHovered('notify')}
                                onMouseLeave={() => setHovered(null)}
                                title="Thông báo"
                            >
                                <i className="bi bi-bell" />
                                {unreadCount > 0 && (
                                    <span style={notifyBadge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
                                )}
                            </button>
                            {showNotify && (
                                <AdminNotificationDropdown
                                    notifications={notifications}
                                    onClose={() => setShowNotify(false)}
                                    onNotificationClick={(n) => {
                                        setShowNotify(false);
                                        // Xử lý click thông báo - điều hướng đến bài đăng trong admin panel
                                        if (n.postId) {
                                            // Gửi event để AdminPanel xử lý
                                            window.dispatchEvent(new CustomEvent('admin-view-post', { detail: { postId: n.postId } }));
                                        } else if (n.fromUserId) {
                                            // Có thể điều hướng đến user profile trong admin
                                            window.dispatchEvent(new CustomEvent('admin-view-user', { detail: { userId: n.fromUserId } }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                        <button
                            style={hovered === 'logout' ? { ...headerButton, ...headerButtonHover } : headerButton}
                            onClick={() => {
                                logout();
                                onNavigate?.('home');
                            }}
                            onMouseEnter={() => setHovered('logout')}
                            onMouseLeave={() => setHovered(null)}
                            title="Đăng xuất"
                        >
                            <i className="bi bi-box-arrow-right" />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Admin Panel Content */}
            <main style={{ flex: 1 }}>
                <AdminPanel onNavigate={onNavigate} />
            </main>

            {/* Admin Footer */}
            <footer style={adminFooter}>
                <p style={footerText}>
                    <i className="bi bi-shield-check" style={{ marginRight: 8 }} />
                    Hệ thống quản trị Sàn Trao Đổi SV © 2024
                </p>
            </footer>
        </div>
    );
}

