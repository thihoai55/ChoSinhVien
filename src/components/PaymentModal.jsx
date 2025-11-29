import { useState } from 'react';
import { X, CreditCard, Wallet2, QrCode, CheckCircle, Lock } from 'react-bootstrap-icons';
import { useWallet } from '../contexts/WalletContext';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  packageType, 
  packagePrice,
  postTitle 
}) {
  const { balance } = useWallet();
  const [selectedMethod, setSelectedMethod] = useState(balance >= packagePrice ? 'balance' : 'vnpay');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const hasEnoughBalance = balance >= packagePrice;

  if (!isOpen) return null;

  const paymentMethods = [
    {
      id: 'balance',
      name: 'Số dư hiện tại',
      icon: <Wallet2 size={24} />,
      description: `Thanh toán từ số dư (${balance.toLocaleString('vi-VN')}đ)`,
      color: '#3b82f6',
      available: hasEnoughBalance
    },
    {
      id: 'vnpay',
      name: 'VNPay',
      icon: <CreditCard size={24} />,
      description: 'Thanh toán qua thẻ ngân hàng',
      color: '#0052a5'
    },
    {
      id: 'momo',
      name: 'MoMo',
      icon: <Wallet2 size={24} />,
      description: 'Ví điện tử MoMo',
      color: '#a50064'
    },
    {
      id: 'qr',
      name: 'QR Code',
      icon: <QrCode size={24} />,
      description: 'Quét mã QR để thanh toán',
      color: '#10b981'
    }
  ];

  const handlePayment = async () => {
    // Nếu chọn thanh toán bằng số dư và không đủ tiền
    if (selectedMethod === 'balance' && !hasEnoughBalance) {
      alert('Số dư không đủ. Vui lòng nạp thêm tiền.');
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      
      // After showing success, call onPaymentSuccess với phương thức thanh toán
      setTimeout(() => {
        onPaymentSuccess(selectedMethod);
        setPaymentSuccess(false);
        onClose();
      }, 1500);
    }, 2000);
  };

  const handleClose = () => {
    if (!processing && !paymentSuccess) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '2px solid #fbbf24',
            backgroundColor: '#fffbeb',
            borderRadius: '16px 16px 0 0',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lock size={16} color="#1f2937" />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1f2937',
                  lineHeight: '1.2',
                }}
              >
                Thanh toán
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '11px',
                  color: '#6b7280',
                  lineHeight: '1.2',
                }}
              >
                Giao dịch được bảo mật
              </p>
            </div>
          </div>
          {!processing && !paymentSuccess && (
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <X size={20} color="#6b7280" />
            </button>
          )}
        </div>

        {/* Content - Scrollable */}
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {paymentSuccess ? (
            // Success State
            <div
              style={{
                textAlign: 'center',
                padding: '30px 16px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  animation: 'scaleIn 0.3s ease',
                }}
              >
                <CheckCircle size={32} color="#ffffff" />
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: '0 0 6px',
                }}
              >
                Thanh toán thành công!
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  margin: 0,
                }}
              >
                Bài đăng của bạn đang được xử lý...
              </p>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div
                style={{
                  backgroundColor: '#fef3c7',
                  border: '2px solid #fbbf24',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '14px',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#92400e',
                    marginBottom: '8px',
                  }}
                >
                  Thông tin đơn hàng
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ fontSize: '13px', color: '#1f2937' }}>
                    Gói {packageType === 'basic' ? 'Cơ bản' : 'Premium'}
                  </span>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#f59e0b',
                    }}
                  >
                    {packagePrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                {postTitle && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      marginTop: '6px',
                      paddingTop: '6px',
                      borderTop: '1px solid #fde68a',
                    }}
                  >
                    <strong>Bài đăng:</strong> {postTitle.length > 50 
                      ? postTitle.substring(0, 50) + '...' 
                      : postTitle}
                  </div>
                )}
              </div>

              {/* Balance Info */}
              <div
                style={{
                  padding: '12px',
                  backgroundColor: hasEnoughBalance ? '#ecfdf5' : '#fef2f2',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  border: `2px solid ${hasEnoughBalance ? '#10b981' : '#ef4444'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                    Số dư hiện tại:
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: hasEnoughBalance ? '#10b981' : '#ef4444' }}>
                    {balance.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                {!hasEnoughBalance && (
                  <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                    ⚠️ Số dư không đủ. Vui lòng nạp thêm {((packagePrice - balance).toLocaleString('vi-VN'))}đ
                  </div>
                )}
              </div>

              {/* Total */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '14px',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1f2937',
                  }}
                >
                  Tổng thanh toán:
                </span>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#f59e0b',
                  }}
                >
                  {packagePrice.toLocaleString('vi-VN')}đ
                </span>
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '10px',
                  }}
                >
                  Chọn phương thức thanh toán
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {paymentMethods.map((method) => {
                    const isDisabled = method.id === 'balance' && !method.available;
                    return (
                      <div
                        key={method.id}
                        onClick={() => !processing && !isDisabled && setSelectedMethod(method.id)}
                        style={{
                          border: selectedMethod === method.id
                            ? '2px solid #fbbf24'
                            : isDisabled
                            ? '2px solid #e5e7eb'
                            : '2px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: (processing || isDisabled) ? 'not-allowed' : 'pointer',
                          backgroundColor: selectedMethod === method.id
                            ? '#fffbeb'
                            : isDisabled
                            ? '#f9fafb'
                            : '#ffffff',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          opacity: (processing || isDisabled) ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!processing && selectedMethod !== method.id && !isDisabled) {
                            e.currentTarget.style.borderColor = '#d1d5db';
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!processing && selectedMethod !== method.id && !isDisabled) {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: selectedMethod === method.id
                              ? method.color
                              : '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: selectedMethod === method.id ? '#ffffff' : method.color,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {method.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: isDisabled ? '#9ca3af' : '#1f2937',
                              marginBottom: '2px',
                            }}
                          >
                            {method.name}
                            {isDisabled && ' (Không đủ số dư)'}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: isDisabled ? '#9ca3af' : '#6b7280',
                            }}
                          >
                            {method.description}
                          </div>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle size={20} color="#10b981" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processing || !hasEnoughBalance}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: (processing || !hasEnoughBalance) ? '#d1d5db' : '#fbbf24',
                  color: (processing || !hasEnoughBalance) ? '#9ca3af' : '#1f2937',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: (processing || !hasEnoughBalance) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  if (!processing) {
                    e.target.style.backgroundColor = '#f59e0b';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!processing) {
                    e.target.style.backgroundColor = '#fbbf24';
                    e.target.style.transform = '';
                    e.target.style.boxShadow = '';
                  }
                }}
              >
                {processing ? (
                  <>
                    <span
                      className="spinner"
                      style={{
                        display: 'inline-block',
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(31, 41, 55, 0.3)',
                        borderTopColor: '#1f2937',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    ></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Thanh toán {packagePrice.toLocaleString('vi-VN')}đ
                  </>
                )}
              </button>

              {/* Security Note */}
              <div
                style={{
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Lock size={14} color="#3b82f6" />
                <span
                  style={{
                    fontSize: '11px',
                    color: '#1e40af',
                    lineHeight: '1.4',
                  }}
                >
                  Giao dịch được mã hóa và bảo mật. Thông tin thanh toán của bạn được bảo vệ.
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

