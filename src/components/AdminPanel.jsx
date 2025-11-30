import { useState, useMemo, useEffect } from 'react';
import { usePosts } from '../contexts/PostContext';
import AdminPendingPosts from './admin/AdminPendingPosts';
import AdminApprovedPosts from './admin/AdminApprovedPosts';
import AdminRejectedPosts from './admin/AdminRejectedPosts';
import AdminUsers from './admin/AdminUsers';
import AdminStats from './admin/AdminStats';
import AdminPostDetail from './admin/AdminPostDetail';

export default function AdminPanel() {
    const { posts } = usePosts();
    const [activeTab, setActiveTab] = useState('pending-posts');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [prevTab, setPrevTab] = useState('pending-posts');

    // Lắng nghe event từ AdminLayout khi click vào thông báo
    useEffect(() => {
        const handleViewPost = (e) => {
            const { postId } = e.detail;
            if (postId) {
                const post = posts.find(p => String(p.id) === String(postId));
                if (post) {
                    // Xác định tab dựa trên status của bài đăng
                    if (post.status === 'pending') {
                        setActiveTab('pending-posts');
                        setPrevTab('pending-posts');
                    } else if (post.status === 'rejected') {
                        setActiveTab('rejected-posts');
                        setPrevTab('rejected-posts');
                    } else {
                        setActiveTab('approved-posts');
                        setPrevTab('approved-posts');
                    }
                    setSelectedPostId(postId);
                }
            }
        };

        const handleViewUser = (e) => {
            const { userId } = e.detail;
            if (userId) {
                setActiveTab('users');
            }
        };

        window.addEventListener('admin-view-post', handleViewPost);
        window.addEventListener('admin-view-user', handleViewUser);

        return () => {
            window.removeEventListener('admin-view-post', handleViewPost);
            window.removeEventListener('admin-view-user', handleViewUser);
        };
    }, [posts]);

    // Lọc bài đăng để hiển thị số lượng trong sidebar
    const pendingPosts = useMemo(() => {
        return posts.filter(p => p.status === 'pending' && !p.hidden);
    }, [posts]);

    const approvedPosts = useMemo(() => {
        return posts.filter(p => p.status === 'approved' || (!p.status && p.status !== 'pending' && p.status !== 'rejected'));
    }, [posts]);

    const rejectedPosts = useMemo(() => {
        return posts.filter(p => p.status === 'rejected');
    }, [posts]);

    const handleViewDetail = (postId) => {
        setPrevTab(activeTab);
        setSelectedPostId(postId);
        setActiveTab('post-detail');
    };

    const handleBack = () => {
        setSelectedPostId(null);
        setActiveTab(prevTab);
    };

    // Nếu đang xem chi tiết bài đăng
    if (activeTab === 'post-detail' && selectedPostId) {
        return <AdminPostDetail postId={selectedPostId} onBack={handleBack} />;
    }

    // Styles - cải thiện thiết kế
    const container = {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #ffffff 100%)',
        padding: '24px 20px',
    };

    const contentWrapper = {
        maxWidth: 1400,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: 24,
    };

    const sidebar = {
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: 16,
        padding: '24px 20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        height: 'fit-content',
        position: 'sticky',
        top: 20,
        border: '1px solid #e0e7ff',
    };

    const sidebarTitle = {
        fontSize: 22,
        fontWeight: 700,
        color: '#1e3a8a',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 20,
        borderBottom: '2px solid #e0e7ff',
    };

    const tabButton = (isActive) => ({
        width: '100%',
        padding: '14px 18px',
        borderRadius: 12,
        border: 'none',
        background: isActive 
            ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
            : 'transparent',
        color: isActive ? '#fff' : '#475569',
        fontSize: 15,
        fontWeight: isActive ? 700 : 600,
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
        transition: 'all 0.3s ease',
        boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
        transform: isActive ? 'translateX(4px)' : 'none',
    });

    const mainContent = {
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        border: '1px solid #e0e7ff',
        minHeight: '600px',
    };

    return (
        <div style={container}>
            <div style={contentWrapper}>
                {/* Sidebar */}
                <div style={sidebar}>
                    <div style={sidebarTitle}>
                        <i className="bi bi-shield-check" style={{ fontSize: 28, color: '#2563eb' }} />
                        <span>Admin Panel</span>
                    </div>
                    <button
                        style={tabButton(activeTab === 'pending-posts')}
                        onClick={() => {
                            setActiveTab('pending-posts');
                            setPrevTab('pending-posts');
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'pending-posts') {
                                e.currentTarget.style.background = '#f1f5f9';
                                e.currentTarget.style.color = '#1e40af';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'pending-posts') {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#475569';
                            }
                        }}
                    >
                        <i className="bi bi-clock-history" style={{ fontSize: 18 }} />
                        <span>Chờ duyệt</span>
                        <span style={{ 
                            marginLeft: 'auto', 
                            background: activeTab === 'pending-posts' ? 'rgba(255,255,255,0.3)' : '#e2e8f0',
                            color: activeTab === 'pending-posts' ? '#fff' : '#475569',
                            padding: '4px 10px',
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 700,
                        }}>
                            {pendingPosts.length}
                        </span>
                    </button>
                    <button
                        style={tabButton(activeTab === 'approved-posts')}
                        onClick={() => {
                            setActiveTab('approved-posts');
                            setPrevTab('approved-posts');
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'approved-posts') {
                                e.currentTarget.style.background = '#f1f5f9';
                                e.currentTarget.style.color = '#1e40af';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'approved-posts') {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#475569';
                            }
                        }}
                    >
                        <i className="bi bi-check-circle" style={{ fontSize: 18 }} />
                        <span>Đã duyệt</span>
                        <span style={{ 
                            marginLeft: 'auto', 
                            background: activeTab === 'approved-posts' ? 'rgba(255,255,255,0.3)' : '#e2e8f0',
                            color: activeTab === 'approved-posts' ? '#fff' : '#475569',
                            padding: '4px 10px',
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 700,
                        }}>
                            {approvedPosts.length}
                        </span>
                    </button>
                    <button
                        style={tabButton(activeTab === 'rejected-posts')}
                        onClick={() => {
                            setActiveTab('rejected-posts');
                            setPrevTab('rejected-posts');
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'rejected-posts') {
                                e.currentTarget.style.background = '#f1f5f9';
                                e.currentTarget.style.color = '#1e40af';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'rejected-posts') {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#475569';
                            }
                        }}
                    >
                        <i className="bi bi-x-circle" style={{ fontSize: 18 }} />
                        <span>Đã từ chối</span>
                        <span style={{ 
                            marginLeft: 'auto', 
                            background: activeTab === 'rejected-posts' ? 'rgba(255,255,255,0.3)' : '#e2e8f0',
                            color: activeTab === 'rejected-posts' ? '#fff' : '#475569',
                            padding: '4px 10px',
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 700,
                        }}>
                            {rejectedPosts.length}
                        </span>
                    </button>
                    <div style={{ 
                        height: 1, 
                        background: 'linear-gradient(90deg, transparent, #e0e7ff, transparent)',
                        margin: '16px 0',
                    }} />
                    <button
                        style={tabButton(activeTab === 'users')}
                        onClick={() => {
                            setActiveTab('users');
                            setPrevTab('users');
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'users') {
                                e.currentTarget.style.background = '#f1f5f9';
                                e.currentTarget.style.color = '#1e40af';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'users') {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#475569';
                            }
                        }}
                    >
                        <i className="bi bi-people" style={{ fontSize: 18 }} />
                        <span>Quản lý người dùng</span>
                    </button>
                    <button
                        style={tabButton(activeTab === 'stats')}
                        onClick={() => {
                            setActiveTab('stats');
                            setPrevTab('stats');
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'stats') {
                                e.currentTarget.style.background = '#f1f5f9';
                                e.currentTarget.style.color = '#1e40af';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'stats') {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#475569';
                            }
                        }}
                    >
                        <i className="bi bi-graph-up" style={{ fontSize: 18 }} />
                        <span>Thống kê</span>
                    </button>
                </div>

                {/* Main Content */}
                <div style={mainContent}>
                    {activeTab === 'pending-posts' && (
                        <AdminPendingPosts onViewDetail={handleViewDetail} />
                    )}
                    {activeTab === 'approved-posts' && (
                        <AdminApprovedPosts onViewDetail={handleViewDetail} />
                    )}
                    {activeTab === 'rejected-posts' && (
                        <AdminRejectedPosts onViewDetail={handleViewDetail} />
                    )}
                    {activeTab === 'users' && <AdminUsers />}
                    {activeTab === 'stats' && <AdminStats />}
                </div>
            </div>
        </div>
    );
}
