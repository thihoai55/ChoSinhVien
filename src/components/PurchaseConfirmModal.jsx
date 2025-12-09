import React, { useState } from 'react';

export default function PurchaseConfirmModal({ post, buyer, onConfirm, onCancel }) {
  const [buyerInfo, setBuyerInfo] = useState({
    name: buyer?.name || '',
    phone: buyer?.phone || '',
    address: '',
    quantity: 1,
    note: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setBuyerInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!buyerInfo.name.trim()) newErrors.name = 'Vui lòng nhập tên';
    if (!buyerInfo.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!buyerInfo.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ giao hàng';
    if (buyerInfo.quantity < 1) newErrors.quantity = 'Số lượng phải >= 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) {
      onConfirm?.(buyerInfo);
    }
  };

  const overlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modal = {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    maxWidth: 500,
    width: '90%',
    padding: 24,
    maxHeight: '90vh',
    overflowY: 'auto',
  };

  const header = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  };

  const title = {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    flex: 1,
  };

  const closeBtn = {
    background: 'transparent',
    border: 'none',
    fontSize: 24,
    cursor: 'pointer',
    color: '#6b7280',
  };

  const section = {
    marginBottom: 16,
  };

  const sectionTitle = {
    fontSize: 13,
    fontWeight: 600,
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const postPreview = {
    display: 'flex',
    gap: 10,
    padding: 12,
    background: '#f8fafc',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
  };

  const postImg = {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 8,
    background: '#f1f5f9',
  };

  const postInfo = {
    flex: 1,
  };

  const postTitle = {
    fontWeight: 700,
    color: '#111827',
    marginBottom: 4,
  };

  const postPrice = {
    fontWeight: 700,
    color: '#10b981',
    fontSize: 14,
  };

  const inputContainer = {
    marginBottom: 12,
  };

  const label = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
  };

  const input = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 14,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  };

  const inputError = {
    ...input,
    borderColor: '#ef4444',
    background: '#fef2f2',
  };

  const errorText = {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  };

  const actions = {
    display: 'flex',
    gap: 10,
    marginTop: 20,
  };

  const btnSecondary = {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: '#fff',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  };

  const btnSecondaryHover = {
    ...btnSecondary,
    background: '#f3f4f6',
  };

  const btnPrimary = {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(90deg,#06b6d4,#2563eb)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
  };

  const btnPrimaryHover = {
    ...btnPrimary,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
  };

  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <h2 style={title}>Xác nhận yêu cầu mua</h2>
          <button style={closeBtn} onClick={onCancel}>
            ✕
          </button>
        </div>

        {/* Bài đăng - Preview */}
        <div style={section}>
          <div style={sectionTitle}>Bài đăng</div>
          <div style={postPreview}>
            <img
              src={(post?.images && post.images[0]) || post?.image || ''}
              alt={post?.title}
              style={postImg}
            />
            <div style={postInfo}>
              <div style={postTitle}>{post?.title}</div>
              <div style={postPrice}>{post?.price}</div>
            </div>
          </div>
        </div>

        {/* Thông tin người mua */}
        <div style={section}>
          <div style={sectionTitle}>Thông tin người mua</div>

          <div style={inputContainer}>
            <label style={label}>Tên *</label>
            <input
              type="text"
              style={errors.name ? inputError : input}
              placeholder="Nguyễn Văn A"
              value={buyerInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            {errors.name && <div style={errorText}>{errors.name}</div>}
          </div>

          <div style={inputContainer}>
            <label style={label}>Số điện thoại *</label>
            <input
              type="tel"
              style={errors.phone ? inputError : input}
              placeholder="0912345678"
              value={buyerInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            {errors.phone && <div style={errorText}>{errors.phone}</div>}
          </div>

          <div style={inputContainer}>
            <label style={label}>Địa chỉ giao hàng *</label>
            <input
              type="text"
              style={errors.address ? inputError : input}
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
              value={buyerInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
            {errors.address && <div style={errorText}>{errors.address}</div>}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, ...inputContainer }}>
              <label style={label}>Số lượng *</label>
              <input
                type="number"
                style={errors.quantity ? inputError : input}
                placeholder="1"
                min="1"
                value={buyerInfo.quantity}
                onChange={(e) => handleInputChange('quantity', Math.max(1, parseInt(e.target.value) || 1))}
              />
              {errors.quantity && <div style={errorText}>{errors.quantity}</div>}
            </div>
          </div>
        </div>

        {/* Ghi chú */}
        <div style={section}>
          <div style={sectionTitle}>Ghi chú thêm</div>
          <textarea
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 14,
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              minHeight: 80,
              resize: 'vertical',
            }}
            placeholder="Ví dụ: Muốn giao buổi sáng, hàng phải còn nguyên vẹn..."
            value={buyerInfo.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div style={actions}>
          <button
            style={btnSecondary}
            onClick={onCancel}
            onMouseEnter={(e) => Object.assign(e.target.style, btnSecondaryHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, btnSecondary)}
          >
            Hủy
          </button>
          <button
            style={btnPrimary}
            onClick={handleConfirm}
            onMouseEnter={(e) => Object.assign(e.target.style, btnPrimaryHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, btnPrimary)}
          >
            Gửi yêu cầu mua
          </button>
        </div>
      </div>
    </div>
  );
}
