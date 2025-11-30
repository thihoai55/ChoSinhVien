import React from 'react';

export default function HidePostModal({ isOpen, onClose, onConfirm, postTitle }) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div
            style={{
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
            }}
            onClick={handleCancel}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '24px',
                    maxWidth: '400px',
                    width: '90%',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon cảnh báo */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '16px',
                    }}
                >
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: '#fef3c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <i
                            className="bi bi-eye-slash-fill"
                            style={{
                                fontSize: '32px',
                                color: '#f59e0b',
                            }}
                        />
                    </div>
                </div>

                {/* Tiêu đề */}
                <h3
                    style={{
                        margin: '0 0 12px 0',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#1f2937',
                        textAlign: 'center',
                    }}
                >
                    Ẩn bài đăng
                </h3>

                {/* Nội dung */}
                <p
                    style={{
                        margin: '0 0 24px 0',
                        fontSize: '15px',
                        color: '#6b7280',
                        textAlign: 'center',
                        lineHeight: '1.6',
                    }}
                >
                    Bạn có chắc chắn muốn ẩn bài đăng
                    {postTitle && (
                        <span style={{ fontWeight: 600, color: '#1f2937' }}>
                            {' "' + postTitle + '"'}
                        </span>
                    )}
                    ? Bài đăng sẽ được chuyển vào tab "Đã ẩn" và bạn có thể đăng lại sau.
                </p>

                {/* Nút hành động */}
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                    }}
                >
                    <button
                        onClick={handleCancel}
                        style={{
                            flex: 1,
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            color: '#374151',
                            fontSize: '15px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.borderColor = '#d1d5db';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleConfirm}
                        style={{
                            flex: 1,
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#f59e0b',
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#d97706';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f59e0b';
                        }}
                    >
                        Ẩn
                    </button>
                </div>
            </div>
        </div>
    );
}

