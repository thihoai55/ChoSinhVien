import React, { useState } from 'react';

export default function BankTransferModal({ post, buyer, transaction, onConfirm, onCancel }) {
  const [bankInfo, setBankInfo] = useState({
    accountNumber: '',
    bankName: '',
    accountHolder: '',
    shippingFee: '',
    qrImage: null,
  });
  const [errors, setErrors] = useState({});
  const [qrPreview, setQrPreview] = useState(null);

  const handleInputChange = (field, value) => {
    setBankInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleQrImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setBankInfo((prev) => ({ ...prev, qrImage: file }));
        const reader = new FileReader();
        reader.onload = (event) => {
          setQrPreview(event.target?.result);
        };
        reader.readAsDataURL(file);
      } else {
        setErrors((prev) => ({ ...prev, qrImage: 'Vui lòng chọn file hình ảnh' }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!bankInfo.accountNumber.trim()) newErrors.accountNumber = 'Vui lòng nhập số tài khoản';
    if (!bankInfo.bankName.trim()) newErrors.bankName = 'Vui lòng nhập tên ngân hàng';
    if (!bankInfo.accountHolder.trim()) newErrors.accountHolder = 'Vui lòng nhập tên chủ tài khoản';
    if (bankInfo.shippingFee && isNaN(parseFloat(bankInfo.shippingFee))) {
      newErrors.shippingFee = 'Phí vận chuyển phải là số';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) {
      onConfirm?.({
        ...bankInfo,
        qrImageData: qrPreview,
      });
    }
  };

  const totalAmount = parseFloat(post?.price || 0) + parseFloat(bankInfo.shippingFee || 0);

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
    zIndex: 1001,
  };

  const modal = {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    maxWidth: 550,
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

  const infoBox = {
    padding: 12,
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 8,
    fontSize: 13,
    color: '#166534',
    marginBottom: 16,
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

  const uploadArea = {
    border: '2px dashed #d1d5db',
    borderRadius: 8,
    padding: 16,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: '#f9fafb',
  };

  const uploadAreaHover = {
    ...uploadArea,
    borderColor: '#2563eb',
    background: '#eff6ff',
  };

  const qrImagePreview = {
    width: '100%',
    maxWidth: 200,
    height: 200,
    objectFit: 'cover',
    borderRadius: 8,
    marginTop: 12,
    border: '1px solid #e5e7eb',
  };

  const priceInfo = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    padding: 12,
    background: '#f8fafc',
    borderRadius: 8,
    marginBottom: 16,
  };

  const priceRow = {
    display: 'flex',
    justifyContent: 'space-between',
  };

  const priceLabel = {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
  };

  const priceValue = {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: 600,
  };

  const totalRow = {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTop: '1px solid #e2e8f0',
  };

  const totalLabel = {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: 700,
  };

  const totalValue = {
    fontSize: 16,
    color: '#10b981',
    fontWeight: 700,
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
    background: 'linear-gradient(90deg,#059669,#10b981)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(16,185,129,0.2)',
  };

  const btnPrimaryHover = {
    ...btnPrimary,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
  };

  const requiredNote = {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 12,
  };

  return (
    <div style={overlay} onClick={onCancel}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <h2 style={title}>Thông tin chuyển khoản</h2>
          <button style={closeBtn} onClick={onCancel}>
            ✕
          </button>
        </div>

        <div style={infoBox}>
          💡 Vui lòng nhập thông tin tài khoản ngân hàng để người mua có thể chuyển khoản
        </div>

        {/* Thông tin sản phẩm */}
        <div style={section}>
          <div style={sectionTitle}>Sản phẩm cần thanh toán</div>
          <div style={priceInfo}>
            <div style={priceRow}>
              <span style={priceLabel}>Tên sản phẩm:</span>
              <span style={priceValue}>{post?.title}</span>
            </div>
            <div style={priceRow}>
              <span style={priceLabel}>Giá sản phẩm:</span>
              <span style={priceValue}>{post?.price?.toLocaleString('vi-VN')} đ</span>
            </div>
            <div style={priceRow}>
              <span style={priceLabel}>Phí vận chuyển:</span>
              <span style={priceValue}>{bankInfo.shippingFee ? parseFloat(bankInfo.shippingFee).toLocaleString('vi-VN') : '0'} đ</span>
            </div>
            <div style={totalRow}>
              <span style={totalLabel}>Tổng cộng:</span>
              <span style={totalValue}>{totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>

        {/* Thông tin tài khoản ngân hàng */}
        <div style={section}>
          <div style={sectionTitle}>Thông tin tài khoản ngân hàng</div>

          <div style={inputContainer}>
            <label style={label}>Số tài khoản *</label>
            <input
              type="text"
              style={errors.accountNumber ? inputError : input}
              placeholder="123456789"
              value={bankInfo.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
            />
            {errors.accountNumber && <div style={errorText}>{errors.accountNumber}</div>}
          </div>

          <div style={inputContainer}>
            <label style={label}>Tên ngân hàng *</label>
            <input
              type="text"
              style={errors.bankName ? inputError : input}
              placeholder="VietcomBank, Techcombank, DongA Bank..."
              value={bankInfo.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
            />
            {errors.bankName && <div style={errorText}>{errors.bankName}</div>}
          </div>

          <div style={inputContainer}>
            <label style={label}>Tên chủ tài khoản *</label>
            <input
              type="text"
              style={errors.accountHolder ? inputError : input}
              placeholder="Nguyễn Văn A"
              value={bankInfo.accountHolder}
              onChange={(e) => handleInputChange('accountHolder', e.target.value)}
            />
            {errors.accountHolder && <div style={errorText}>{errors.accountHolder}</div>}
          </div>

          <div style={inputContainer}>
            <label style={label}>Phí vận chuyển (tùy chọn)</label>
            <input
              type="number"
              style={errors.shippingFee ? inputError : input}
              placeholder="0"
              min="0"
              value={bankInfo.shippingFee}
              onChange={(e) => handleInputChange('shippingFee', e.target.value)}
            />
            {errors.shippingFee && <div style={errorText}>{errors.shippingFee}</div>}
          </div>
        </div>

        {/* Upload QR Code */}
        <div style={section}>
          <div style={sectionTitle}>Hình ảnh QR code (tùy chọn)</div>
          <label
            style={uploadArea}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, uploadAreaHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, uploadArea)}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleQrImageSelect}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>
              📸 Nhấp để chọn hình ảnh QR
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>
              Hỗ trợ PNG, JPG, GIF (tối đa 5MB)
            </div>
            {qrPreview && (
              <img src={qrPreview} alt="QR Code Preview" style={qrImagePreview} />
            )}
          </label>
          {errors.qrImage && <div style={errorText}>{errors.qrImage}</div>}
        </div>

        <div style={requiredNote}>
          <strong>Ghi chú:</strong> Các trường được đánh dấu <span style={{ color: '#ef4444' }}>*</span> là bắt buộc
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
            Lưu thông tin
          </button>
        </div>
      </div>
    </div>
  );
}
