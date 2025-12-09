import React, { useState } from 'react';

export default function PaymentNotificationModal({ 
  bankTransferInfo,
  post,
  onConfirm, 
  onClose 
}) {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [showQR, setShowQR] = useState(false);

  const bankInfo = bankTransferInfo || {};
  const shippingFee = parseFloat(bankInfo.shippingFee || 0);
  const productPrice = parseFloat(String(post?.price || '0').replace(/[^0-9.-]/g, ''));
  const totalAmount = productPrice + shippingFee;

  const handleConfirmPayment = () => {
    setPaymentStatus('completed');
    setTimeout(() => {
      onConfirm?.();
    }, 2000);
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
    color: paymentStatus === 'completed' ? '#10b981' : '#1e293b',
  };

  const closeBtn = {
    background: 'transparent',
    border: 'none',
    fontSize: 24,
    cursor: 'pointer',
    color: '#6b7280',
  };

  const section = {
    marginBottom: 20,
  };

  const sectionTitle = {
    fontSize: 13,
    fontWeight: 600,
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const infoBox = {
    padding: 12,
    background: '#fef3c7',
    border: '1px solid #fcd34d',
    borderRadius: 8,
    fontSize: 13,
    color: '#92400e',
    marginBottom: 16,
  };

  const successBox = {
    padding: 16,
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 8,
    textAlign: 'center',
    marginBottom: 20,
  };

  const successText = {
    fontSize: 16,
    fontWeight: 700,
    color: '#10b981',
    marginBottom: 4,
  };

  const successSubtext = {
    fontSize: 13,
    color: '#059669',
  };

  const bankInfoBox = {
    padding: 16,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
  };

  const bankInfoRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottom: '1px solid #e5e7eb',
  };

  const bankInfoRowLast = {
    ...bankInfoRow,
    borderBottom: 'none',
    paddingBottom: 0,
    marginBottom: 0,
  };

  const bankLabel = {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
  };

  const bankValue = {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: 600,
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  };

  const priceInfo = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    padding: 12,
    background: '#fef9f3',
    border: '1px solid #fed7aa',
    borderRadius: 8,
  };

  const priceRow = {
    display: 'flex',
    justifyContent: 'space-between',
  };

  const priceLabel = {
    fontSize: 13,
    color: '#92400e',
    fontWeight: 500,
  };

  const priceValue = {
    fontSize: 13,
    color: '#b45309',
    fontWeight: 600,
  };

  const totalRow = {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTop: '1px solid #fed7aa',
  };

  const totalLabel = {
    fontSize: 14,
    color: '#92400e',
    fontWeight: 700,
  };

  const totalValue = {
    fontSize: 16,
    color: '#d97706',
    fontWeight: 700,
  };

  const qrContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    background: '#f9fafb',
    borderRadius: 8,
  };

  const qrImage = {
    width: '100%',
    maxWidth: 250,
    height: 250,
    objectFit: 'contain',
    marginBottom: 12,
    border: '2px solid #e5e7eb',
    borderRadius: 8,
    padding: 8,
    background: '#fff',
  };

  const qrToggleBtn = {
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #2563eb',
    background: '#eff6ff',
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    transition: 'all 0.2s ease',
  };

  const qrToggleBtnHover = {
    ...qrToggleBtn,
    background: '#dbeafe',
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

  const copyBtn = {
    padding: '6px 10px',
    borderRadius: 4,
    border: '1px solid #d1d5db',
    background: '#f3f4f6',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: 12,
    transition: 'all 0.2s ease',
  };

  const copyBtnHover = {
    ...copyBtn,
    background: '#e5e7eb',
  };

  if (paymentStatus === 'completed') {
    return (
      <div style={overlay} onClick={onClose}>
        <div style={modal} onClick={(e) => e.stopPropagation()}>
          <div style={header}>
            <h2 style={title}>✓ Thanh toán thành công</h2>
            <button style={closeBtn} onClick={onClose}>
              ✕
            </button>
          </div>

          <div style={successBox}>
            <div style={successText}>Cảm ơn bạn đã thanh toán!</div>
            <div style={successSubtext}>
              Chúng tôi sẽ gửi thông báo cho người bán và xác nhận giao dịch
            </div>
          </div>

          <div style={section}>
            <div style={sectionTitle}>Thông tin giao dịch</div>
            <div style={bankInfoBox}>
              <div style={bankInfoRow}>
                <span style={bankLabel}>Sản phẩm:</span>
                <span style={bankValue}>{post?.title}</span>
              </div>
              <div style={bankInfoRow}>
                <span style={bankLabel}>Số tiền:</span>
                <span style={bankValue}>{totalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div style={bankInfoRowLast}>
                <span style={bankLabel}>Trạng thái:</span>
                <span style={{ ...bankValue, color: '#10b981' }}>Đã thanh toán</span>
              </div>
            </div>
          </div>

          <div style={actions}>
            <button
              style={btnPrimary}
              onClick={onClose}
              onMouseEnter={(e) => Object.assign(e.target.style, btnPrimaryHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, btnPrimary)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <h2 style={title}>Thông tin chuyển khoản</h2>
          <button style={closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={infoBox}>
          💬 Người bán đã gửi thông tin tài khoản để bạn thanh toán
        </div>

        {/* Thông tin sản phẩm */}
        <div style={section}>
          <div style={sectionTitle}>Sản phẩm</div>
          <div style={priceInfo}>
            <div style={priceRow}>
              <span style={priceLabel}>Tên:</span>
              <span style={priceValue}>{post?.title}</span>
            </div>
            <div style={priceRow}>
              <span style={priceLabel}>Giá:</span>
              <span style={priceValue}>{productPrice.toLocaleString('vi-VN')} đ</span>
            </div>
            {shippingFee > 0 && (
              <div style={priceRow}>
                <span style={priceLabel}>Vận chuyển:</span>
                <span style={priceValue}>{shippingFee.toLocaleString('vi-VN')} đ</span>
              </div>
            )}
            <div style={totalRow}>
              <span style={totalLabel}>Tổng cộng:</span>
              <span style={totalValue}>{totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>

        {/* Thông tin tài khoản ngân hàng */}
        <div style={section}>
          <div style={sectionTitle}>Thông tin tài khoản</div>
          <div style={bankInfoBox}>
            <div style={bankInfoRow}>
              <span style={bankLabel}>Ngân hàng:</span>
              <span style={bankValue}>{bankInfo.bankName}</span>
            </div>
            <div style={bankInfoRow}>
              <span style={bankLabel}>Số tài khoản:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                <span style={bankValue}>{bankInfo.accountNumber}</span>
                <button
                  style={copyBtn}
                  onClick={() => {
                    navigator.clipboard.writeText(bankInfo.accountNumber);
                  }}
                  onMouseEnter={(e) => Object.assign(e.target.style, copyBtnHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, copyBtn)}
                  title="Sao chép"
                >
                  📋
                </button>
              </div>
            </div>
            <div style={bankInfoRowLast}>
              <span style={bankLabel}>Chủ tài khoản:</span>
              <span style={bankValue}>{bankInfo.accountHolder}</span>
            </div>
          </div>
        </div>

        {/* QR Code */}
        {bankInfo.qrImageData && (
          <div style={section}>
            <div style={sectionTitle}>Mã QR</div>
            <div style={qrContainer}>
              {showQR ? (
                <>
                  <img 
                    src={bankInfo.qrImageData} 
                    alt="QR Code" 
                    style={qrImage}
                  />
                  <button
                    style={qrToggleBtn}
                    onClick={() => setShowQR(false)}
                    onMouseEnter={(e) => Object.assign(e.target.style, qrToggleBtnHover)}
                    onMouseLeave={(e) => Object.assign(e.target.style, qrToggleBtn)}
                  >
                    Ẩn mã QR
                  </button>
                </>
              ) : (
                <button
                  style={qrToggleBtn}
                  onClick={() => setShowQR(true)}
                  onMouseEnter={(e) => Object.assign(e.target.style, qrToggleBtnHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, qrToggleBtn)}
                >
                  Hiển thị mã QR
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hướng dẫn */}
        <div style={section}>
          <div style={sectionTitle}>Hướng dẫn thanh toán</div>
          <div style={{
            padding: 12,
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 8,
            fontSize: 13,
            color: '#166534',
            lineHeight: 1.6,
          }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Bước 1:</strong> Mở ứng dụng ngân hàng hoặc VCB, TPBank, v.v.
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Bước 2:</strong> Chọn chuyển tiền, quét mã QR hoặc nhập số tài khoản bên trên
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Bước 3:</strong> Nhập số tiền: <strong>{totalAmount.toLocaleString('vi-VN')} đ</strong>
            </div>
            <div>
              <strong>Bước 4:</strong> Xác nhận thanh toán thành công dưới đây
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={actions}>
          <button
            style={btnSecondary}
            onClick={onClose}
            onMouseEnter={(e) => Object.assign(e.target.style, btnSecondaryHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, btnSecondary)}
          >
            Hủy
          </button>
          <button
            style={btnPrimary}
            onClick={handleConfirmPayment}
            onMouseEnter={(e) => Object.assign(e.target.style, btnPrimaryHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, btnPrimary)}
          >
            ✓ Đã thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
