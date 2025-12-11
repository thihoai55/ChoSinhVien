import { useMemo, useState } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getUsers } from '../../data/userData';

export default function AdminPendingPosts({ onViewDetail }) {
    const { posts, approvePost, rejectPost } = usePosts();
    const { addNotification } = useNotifications();
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(null);

    const pendingPosts = useMemo(() => {
        return posts.filter(p => p.status === 'pending' && !p.hidden);
    }, [posts]);

    const handleApprove = (postId) => {
        if (window.confirm('Bạn có chắc chắn muốn duyệt bài đăng này?')) {
            // ✅ Truyền addNotification callback vào approvePost
            // approvePost sẽ tự động gửi notification đến PREMIUM post buyers
            approvePost(postId, addNotification);
            // Gửi thông báo cho chủ bài đăng khi bài được duyệt
            const post = posts.find(p => String(p.id) === String(postId));
            if (post && post.authorId && addNotification) {
                addNotification(post.authorId, {
                    type: 'post_approved',
                    postId: postId,
                    message: `Bài đăng "${post.title}" đã được duyệt bởi quản trị viên.`,
                });
            }
        }
    };

    const handleReject = (postId) => {
        if (rejectionReason.trim()) {
            const post = posts.find(p => String(p.id) === String(postId));
            rejectPost(postId, rejectionReason);
            
            // Gửi thông báo cho chủ bài đăng về lý do từ chối
            if (post && post.authorId && addNotification) {
                addNotification(post.authorId, {
                    type: 'post_rejected',
                    postId: postId,
                    message: `Bài đăng "${post.title}" đã bị từ chối. Lý do: ${rejectionReason}`,
                    rejectionReason: rejectionReason,
                });
            }
            
            setShowRejectModal(null);
            setRejectionReason('');
        } else {
            alert('Vui lòng nhập lý do từ chối');
        }
    };

    const getAuthorName = (authorId) => {
        const users = getUsers();
        const author = users.find(u => String(u.id) === String(authorId));
        return author ? author.name : 'Người dùng';
    };

    const pageTitle = {
        fontSize: 24,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    };

    const postCard = {
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,.05)',
    };

    const postTitle = {
        fontSize: 18,
        fontWeight: 600,
        color: '#111827',
        marginBottom: 8,
    };

    const postMeta = {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 12,
        flexWrap: 'wrap',
    };

    const postActions = {
        display: 'flex',
        gap: 12,
        marginTop: 16,
    };

    const buttonApprove = {
        padding: '8px 12px',
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

    const buttonReject = {
        padding: '8px 12px',
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

    const buttonView = {
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#fff',
        color: '#2563eb',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    };

    const emptyState = {
        textAlign: 'center',
        padding: 40,
        color: '#6b7280',
    };

    const modal = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
    };

    const modalContent = {
        background: '#fff',
        borderRadius: 16,
        padding: 28,
        maxWidth: 520,
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: 'none',
        boxSizing: 'border-box',
    };

    const modalTitle = {
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 20,
        color: '#111827',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    };

    const textarea = {
        width: '100%',
        padding: '14px 16px',
        borderRadius: 10,
        border: '2px solid #e5e7eb',
        fontSize: 14,
        minHeight: 120,
        marginBottom: 20,
        fontFamily: 'inherit',
        resize: 'vertical',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'all 0.2s',
    };

    return (
        <>
            <div style={pageTitle}>
                <i className="bi bi-clock-history" style={{ fontSize: 28, color: '#f59e0b' }} />
                <span>Bài đăng chờ duyệt ({pendingPosts.length})</span>
            </div>
            {pendingPosts.length === 0 ? (
                <div style={emptyState}>
                    <i className="bi bi-check-circle" style={{ fontSize: 64, color: '#d1d5db', marginBottom: 16 }} />
                    <p>Không có bài đăng nào đang chờ duyệt</p>
                </div>
            ) : (
                pendingPosts.map(post => (
                    <div key={post.id} style={postCard}>
                        <div style={postTitle}>{post.title}</div>
                        <div style={postMeta}>
                            <span>
                                <i className="bi bi-person" style={{ marginRight: 4 }} />
                                {getAuthorName(post.authorId)}
                            </span>
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
                                <i className="bi bi-calendar" style={{ marginRight: 4 }} />
                                {post.createdAt || 'Vừa xong'}
                            </span>
                        </div>
                        <div style={{ color: '#6b7280', marginBottom: 12, lineHeight: 1.6 }}>
                            {post.content || post.description}
                        </div>
                        {post.images && post.images.length > 0 && (
                            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                                {post.images.slice(0, 3).map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`${post.title} ${idx + 1}`}
                                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                                    />
                                ))}
                            </div>
                        )}
                        <div style={postActions}>
                            <button
                                style={buttonView}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(37,99,235,0.06)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}
                                onClick={() => onViewDetail?.(post.id)}
                            >
                                <i className="bi bi-eye" />
                                Xem chi tiết
                            </button>
                            <button
                                style={buttonApprove}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(16,185,129,0.08)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}
                                onClick={() => handleApprove(post.id)}
                            >
                                <i className="bi bi-check-circle" />
                                Duyệt
                            </button>
                            <button
                                style={buttonReject}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(239,68,68,0.06)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}
                                onClick={() => setShowRejectModal(post.id)}
                            >
                                <i className="bi bi-x-circle" />
                                Từ chối
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* Modal từ chối bài đăng */}
            {showRejectModal && (
                <div style={modal} onClick={() => setShowRejectModal(null)}>
                    <div style={modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={modalTitle}>
                            <i className="bi bi-exclamation-triangle" style={{ color: '#ef4444', fontSize: 24 }} />
                            Lý do từ chối bài đăng
                        </div>
                        <textarea
                            style={textarea}
                            placeholder="Nhập lý do từ chối bài đăng này..."
                            value={rejectionReason}
                            onChange={(e) => {
                                setRejectionReason(e.target.value);
                                // Focus effect
                                e.target.style.borderColor = '#2563eb';
                            }}
                            onBlur={(e) => {
                                if (!e.target.value) {
                                    e.target.style.borderColor = '#e5e7eb';
                                }
                            }}
                        />
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <button
                                style={{ ...buttonView, background: '#f3f4f6', color: '#6b7280' }}
                                onClick={() => {
                                    setShowRejectModal(null);
                                    setRejectionReason('');
                                }}
                            >
                                <i className="bi bi-x" />
                                Hủy
                            </button>
                            <button
                                style={buttonReject}
                                onClick={() => handleReject(showRejectModal)}
                            >
                                <i className="bi bi-check-circle" />
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

