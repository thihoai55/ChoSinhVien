import { useMemo } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { mockUsers } from '../../data/userData';

export default function AdminApprovedPosts({ onViewDetail }) {
    const { posts } = usePosts();

    const approvedPosts = useMemo(() => {
        return posts.filter(p => p.status === 'approved' || (!p.status && p.status !== 'pending' && p.status !== 'rejected'));
    }, [posts]);

    const getAuthorName = (authorId) => {
        const author = mockUsers.find(u => String(u.id) === String(authorId));
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

    const buttonView = {
        padding: '10px 20px',
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

    return (
        <>
            <div style={pageTitle}>
                <i className="bi bi-check-circle" style={{ fontSize: 28, color: '#10b981' }} />
                <span>Bài đăng đã duyệt ({approvedPosts.length})</span>
            </div>
            {approvedPosts.length === 0 ? (
                <div style={emptyState}>
                    <i className="bi bi-inbox" style={{ fontSize: 64, color: '#d1d5db', marginBottom: 16 }} />
                    <p>Chưa có bài đăng nào được duyệt</p>
                </div>
            ) : (
                approvedPosts.slice(0, 20).map(post => (
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
                        <button
                            style={buttonView}
                            onClick={() => onViewDetail?.(post.id)}
                        >
                            <i className="bi bi-eye" />
                            Xem chi tiết
                        </button>
                    </div>
                ))
            )}
        </>
    );
}

