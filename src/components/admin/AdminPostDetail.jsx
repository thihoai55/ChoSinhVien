import { useState } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getUsers } from '../../data/userData';

export default function AdminPostDetail({ postId, onBack }) {
    const { posts, approvePost, rejectPost } = usePosts();
    const { addNotification } = useNotifications();
    const post = posts.find(p => String(p.id) === String(postId));
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    if (!post) {
        return (
            <div style={{ textAlign: 'center', padding: 40, background: '#f8fafc', minHeight: '100vh' }}>
                <h3 style={{ color: '#ef4444', marginBottom: 16 }}>Không tìm thấy bài đăng</h3>
                <button
                    onClick={onBack}
                    style={{
                        padding: '10px 18px',
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 16,
                    }}
                >
                    <i className="bi bi-arrow-left" style={{ marginRight: 8 }} />
                    Quay lại
                </button>
            </div>
        );
    }

    const users = getUsers();
    const author = users.find(u => String(u.id) === String(post.authorId));

    const handleApprove = () => {
        if (window.confirm('Bạn có chắc chắn muốn duyệt bài đăng này?')) {
            // ✅ Truyền addNotification callback vào approvePost
            // approvePost sẽ tự động gửi notification đến PREMIUM post buyers
            approvePost(postId, addNotification);
            
            // Gửi thông báo cho chủ bài đăng khi bài được duyệt
            if (post && post.authorId && addNotification) {
                addNotification(post.authorId, {
                    type: 'post_approved',
                    postId: postId,
                    message: `Bài đăng "${post.title}" đã được duyệt bởi quản trị viên.`,
                });
            }

            onBack?.();
        }
    };

    const handleReject = () => {
        if (rejectionReason.trim()) {
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
            
            setShowRejectModal(false);
            setRejectionReason('');
            onBack?.();
        } else {
            alert('Vui lòng nhập lý do từ chối');
        }
    };

    const container = {
        maxWidth: 900,
        margin: '0 auto',
        padding: '24px',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,.08)',
    };

    const header = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '2px solid #e5e7eb',
    };

    const title = {
        fontSize: 28,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 8,
    };

    const statusBadge = {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        marginLeft: 12,
    };

    const statusPending = {
        ...statusBadge,
        background: '#fef3c7',
        color: '#d97706',
    };

    const statusApproved = {
        ...statusBadge,
        background: '#d1fae5',
        color: '#059669',
    };

    const statusRejected = {
        ...statusBadge,
        background: '#fee2e2',
        color: '#dc2626',
    };

    const infoSection = {
        marginBottom: 24,
        padding: 20,
        background: '#f9fafb',
        borderRadius: 8,
    };

    const infoRow = {
        display: 'flex',
        marginBottom: 12,
        fontSize: 14,
    };

    const infoLabel = {
        fontWeight: 600,
        color: '#6b7280',
        width: 150,
    };

    const infoValue = {
        color: '#111827',
        flex: 1,
    };

    const authorCard = {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        marginBottom: 24,
    };

    const authorAvatar = {
        width: 56,
        height: 56,
        borderRadius: '50%',
        objectFit: 'cover',
    };

    const contentSection = {
        marginBottom: 24,
    };

    const contentText = {
        fontSize: 16,
        lineHeight: 1.8,
        color: '#374151',
        whiteSpace: 'pre-wrap',
    };

    const imagesGrid = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 12,
        marginTop: 16,
    };

    const imageItem = {
        width: '100%',
        height: 200,
        objectFit: 'cover',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
    };

    const actions = {
        display: 'flex',
        gap: 12,
        marginTop: 24,
        paddingTop: 24,
        borderTop: '2px solid #e5e7eb',
    };

    const buttonApprove = {
        padding: '8px 14px',
        borderRadius: 8,
        border: 'none',
        background: '#10b981',
        color: '#fff',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    };

    const buttonReject = {
        padding: '8px 14px',
        borderRadius: 8,
        border: 'none',
        background: '#ef4444',
        color: '#fff',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    };

    const buttonBack = {
        padding: '12px 24px',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#fff',
        color: '#6b7280',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
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

    const getStatusBadge = () => {
        if (post.status === 'pending') return statusPending;
        if (post.status === 'approved') return statusApproved;
        if (post.status === 'rejected') return statusRejected;
        return statusApproved;
    };

    const getStatusText = () => {
        if (post.status === 'pending') return 'Chờ duyệt';
        if (post.status === 'approved') return 'Đã duyệt';
        if (post.status === 'rejected') return 'Đã từ chối';
        return 'Đã duyệt';
    };

    return (
        <div style={{ padding: '20px 16px', background: 'linear-gradient(180deg, #eff6ff, #ffffff)', minHeight: '100vh' }}>
            <div style={container}>
                <div style={header}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <h1 style={title}>{post.title}</h1>
                            <span style={getStatusBadge()}>{getStatusText()}</span>
                        </div>
                    </div>
                    <button style={buttonBack} onClick={onBack}>
                        <i className="bi bi-arrow-left" />
                        Quay lại
                    </button>
                </div>

                <div style={infoSection}>
                    <div style={infoRow}>
                        <span style={infoLabel}>Tác giả:</span>
                        <span style={infoValue}>{author?.name || 'Người dùng'}</span>
                    </div>
                    <div style={infoRow}>
                        <span style={infoLabel}>Email:</span>
                        <span style={infoValue}>{author?.email || 'N/A'}</span>
                    </div>
                    <div style={infoRow}>
                        <span style={infoLabel}>Danh mục:</span>
                        <span style={infoValue}>{post.category || 'N/A'}</span>
                    </div>
                    {post.price && (
                        <div style={infoRow}>
                            <span style={infoLabel}>Giá:</span>
                            <span style={infoValue}>{post.price}</span>
                        </div>
                    )}
                    {post.location && (
                        <div style={infoRow}>
                            <span style={infoLabel}>Địa điểm:</span>
                            <span style={infoValue}>{post.location}</span>
                        </div>
                    )}
                    <div style={infoRow}>
                        <span style={infoLabel}>Ngày tạo:</span>
                        <span style={infoValue}>{post.createdAt || post.timestamp || 'Vừa xong'}</span>
                    </div>
                    {post.rejectionReason && (
                        <div style={infoRow}>
                            <span style={infoLabel}>Lý do từ chối:</span>
                            <span style={{ ...infoValue, color: '#ef4444' }}>{post.rejectionReason}</span>
                        </div>
                    )}
                </div>

                {author && (
                    <div style={authorCard}>
                        <img src={author.avatar} alt={author.name} style={authorAvatar} />
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{author.name}</div>
                            <div style={{ fontSize: 14, color: '#6b7280' }}>{author.email}</div>
                        </div>
                    </div>
                )}

                <div style={contentSection}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Nội dung bài đăng</h3>
                    <div style={contentText}>{post.content || post.description || 'Không có nội dung'}</div>
                </div>

                {post.images && post.images.length > 0 && (
                    <div style={contentSection}>
                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Hình ảnh ({post.images.length})</h3>
                        <div style={imagesGrid}>
                            {post.images.map((img, idx) => (
                                <img key={idx} src={img} alt={`${post.title} ${idx + 1}`} style={imageItem} />
                            ))}
                        </div>
                    </div>
                )}

                {post.status === 'pending' && (
                    <div style={actions}>
                                <button
                                    style={buttonApprove}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(16,185,129,0.18)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}
                                    onClick={handleApprove}
                                >
                                    <i className="bi bi-check-circle" />
                                    Duyệt bài đăng
                                </button>
                                <button
                                    style={buttonReject}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 18px rgba(239,68,68,0.14)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}
                                    onClick={() => setShowRejectModal(true)}
                                >
                                    <i className="bi bi-x-circle" />
                                    Từ chối bài đăng
                                </button>
                    </div>
                )}
            </div>

            {/* Modal từ chối */}
            {showRejectModal && (
                <div style={modal} onClick={() => setShowRejectModal(false)}>
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
                                style={{ ...buttonBack, margin: 0 }}
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                }}
                            >
                                <i className="bi bi-x" />
                                Hủy
                            </button>
                            <button style={buttonReject} onClick={handleReject}>
                                <i className="bi bi-check-circle" />
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

