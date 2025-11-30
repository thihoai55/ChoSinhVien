import { useMemo, useState } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { mockUsers } from '../../data/userData';

export default function AdminUserDetail({ userId, onBack, onEdit, onDelete, onToggleBan }) {
    const { posts } = usePosts();
    const user = mockUsers.find(u => String(u.id) === String(userId));

    const [bannedUsers] = useState(() => {
        try {
            const stored = localStorage.getItem('sv_banned_users');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const isBanned = bannedUsers.includes(userId);

    // Lấy tất cả bài đăng của user
    const userPosts = useMemo(() => {
        return posts.filter(p => String(p.authorId) === String(userId));
    }, [posts, userId]);

    const pendingPosts = userPosts.filter(p => p.status === 'pending');
    const approvedPosts = userPosts.filter(p => p.status === 'approved' || (!p.status && p.status !== 'pending' && p.status !== 'rejected'));
    const rejectedPosts = userPosts.filter(p => p.status === 'rejected');

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <h3 style={{ color: '#ef4444', marginBottom: 16 }}>Không tìm thấy người dùng</h3>
                <button onClick={onBack} style={buttonBack}>
                    <i className="bi bi-arrow-left" style={{ marginRight: 8 }} />
                    Quay lại
                </button>
            </div>
        );
    }

    const container = {
        maxWidth: 1000,
        margin: '0 auto',
        padding: '24px',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,.08)',
    };

    const header = {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 32,
        paddingBottom: 24,
        borderBottom: '2px solid #e5e7eb',
    };

    const profileSection = {
        display: 'flex',
        alignItems: 'center',
        gap: 20,
    };

    const avatar = {
        width: 120,
        height: 120,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '4px solid #e5e7eb',
    };

    const profileInfo = {
        flex: 1,
    };

    const name = {
        fontSize: 28,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    };

    const email = {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 4,
    };

    const statusBadge = {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        marginLeft: 8,
    };

    const statusBanned = {
        ...statusBadge,
        background: '#fee2e2',
        color: '#dc2626',
    };

    const statusActive = {
        ...statusBadge,
        background: '#d1fae5',
        color: '#059669',
    };

    const actions = {
        display: 'flex',
        gap: 12,
        flexDirection: 'column',
    };

    const buttonPrimary = {
        padding: '10px 20px',
        borderRadius: 8,
        border: 'none',
        background: '#2563eb',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    };

    const buttonDanger = {
        padding: '10px 20px',
        borderRadius: 8,
        border: 'none',
        background: '#ef4444',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    };

    const buttonSuccess = {
        padding: '10px 20px',
        borderRadius: 8,
        border: 'none',
        background: '#10b981',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    };

    const buttonBack = {
        padding: '10px 20px',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#fff',
        color: '#6b7280',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    };

    const section = {
        marginBottom: 32,
        padding: 20,
        background: '#f9fafb',
        borderRadius: 8,
    };

    const sectionTitle = {
        fontSize: 20,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    };

    const infoGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16,
    };

    const infoItem = {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    };

    const infoLabel = {
        fontSize: 12,
        fontWeight: 600,
        color: '#6b7280',
        textTransform: 'uppercase',
    };

    const infoValue = {
        fontSize: 16,
        color: '#111827',
        fontWeight: 500,
    };

    const statsGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 16,
        marginTop: 16,
    };

    const statCard = {
        background: '#fff',
        padding: 16,
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        textAlign: 'center',
    };

    const statValue = {
        fontSize: 24,
        fontWeight: 700,
        color: '#2563eb',
        marginBottom: 4,
    };

    const statLabel = {
        fontSize: 12,
        color: '#6b7280',
    };

    const postsList = {
        display: 'grid',
        gap: 12,
        marginTop: 16,
    };

    const postCard = {
        padding: 16,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
    };

    const postTitle = {
        fontSize: 16,
        fontWeight: 600,
        color: '#111827',
        marginBottom: 8,
    };

    const postMeta = {
        display: 'flex',
        gap: 16,
        fontSize: 14,
        color: '#6b7280',
    };

    const handleDelete = () => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${user.name}? Hành động này không thể hoàn tác!`)) {
            onDelete?.(userId);
        }
    };

    return (
        <div style={{ padding: '20px 16px', background: 'linear-gradient(180deg, #eff6ff, #ffffff)', minHeight: '100vh' }}>
            <div style={container}>
                <div style={header}>
                    <div style={profileSection}>
                        <img src={user.avatar} alt={user.name} style={avatar} />
                        <div style={profileInfo}>
                            <div style={name}>
                                {user.name}
                                {isBanned ? (
                                    <span style={statusBanned}>Đã khóa</span>
                                ) : (
                                    <span style={statusActive}>Hoạt động</span>
                                )}
                            </div>
                            <div style={email}>
                                <i className="bi bi-envelope" style={{ marginRight: 8 }} />
                                {user.email}
                            </div>
                            {user.phone && (
                                <div style={{ fontSize: 14, color: '#6b7280' }}>
                                    <i className="bi bi-telephone" style={{ marginRight: 8 }} />
                                    {user.phone}
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={actions}>
                        <button style={buttonPrimary} onClick={() => onEdit?.(userId)}>
                            <i className="bi bi-pencil" />
                            Sửa thông tin
                        </button>
                        <button
                            style={isBanned ? buttonSuccess : buttonDanger}
                            onClick={() => onToggleBan?.(userId)}
                        >
                            <i className={isBanned ? 'bi bi-unlock' : 'bi bi-lock'} />
                            {isBanned ? 'Mở khóa' : 'Khóa tài khoản'}
                        </button>
                        <button style={buttonDanger} onClick={handleDelete}>
                            <i className="bi bi-trash" />
                            Xóa tài khoản
                        </button>
                        <button style={buttonBack} onClick={onBack}>
                            <i className="bi bi-arrow-left" />
                            Quay lại
                        </button>
                    </div>
                </div>

                {/* Thông tin cá nhân */}
                <div style={section}>
                    <h3 style={sectionTitle}>
                        <i className="bi bi-person" />
                        Thông tin cá nhân
                    </h3>
                    <div style={infoGrid}>
                        <div style={infoItem}>
                            <span style={infoLabel}>Tên</span>
                            <span style={infoValue}>{user.name}</span>
                        </div>
                        <div style={infoItem}>
                            <span style={infoLabel}>Email</span>
                            <span style={infoValue}>{user.email}</span>
                        </div>
                        <div style={infoItem}>
                            <span style={infoLabel}>Số điện thoại</span>
                            <span style={infoValue}>{user.phone || 'Chưa cập nhật'}</span>
                        </div>
                        <div style={infoItem}>
                            <span style={infoLabel}>Địa điểm</span>
                            <span style={infoValue}>{user.location || 'Chưa cập nhật'}</span>
                        </div>
                        <div style={infoItem}>
                            <span style={infoLabel}>Ngày tham gia</span>
                            <span style={infoValue}>{user.joinedDate || 'N/A'}</span>
                        </div>
                        <div style={infoItem}>
                            <span style={infoLabel}>Giới thiệu</span>
                            <span style={infoValue}>{user.bio || 'Chưa cập nhật'}</span>
                        </div>
                        <div style={infoItem}>
                            <span style={infoLabel}>Xác thực</span>
                            <span style={infoValue}>
                                {user.verified ? (
                                    <span style={{ color: '#10b981' }}>
                                        <i className="bi bi-check-circle" style={{ marginRight: 4 }} />
                                        Đã xác thực
                                    </span>
                                ) : (
                                    <span style={{ color: '#6b7280' }}>Chưa xác thực</span>
                                )}
                            </span>
                        </div>
                        <div style={infoItem}>
                            <span style={infoLabel}>Đánh giá</span>
                            <span style={infoValue}>
                                {user.rating ? `${user.rating}/5.0 (${user.totalReviews || 0} đánh giá)` : 'Chưa có đánh giá'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Thống kê */}
                <div style={section}>
                    <h3 style={sectionTitle}>
                        <i className="bi bi-graph-up" />
                        Thống kê
                    </h3>
                    <div style={statsGrid}>
                        <div style={statCard}>
                            <div style={statValue}>{user.followers || 0}</div>
                            <div style={statLabel}>Người theo dõi</div>
                        </div>
                        <div style={statCard}>
                            <div style={statValue}>{user.following || 0}</div>
                            <div style={statLabel}>Đang theo dõi</div>
                        </div>
                        <div style={statCard}>
                            <div style={statValue}>{userPosts.length}</div>
                            <div style={statLabel}>Tổng bài đăng</div>
                        </div>
                        <div style={statCard}>
                            <div style={{ ...statValue, color: '#f59e0b' }}>{pendingPosts.length}</div>
                            <div style={statLabel}>Chờ duyệt</div>
                        </div>
                        <div style={statCard}>
                            <div style={{ ...statValue, color: '#10b981' }}>{approvedPosts.length}</div>
                            <div style={statLabel}>Đã duyệt</div>
                        </div>
                        <div style={statCard}>
                            <div style={{ ...statValue, color: '#ef4444' }}>{rejectedPosts.length}</div>
                            <div style={statLabel}>Đã từ chối</div>
                        </div>
                    </div>
                </div>

                {/* Bài đăng của user */}
                <div style={section}>
                    <h3 style={sectionTitle}>
                        <i className="bi bi-file-post" />
                        Bài đăng của người dùng ({userPosts.length})
                    </h3>
                    {userPosts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
                            <i className="bi bi-inbox" style={{ fontSize: 48, marginBottom: 12 }} />
                            <p>Người dùng này chưa có bài đăng nào</p>
                        </div>
                    ) : (
                        <div style={postsList}>
                            {userPosts.slice(0, 10).map(post => (
                                <div key={post.id} style={postCard}>
                                    <div style={postTitle}>{post.title}</div>
                                    <div style={postMeta}>
                                        <span>
                                            <i className="bi bi-tag" style={{ marginRight: 4 }} />
                                            {post.category}
                                        </span>
                                        {post.price && (
                                            <span>
                                                <i className="bi bi-cash-coin" style={{ marginRight: 4 }} />
                                                {post.price}
                                            </span>
                                        )}
                                        <span>
                                            {post.status === 'pending' && (
                                                <span style={{ color: '#f59e0b' }}>
                                                    <i className="bi bi-clock-history" style={{ marginRight: 4 }} />
                                                    Chờ duyệt
                                                </span>
                                            )}
                                            {post.status === 'approved' && (
                                                <span style={{ color: '#10b981' }}>
                                                    <i className="bi bi-check-circle" style={{ marginRight: 4 }} />
                                                    Đã duyệt
                                                </span>
                                            )}
                                            {post.status === 'rejected' && (
                                                <span style={{ color: '#ef4444' }}>
                                                    <i className="bi bi-x-circle" style={{ marginRight: 4 }} />
                                                    Đã từ chối
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {userPosts.length > 10 && (
                                <div style={{ textAlign: 'center', padding: 16, color: '#6b7280' }}>
                                    Và {userPosts.length - 10} bài đăng khác...
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

