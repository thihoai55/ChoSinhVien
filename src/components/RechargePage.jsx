import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { ArrowLeft, CreditCard, Wallet2, QrCode, CheckCircle, Lock } from 'react-bootstrap-icons';

export default function RechargePage({ onNavigate, onBack }) {
    const { user } = useAuth();
    const { balance, recharge } = useWallet();
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('vnpay');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [rechargedAmount, setRechargedAmount] = useState(0);

    // Các mức nạp tiền đề xuất
    const suggestedAmounts = [50000, 100000, 200000, 500000, 1000000];

    // Phương thức thanh toán
    const paymentMethods = [
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
            id: 'zalo',
            name: 'ZaloPay',
            icon: <QrCode size={24} />,
            description: 'Quét mã QR để thanh toán',
            color: '#10b981'
        }
    ];

    // Xử lý nạp tiền
    const handleRecharge = async () => {
        const amount = selectedAmount || parseFloat(customAmount);
        
        if (!amount || amount <= 0) {
            alert('Vui lòng chọn hoặc nhập số tiền hợp lệ');
            return;
        }

        if (amount < 10000) {
            alert('Số tiền nạp tối thiểu là 10,000đ');
            return;
        }

        setProcessing(true);

        // Giả lập quá trình thanh toán
        setTimeout(() => {
            setProcessing(false);
            const success = recharge(amount, paymentMethods.find(m => m.id === selectedMethod)?.name || 'VNPay');
            
            if (success) {
                setRechargedAmount(amount);
                setSuccess(true);
                
                // Reset form sau 2 giây
                setTimeout(() => {
                    setSuccess(false);
                    setSelectedAmount(null);
                    setCustomAmount('');
                    setRechargedAmount(0);
                }, 3000);
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        }, 2000);
    };

    // Tính tổng tiền sẽ nạp
    const totalAmount = selectedAmount || parseFloat(customAmount) || 0;

    const styles = {
        page: {
            minHeight: '100vh',
            background: '#f8fafc',
            padding: '32px 16px',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        container: {
            maxWidth: '900px',
            margin: '0 auto',
        },
        card: {
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
        },
        header: {
            background: '#fff',
            padding: '32px 32px 24px',
            borderBottom: '1px solid #e5e7eb',
        },
        backButton: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#374151',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '20px',
            transition: 'all 0.2s ease',
        },
        balanceCard: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '20px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
            border: '1px solid #3b82f6',
        },
        section: {
            padding: '32px',
            paddingTop: '24px',
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '20px',
            marginTop: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        amountGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
        },
        amountButton: (isSelected) => ({
            padding: '14px 16px',
            borderRadius: '10px',
            border: isSelected ? '2px solid #3b82f6' : '2px solid #e5e7eb',
            background: isSelected ? '#eff6ff' : '#fff',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            fontWeight: 600,
            color: isSelected ? '#3b82f6' : '#1f2937',
            fontSize: '15px',
            boxShadow: isSelected ? '0 2px 8px rgba(59, 130, 246, 0.15)' : 'none',
        }),
        customInput: {
            width: '100%',
            maxWidth: '100%',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '2px solid #e5e7eb',
            fontSize: '15px',
            fontWeight: 600,
            outline: 'none',
            transition: 'all 0.2s ease',
            background: '#fff',
            boxSizing: 'border-box',
        },
        methodCard: (isSelected, methodColor) => ({
            border: isSelected ? `2px solid ${methodColor}` : '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            background: isSelected ? '#f9fafb' : '#fff',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none',
        }),
        submitButton: {
            width: '100%',
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
        },
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.card}>
                    {/* Header */}
                    <div style={styles.header}>
                        <button
                            style={styles.backButton}
                            onClick={onBack || (() => onNavigate('home'))}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f3f4f6';
                                e.currentTarget.style.borderColor = '#d1d5db';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f9fafb';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            <ArrowLeft size={18} />
                            Quay lại
                        </button>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: '#eff6ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #dbeafe'
                            }}>
                                <Wallet2 size={24} color="#3b82f6" />
                            </div>
                            <div>
                                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>
                                    Nạp tiền vào tài khoản
                                </h1>
                                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                                    Nạp tiền nhanh chóng và an toàn
                                </p>
                            </div>
                        </div>

                        {/* Balance Card */}
                        <div style={styles.balanceCard}>
                            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Wallet2 size={16} color="#fff" />
                                Số dư hiện tại
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>
                                {balance.toLocaleString('vi-VN')}đ
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {success ? (
                        <div style={{ ...styles.section, textAlign: 'center', padding: '60px 24px' }}>
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: '#10b981',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 24px',
                                }}
                            >
                                <CheckCircle size={40} color="#fff" />
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>
                                Nạp tiền thành công!
                            </h2>
                            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '16px' }}>
                                Bạn đã nạp thành công {rechargedAmount.toLocaleString('vi-VN')}đ
                            </p>
                            <p style={{ fontSize: '18px', fontWeight: 600, color: '#3b82f6' }}>
                                Số dư mới: {(balance + rechargedAmount).toLocaleString('vi-VN')}đ
                            </p>
                        </div>
                    ) : (
                        <div style={styles.section}>
                            {/* Chọn số tiền */}
                            <div>
                                <h3 style={styles.sectionTitle}>
                                    <CreditCard size={20} color="#3b82f6" />
                                    Chọn số tiền nạp
                                </h3>
                                <div style={styles.amountGrid}>
                                    {suggestedAmounts.map((amount) => (
                                        <button
                                            key={amount}
                                            style={styles.amountButton(selectedAmount === amount)}
                                            onClick={() => {
                                                setSelectedAmount(amount);
                                                setCustomAmount('');
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedAmount !== amount) {
                                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedAmount !== amount) {
                                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                                }
                                            }}
                                        >
                                            {amount.toLocaleString('vi-VN')}đ
                                        </button>
                                    ))}
                                </div>
                                
                                <div style={{ marginTop: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                        Hoặc nhập số tiền khác
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Nhập số tiền (tối thiểu 10,000đ)"
                                        value={customAmount}
                                        onChange={(e) => {
                                            setCustomAmount(e.target.value);
                                            setSelectedAmount(null);
                                        }}
                                        style={styles.customInput}
                                        min="10000"
                                        step="1000"
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = '#3b82f6';
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Chọn phương thức thanh toán */}
                            <div style={{ marginTop: '32px' }}>
                                <h3 style={styles.sectionTitle}>
                                    <QrCode size={20} color="#3b82f6" />
                                    Phương thức thanh toán
                                </h3>
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => !processing && setSelectedMethod(method.id)}
                                        style={styles.methodCard(selectedMethod === method.id, method.color)}
                                        onMouseEnter={(e) => {
                                            if (!processing && selectedMethod !== method.id) {
                                                e.currentTarget.style.borderColor = '#cbd5e1';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!processing && selectedMethod !== method.id) {
                                                e.currentTarget.style.borderColor = '#e5e7eb';
                                            }
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                background: selectedMethod === method.id ? method.color : '#f3f4f6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: selectedMethod === method.id ? '#fff' : method.color,
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {method.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
                                                {method.name}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                                {method.description}
                                            </div>
                                        </div>
                                        {selectedMethod === method.id && (
                                            <CheckCircle size={24} color={method.color} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Tổng thanh toán */}
                            {totalAmount > 0 && (
                                <div
                                    style={{
                                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        marginTop: '28px',
                                        border: '2px solid #bfdbfe',
                                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                background: '#3b82f6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <CreditCard size={18} color="#fff" />
                                            </div>
                                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#1e40af' }}>
                                                Tổng thanh toán:
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '24px', fontWeight: 700, color: '#1e40af' }}>
                                            {totalAmount.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Nút nạp tiền */}
                            <button
                                onClick={handleRecharge}
                                disabled={processing || totalAmount <= 0}
                                style={{
                                    ...styles.submitButton,
                                    marginTop: '28px',
                                    opacity: (processing || totalAmount <= 0) ? 0.6 : 1,
                                    cursor: (processing || totalAmount <= 0) ? 'not-allowed' : 'pointer',
                                }}
                                onMouseEnter={(e) => {
                                    if (!processing && totalAmount > 0) {
                                        e.currentTarget.style.background = '#2563eb';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!processing && totalAmount > 0) {
                                        e.currentTarget.style.background = '#3b82f6';
                                        e.currentTarget.style.transform = '';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.2)';
                                    }
                                }}
                            >
                                {processing ? (
                                    <>
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                                borderTopColor: '#fff',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite',
                                            }}
                                        />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={20} />
                                        Nạp {totalAmount > 0 ? totalAmount.toLocaleString('vi-VN') + 'đ' : 'tiền'}
                                    </>
                                )}
                            </button>

                            {/* Bảo mật */}
                            <div
                                style={{
                                    marginTop: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    justifyContent: 'center',
                                    padding: '12px',
                                    background: '#f9fafb',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                }}
                            >
                                <Lock size={14} color="#3b82f6" />
                                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                    Giao dịch được mã hóa và bảo mật
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

