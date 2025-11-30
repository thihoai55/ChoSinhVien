import { useState, useMemo, useEffect } from 'react';
import { mockUsers } from '../../data/userData';
import AdminUserDetail from './AdminUserDetail';
import AdminUserEdit from './AdminUserEdit';

export default function AdminUsers() {
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [bannedUsers, setBannedUsers] = useState(() => {
        try {
            const stored = localStorage.getItem('sv_banned_users');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', 'edit'
    const [users, setUsers] = useState(mockUsers);

    useEffect(() => {
        localStorage.setItem('sv_banned_users', JSON.stringify(bannedUsers));
    }, [bannedUsers]);

    // Load users từ localStorage nếu có (để lưu các thay đổi)
    useEffect(() => {
        try {
            const stored = localStorage.getItem('sv_admin_users');
            if (stored) {
                const savedUsers = JSON.parse(stored);
                // Merge với mockUsers để đảm bảo có đầy đủ dữ liệu
                setUsers(prev => {
                    const merged = [...prev];
                    savedUsers.forEach(savedUser => {
                        const index = merged.findIndex(u => u.id === savedUser.id);
                        if (index >= 0) {
                            merged[index] = { ...merged[index], ...savedUser };
                        }
                    });
                    return merged;
                });
            }
        } catch {}
    }, []);

    const filteredUsers = useMemo(() => {
        let filtered = users.filter(u => u.role !== 'admin');
        if (userSearchQuery.trim()) {
            const query = userSearchQuery.toLowerCase();
            filtered = filtered.filter(u => 
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                (u.bio && u.bio.toLowerCase().includes(query))
            );
        }
        return filtered;
    }, [userSearchQuery, users]);

    const toggleBanUser = (userId) => {
        if (bannedUsers.includes(userId)) {
            if (window.confirm('Bạn có chắc chắn muốn mở khóa tài khoản này?')) {
                setBannedUsers(prev => prev.filter(id => id !== userId));
            }
        } else {
            if (window.confirm('Bạn có chắc chắn muốn khóa tài khoản này?')) {
                setBannedUsers(prev => [...prev, userId]);
            }
        }
    };

    const handleViewDetail = (userId) => {
        setSelectedUserId(userId);
        setViewMode('detail');
    };

    const handleEdit = (userId) => {
        setSelectedUserId(userId);
        setViewMode('edit');
    };

    const handleSave = (userId, formData) => {
        setUsers(prev => {
            const updated = prev.map(u => 
                u.id === userId ? { ...u, ...formData } : u
            );
            // Lưu vào localStorage
            try {
                localStorage.setItem('sv_admin_users', JSON.stringify(updated));
            } catch {}
            return updated;
        });
        setViewMode('detail');
    };

    const handleDelete = (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác!')) {
            setUsers(prev => {
                const updated = prev.filter(u => u.id !== userId);
                try {
                    localStorage.setItem('sv_admin_users', JSON.stringify(updated));
                } catch {}
                return updated;
            });
            setViewMode('list');
            setSelectedUserId(null);
        }
    };

    const handleBack = () => {
        setViewMode('list');
        setSelectedUserId(null);
    };

    // Nếu đang xem chi tiết hoặc sửa
    if (viewMode === 'detail' && selectedUserId) {
        return (
            <AdminUserDetail
                userId={selectedUserId}
                onBack={handleBack}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleBan={toggleBanUser}
            />
        );
    }

    if (viewMode === 'edit' && selectedUserId) {
        return (
            <AdminUserEdit
                userId={selectedUserId}
                onSave={handleSave}
                onCancel={() => {
                    setViewMode('detail');
                }}
            />
        );
    }

    // Hiển thị danh sách
    const pageTitle = {
        fontSize: 24,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    };

    const searchInput = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        fontSize: 14,
        marginBottom: 20,
    };

    const userCard = {
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
    };

    const userCardHover = {
        boxShadow: '0 4px 12px rgba(0,0,0,.1)',
        transform: 'translateY(-2px)',
    };

    const userAvatar = {
        width: 56,
        height: 56,
        borderRadius: '50%',
        objectFit: 'cover',
    };

    const userInfo = {
        flex: 1,
    };

    const userName = {
        fontSize: 16,
        fontWeight: 600,
        color: '#111827',
        marginBottom: 4,
    };

    const userEmail = {
        fontSize: 14,
        color: '#6b7280',
    };

    const buttonGroup = {
        display: 'flex',
        gap: 8,
    };

    const buttonView = {
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        background: '#2563eb',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    };

    const buttonEdit = {
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        background: '#10b981',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    };

    const buttonDelete = {
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        background: '#ef4444',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    };

    const buttonBan = {
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        background: '#f59e0b',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    };

    const buttonUnban = {
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        background: '#10b981',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    };

    const emptyState = {
        textAlign: 'center',
        padding: 40,
        color: '#6b7280',
    };

    return (
        <>
            <div style={pageTitle}>
                <i className="bi bi-people" style={{ fontSize: 28, color: '#2563eb' }} />
                <span>Quản lý người dùng ({filteredUsers.length})</span>
            </div>
            <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                style={searchInput}
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
            />
            {filteredUsers.length === 0 ? (
                <div style={emptyState}>
                    <i className="bi bi-person-x" style={{ fontSize: 64, color: '#d1d5db', marginBottom: 16 }} />
                    <p>Không tìm thấy người dùng nào</p>
                </div>
            ) : (
                filteredUsers.map(user => {
                    const isBanned = bannedUsers.includes(user.id);
                    return (
                        <div
                            key={user.id}
                            style={userCard}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, userCardHover)}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'none';
                            }}
                            onClick={() => handleViewDetail(user.id)}
                        >
                            <img src={user.avatar} alt={user.name} style={userAvatar} />
                            <div style={userInfo}>
                                <div style={userName}>
                                    {user.name}
                                    {isBanned && (
                                        <span style={{ marginLeft: 8, color: '#ef4444', fontSize: 12 }}>
                                            (Đã khóa)
                                        </span>
                                    )}
                                    {user.verified && (
                                        <i className="bi bi-check-circle-fill" style={{ marginLeft: 8, color: '#10b981', fontSize: 14 }} />
                                    )}
                                </div>
                                <div style={userEmail}>{user.email}</div>
                                {user.bio && (
                                    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                                        {user.bio}
                                    </div>
                                )}
                            </div>
                            <div style={buttonGroup} onClick={(e) => e.stopPropagation()}>
                                <button
                                    style={buttonView}
                                    onClick={() => handleViewDetail(user.id)}
                                    title="Xem chi tiết"
                                >
                                    <i className="bi bi-eye" />
                                </button>
                                <button
                                    style={buttonEdit}
                                    onClick={() => handleEdit(user.id)}
                                    title="Sửa thông tin"
                                >
                                    <i className="bi bi-pencil" />
                                </button>
                                <button
                                    style={isBanned ? buttonUnban : buttonBan}
                                    onClick={() => toggleBanUser(user.id)}
                                    title={isBanned ? 'Mở khóa' : 'Khóa tài khoản'}
                                >
                                    <i className={isBanned ? 'bi bi-unlock' : 'bi bi-lock'} />
                                </button>
                                <button
                                    style={buttonDelete}
                                    onClick={() => handleDelete(user.id)}
                                    title="Xóa tài khoản"
                                >
                                    <i className="bi bi-trash" />
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </>
    );
}
