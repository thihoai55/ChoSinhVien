import { useEffect, useRef, useState } from 'react';
import { useFollow } from '../contexts/FollowContext';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { mockUsers } from '../data/userData';

export default function FollowListModal({ userId, type, onClose, onNavigate }) {
    const { getFollowers, getFollowing, isFollowing, toggleFollow } = useFollow();
    const { user } = useAuth();
    const { openChatWith } = useChat?.() || {};
    
    // Kiểm tra xem user hiện tại có phải là chủ profile không
    const isOwnProfile = user && String(user.id) === String(userId);
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [activeTab, setActiveTab] = useState(type || 'followers');

    useEffect(() => {
        setVisible(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose?.();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const list = activeTab === 'followers' ? getFollowers(userId) : getFollowing(userId);
    const followersCount = getFollowers(userId).length;
    const followingCount = getFollowing(userId).length;

    const container = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
    };

    const modal = {
        background: '#fff',
        borderRadius: 16,
        width: '90%',
        maxWidth: 500,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        transform: visible ? 'scale(1)' : 'scale(0.95)',
        transition: 'transform 0.3s ease',
    };

    const header = {
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: '#fff',
        color: '#111827',
    };

    const headerTop = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    const headerTitle = {
        margin: 0,
        fontSize: 18,
        fontWeight: 600,
        color: '#111827',
    };

    const tabContainer = {
        display: 'flex',
        gap: 8,
        width: '100%',
    };

    const tabButton = (isActive) => ({
        flex: 1,
        padding: '8px 12px',
        borderRadius: 8,
        border: 'none',
        background: isActive ? '#eff6ff' : 'transparent',
        color: isActive ? '#2563eb' : '#6b7280',
        fontSize: 14,
        fontWeight: isActive ? 600 : 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    });

    const closeBtn = {
        background: 'transparent',
        border: 'none',
        color: '#6b7280',
        fontSize: 24,
        cursor: 'pointer',
        padding: 0,
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        transition: 'background 0.2s ease',
    };

    const listContainer = {
        flex: 1,
        overflowY: 'auto',
        padding: '8px 0',
    };

    const userItem = {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        gap: 12,
        cursor: 'pointer',
        transition: 'background 0.2s ease',
    };

    const userItemHover = {
        background: '#f3f4f6',
    };

    const avatar = {
        width: 48,
        height: 48,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #e5e7eb',
    };

    const userInfo = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    };

    const userName = {
        fontWeight: 600,
        fontSize: 15,
        color: '#111827',
    };

    const userBio = {
        fontSize: 13,
        color: '#6b7280',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    };

    const followButton = (isFollowingUser) => ({
        padding: '8px 20px',
        borderRadius: 8,
        border: 'none',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: isFollowingUser ? '#f3f4f6' : '#2563eb',
        color: isFollowingUser ? '#111827' : '#fff',
        boxShadow: isFollowingUser ? 'none' : '0 2px 4px rgba(37, 99, 235, 0.2)',
    });

    const messageButton = {
        padding: '8px 20px',
        borderRadius: 8,
        border: 'none',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: '#2563eb',
        color: '#fff',
        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
    };

    const emptyState = {
        padding: '48px 24px',
        textAlign: 'center',
        color: '#6b7280',
    };

    const handleUserClick = (targetUserId) => {
        onClose?.();
        onNavigate?.('user-profile', targetUserId);
    };

    const handleFollowClick = (e, targetUserId) => {
        e.stopPropagation();
        if (!user) {
            alert('Vui lòng đăng nhập để theo dõi');
            return;
        }
        toggleFollow(user.id, targetUserId);
    };

    const handleMessageClick = (e, targetUserId) => {
        e.stopPropagation();
        if (!user) {
            alert('Vui lòng đăng nhập để nhắn tin');
            return;
        }
        if (openChatWith) {
            openChatWith(targetUserId);
            onClose?.();
        }
    };

    // Kiểm tra mutual follow (follow lẫn nhau)
    const isMutualFollow = (targetUserId) => {
        if (!user) return false;
        return isFollowing(user.id, targetUserId) && isFollowing(targetUserId, user.id);
    };

    return (
        <div style={container} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
            <div ref={ref} style={modal}>
                <div style={header}>
                    <div style={headerTop}>
                        <h2 style={headerTitle}>Người theo dõi & Đang theo dõi</h2>
                        <button
                            style={closeBtn}
                            onClick={onClose}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                            ×
                        </button>
                    </div>
                    <div style={tabContainer}>
                        <button
                            style={tabButton(activeTab === 'followers')}
                            onClick={() => setActiveTab('followers')}
                            onMouseEnter={(e) => {
                                if (activeTab !== 'followers') {
                                    e.currentTarget.style.background = '#f3f4f6';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== 'followers') {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <i className="bi bi-people-fill" style={{ fontSize: 16 }} />
                            Người theo dõi ({followersCount})
                        </button>
                        <button
                            style={tabButton(activeTab === 'following')}
                            onClick={() => setActiveTab('following')}
                            onMouseEnter={(e) => {
                                if (activeTab !== 'following') {
                                    e.currentTarget.style.background = '#f3f4f6';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== 'following') {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <i className="bi bi-person-check-fill" style={{ fontSize: 16 }} />
                            Đang theo dõi ({followingCount})
                        </button>
                    </div>
                </div>
                <div style={listContainer}>
                    {list.length === 0 ? (
                        <div style={emptyState}>
                            <i className="bi bi-people" style={{ fontSize: 48, color: '#d1d5db', marginBottom: 12 }} />
                            <p style={{ margin: 0 }}>Chưa có {activeTab === 'followers' ? 'người theo dõi' : 'người đang theo dõi'}</p>
                        </div>
                    ) : (
                        list.map((userIdInList) => {
                            const userData = mockUsers.find((u) => String(u.id) === String(userIdInList));
                            if (!userData) return null;
                            const isFollowingUser = user && isFollowing(user.id, userIdInList);
                            const isMutual = isMutualFollow(userIdInList);
                            
                            return (
                                <div
                                    key={userIdInList}
                                    style={userItem}
                                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, userItemHover)}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                                    onClick={() => handleUserClick(userIdInList)}
                                >
                                    <img src={userData.avatar} alt={userData.name} style={avatar} />
                                    <div style={userInfo}>
                                        <div style={userName}>{userData.name}</div>
                                        {userData.bio && <div style={userBio}>{userData.bio}</div>}
                                    </div>
                                    {/* Chỉ hiển thị nút nếu là chủ profile hoặc đang đăng nhập */}
                                    {user && user.id !== userIdInList && isOwnProfile && (
                                        <>
                                            {/* Nếu follow lẫn nhau, hiển thị nút nhắn tin */}
                                            {isMutual ? (
                                                <button
                                                    style={messageButton}
                                                    onClick={(e) => handleMessageClick(e, userIdInList)}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.opacity = 0.8;
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.opacity = 1;
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <i className="bi bi-chat-dots" style={{ marginRight: 6 }} />
                                                    Nhắn tin
                                                </button>
                                            ) : (
                                                <button
                                                    style={followButton(isFollowingUser)}
                                                    onClick={(e) => handleFollowClick(e, userIdInList)}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.opacity = 0.8;
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.opacity = 1;
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    {isFollowingUser 
                                                        ? (activeTab === 'followers' ? 'Theo dõi lại' : 'Đang theo dõi')
                                                        : 'Theo dõi'}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

