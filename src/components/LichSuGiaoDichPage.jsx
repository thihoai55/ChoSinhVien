import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { ArrowLeft, ClockHistory, ArrowDownCircle, ArrowUpCircle, CheckCircle, XCircle, CreditCard, Wallet2, QrCode } from 'react-bootstrap-icons';

export default function LichSuGiaoDichPage({ onNavigate, onBack }) {
    const { user } = useAuth();
    const { balance, transactions } = useWallet();
    const [filterType, setFilterType] = useState('all'); // 'all' | 'recharge' | 'payment'

    // Lọc giao dịch theo type
    const filteredTransactions = filterType === 'all' 
        ? transactions 
        : transactions.filter(t => t.type === filterType);

    // Sắp xếp theo thời gian (mới nhất trước)
    const sortedTransactions = [...filteredTransactions].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Lấy icon cho phương thức thanh toán
    const getPaymentMethodIcon = (method) => {
        const normalized = method?.toLowerCase() || '';
        switch (normalized) {
            case 'vnpay':
                return <CreditCard size={18} color="#0052a5" />;
            case 'momo':
                return <Wallet2 size={18} color="#a50064" />;
            case 'zalopay':
            case 'qr':
            case 'qr code':
                return <QrCode size={18} color="#10b981" />;
            default:
                return <CreditCard size={18} color="#6b7280" />;
        }
    };

    const styles = {
        page: {
            minHeight: '100vh',
            background: '#f8fafc',
            padding: '32px 16px',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        container: {
            maxWidth: '1000px',
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '16px 18px',
            marginTop: '20px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e5e7eb',
        },
        filterTabs: {
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            background: '#f9fafb',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
        },
        filterTab: (isActive) => ({
            flex: 1,
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            background: isActive ? '#3b82f6' : 'transparent',
            color: isActive ? '#fff' : '#6b7280',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
        }),
        transactionList: {
            padding: '24px 32px 32px',
        },
        transactionItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            background: '#fff',
            marginBottom: '12px',
            transition: 'all 0.2s ease',
        },
        emptyState: {
            textAlign: 'center',
            padding: '60px 24px',
            color: '#6b7280',
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
                                <ClockHistory size={24} color="#3b82f6" />
                            </div>
                            <div>
                                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>
                                    Lịch sử giao dịch
                                </h1>
                                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                                    Xem tất cả các giao dịch của bạn
                                </p>
                            </div>
                        </div>

                        {/* Balance Card */}
                        <div style={styles.balanceCard}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '999px',
                                    background: '#eff6ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #dbeafe'
                                }}>
                                    <Wallet2 size={20} color="#2563eb" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '2px' }}>
                                        Số dư hiện tại
                                    </div>
                                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                                        {balance.toLocaleString('vi-VN')}đ
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>
                                <div>Theo dõi chi tiết tất cả giao dịch nạp tiền và thanh toán.</div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div style={{ padding: '24px 32px 0' }}>
                        <div style={styles.filterTabs}>
                            <button
                                style={styles.filterTab(filterType === 'all')}
                                onClick={() => setFilterType('all')}
                                onMouseEnter={(e) => {
                                    if (filterType !== 'all') {
                                        e.currentTarget.style.background = '#f3f4f6';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (filterType !== 'all') {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                Tất cả ({transactions.length})
                            </button>
                            <button
                                style={styles.filterTab(filterType === 'recharge')}
                                onClick={() => setFilterType('recharge')}
                                onMouseEnter={(e) => {
                                    if (filterType !== 'recharge') {
                                        e.currentTarget.style.background = '#f3f4f6';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (filterType !== 'recharge') {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                Nạp tiền ({transactions.filter(t => t.type === 'recharge').length})
                            </button>
                            <button
                                style={styles.filterTab(filterType === 'payment')}
                                onClick={() => setFilterType('payment')}
                                onMouseEnter={(e) => {
                                    if (filterType !== 'payment') {
                                        e.currentTarget.style.background = '#f3f4f6';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (filterType !== 'payment') {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                Thanh toán ({transactions.filter(t => t.type === 'payment').length})
                            </button>
                        </div>
                    </div>

                    {/* Transaction List */}
                    <div style={styles.transactionList}>
                        {sortedTransactions.length === 0 ? (
                            <div style={styles.emptyState}>
                                <ClockHistory size={64} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                                <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    Chưa có giao dịch nào
                                </p>
                                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                    {filterType === 'all' 
                                        ? 'Bạn chưa thực hiện giao dịch nào' 
                                        : `Chưa có giao dịch ${filterType === 'recharge' ? 'nạp tiền' : 'thanh toán'} nào`}
                                </p>
                            </div>
                        ) : (
                            sortedTransactions.map((transaction) => {
                                const isRecharge = transaction.type === 'recharge';
                                const isSuccess = transaction.status === 'success';
                                
                                return (
                                    <div
                                        key={transaction.id}
                                        style={{
                                            ...styles.transactionItem,
                                            borderLeft: `4px solid ${isRecharge ? '#10b981' : '#3b82f6'}`,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        {/* Icon */}
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: isRecharge ? '#ecfdf5' : '#eff6ff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: `1px solid ${isRecharge ? '#d1fae5' : '#dbeafe'}`,
                                        }}>
                                            {isRecharge ? (
                                                <ArrowDownCircle size={24} color="#10b981" />
                                            ) : (
                                                <ArrowUpCircle size={24} color="#3b82f6" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
                                                    {transaction.description}
                                                </span>
                                                {isSuccess ? (
                                                    <CheckCircle size={16} color="#10b981" />
                                                ) : (
                                                    <XCircle size={16} color="#ef4444" />
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7280' }}>
                                                    {getPaymentMethodIcon(transaction.paymentMethod)}
                                                    <span>{transaction.paymentMethod || 'Nội bộ'}</span>
                                                </div>
                                                <span style={{ fontSize: '13px', color: '#9ca3af' }}>•</span>
                                                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                                                    {transaction.createdAt || new Date(transaction.timestamp).toLocaleString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Amount & Balance */}
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{
                                                fontSize: '18px',
                                                fontWeight: 700,
                                                color: isRecharge ? '#10b981' : '#ef4444',
                                                marginBottom: '4px',
                                            }}>
                                                {isRecharge ? '+' : '-'}{Math.abs(transaction.amount).toLocaleString('vi-VN')}đ
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                                Số dư: {transaction.balance.toLocaleString('vi-VN')}đ
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

