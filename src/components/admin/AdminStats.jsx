import { useMemo, useState } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { mockUsers } from '../../data/userData';

export default function AdminStats() {
    const { posts } = usePosts();
    
    const [bannedUsers] = useState(() => {
        try {
            const stored = localStorage.getItem('sv_banned_users');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const stats = useMemo(() => {
        const pendingPosts = posts.filter(p => p.status === 'pending' && !p.hidden);
        const approvedPosts = posts.filter(p => p.status === 'approved' || (!p.status && p.status !== 'pending' && p.status !== 'rejected'));
        const rejectedPosts = posts.filter(p => p.status === 'rejected');
        
        const totalUsers = mockUsers.length;
        const totalPosts = posts.length;
        const totalPending = pendingPosts.length;
        const totalApproved = approvedPosts.length;
        const totalRejected = rejectedPosts.length;
        const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
        const totalComments = posts.reduce((sum, p) => sum + (p.comments || 0), 0);
        const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
        const activeUsers = mockUsers.filter(u => !bannedUsers.includes(u.id)).length;

        return {
            totalUsers,
            activeUsers,
            totalPosts,
            totalPending,
            totalApproved,
            totalRejected,
            totalLikes,
            totalComments,
            totalViews,
        };
    }, [posts, bannedUsers]);

    const pageTitle = {
        fontSize: 24,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    };

    const statsGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24,
    };

    const statCard = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 12,
        padding: 20,
        color: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,.1)',
    };

    const statCardBlue = {
        ...statCard,
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    };

    const statCardGreen = {
        ...statCard,
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    };

    const statCardYellow = {
        ...statCard,
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    };

    const statCardRed = {
        ...statCard,
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    };

    const statValue = {
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 8,
    };

    const statLabel = {
        fontSize: 14,
        opacity: 0.9,
    };

    return (
        <>
            <div style={pageTitle}>
                <i className="bi bi-graph-up" style={{ fontSize: 28, color: '#2563eb' }} />
                <span>Thống kê hệ thống</span>
            </div>
            <div style={statsGrid}>
                <div style={statCardBlue}>
                    <div style={statValue}>{stats.totalUsers}</div>
                    <div style={statLabel}>
                        <i className="bi bi-people" style={{ marginRight: 6 }} />
                        Tổng người dùng
                    </div>
                </div>
                <div style={statCardGreen}>
                    <div style={statValue}>{stats.activeUsers}</div>
                    <div style={statLabel}>
                        <i className="bi bi-person-check" style={{ marginRight: 6 }} />
                        Người dùng hoạt động
                    </div>
                </div>
                <div style={statCard}>
                    <div style={statValue}>{stats.totalPosts}</div>
                    <div style={statLabel}>
                        <i className="bi bi-file-post" style={{ marginRight: 6 }} />
                        Tổng bài đăng
                    </div>
                </div>
                <div style={statCardYellow}>
                    <div style={statValue}>{stats.totalPending}</div>
                    <div style={statLabel}>
                        <i className="bi bi-clock-history" style={{ marginRight: 6 }} />
                        Chờ duyệt
                    </div>
                </div>
                <div style={statCardGreen}>
                    <div style={statValue}>{stats.totalApproved}</div>
                    <div style={statLabel}>
                        <i className="bi bi-check-circle" style={{ marginRight: 6 }} />
                        Đã duyệt
                    </div>
                </div>
                <div style={statCardRed}>
                    <div style={statValue}>{stats.totalRejected}</div>
                    <div style={statLabel}>
                        <i className="bi bi-x-circle" style={{ marginRight: 6 }} />
                        Đã từ chối
                    </div>
                </div>
                <div style={statCardBlue}>
                    <div style={statValue}>{stats.totalLikes}</div>
                    <div style={statLabel}>
                        <i className="bi bi-heart" style={{ marginRight: 6 }} />
                        Tổng lượt thích
                    </div>
                </div>
                <div style={statCard}>
                    <div style={statValue}>{stats.totalComments}</div>
                    <div style={statLabel}>
                        <i className="bi bi-chat" style={{ marginRight: 6 }} />
                        Tổng bình luận
                    </div>
                </div>
                <div style={statCardGreen}>
                    <div style={statValue}>{stats.totalViews}</div>
                    <div style={statLabel}>
                        <i className="bi bi-eye" style={{ marginRight: 6 }} />
                        Tổng lượt xem
                    </div>
                </div>
            </div>
        </>
    );
}

