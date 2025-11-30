import { useState, useEffect } from 'react';
import { mockUsers } from '../../data/userData';

export default function AdminUserEdit({ userId, onSave, onCancel }) {
    const user = mockUsers.find(u => String(u.id) === String(userId));
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        verified: false,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                location: user.location || '',
                verified: user.verified || false,
            });
        }
    }, [user]);

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <h3 style={{ color: '#ef4444', marginBottom: 16 }}>Không tìm thấy người dùng</h3>
                <button onClick={onCancel} style={buttonCancel}>
                    Quay lại
                </button>
            </div>
        );
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (window.confirm('Bạn có chắc chắn muốn lưu thay đổi?')) {
            onSave?.(userId, formData);
        }
    };

    const container = {
        maxWidth: 700,
        margin: '0 auto',
        padding: '24px',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,.08)',
    };

    const header = {
        fontSize: 24,
        fontWeight: 700,
        color: '#111827',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    };

    const formGroup = {
        marginBottom: 20,
    };

    const label = {
        display: 'block',
        fontSize: 14,
        fontWeight: 600,
        color: '#374151',
        marginBottom: 8,
    };

    const input = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        fontSize: 14,
        fontFamily: 'inherit',
        boxSizing: 'border-box',
    };

    const textarea = {
        ...input,
        minHeight: 100,
        resize: 'vertical',
    };

    const checkboxContainer = {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    };

    const checkbox = {
        width: 18,
        height: 18,
        cursor: 'pointer',
    };

    const actions = {
        display: 'flex',
        gap: 12,
        marginTop: 32,
        paddingTop: 24,
        borderTop: '2px solid #e5e7eb',
    };

    const buttonSave = {
        padding: '12px 24px',
        borderRadius: 8,
        border: 'none',
        background: '#2563eb',
        color: '#fff',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    };

    const buttonCancel = {
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

    return (
        <div style={{ padding: '20px 16px', background: 'linear-gradient(180deg, #eff6ff, #ffffff)', minHeight: '100vh' }}>
            <div style={container}>
                <h2 style={header}>
                    <i className="bi bi-pencil" />
                    Sửa thông tin người dùng
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={formGroup}>
                        <label style={label}>Tên *</label>
                        <input
                            type="text"
                            style={input}
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                    </div>

                    <div style={formGroup}>
                        <label style={label}>Email *</label>
                        <input
                            type="email"
                            style={input}
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                        />
                    </div>

                    <div style={formGroup}>
                        <label style={label}>Số điện thoại</label>
                        <input
                            type="tel"
                            style={input}
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>

                    <div style={formGroup}>
                        <label style={label}>Địa điểm</label>
                        <input
                            type="text"
                            style={input}
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                        />
                    </div>

                    <div style={formGroup}>
                        <label style={label}>Giới thiệu</label>
                        <textarea
                            style={textarea}
                            value={formData.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            placeholder="Nhập giới thiệu về người dùng..."
                        />
                    </div>

                    <div style={formGroup}>
                        <div style={checkboxContainer}>
                            <input
                                type="checkbox"
                                style={checkbox}
                                checked={formData.verified}
                                onChange={(e) => handleChange('verified', e.target.checked)}
                            />
                            <label style={{ ...label, margin: 0, cursor: 'pointer' }}>
                                Tài khoản đã xác thực
                            </label>
                        </div>
                    </div>

                    <div style={actions}>
                        <button type="submit" style={buttonSave}>
                            <i className="bi bi-check-circle" />
                            Lưu thay đổi
                        </button>
                        <button type="button" style={buttonCancel} onClick={onCancel}>
                            <i className="bi bi-x-circle" />
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

