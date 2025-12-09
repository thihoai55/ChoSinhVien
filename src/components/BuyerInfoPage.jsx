import React, { useEffect, useState, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { useChat } from '../contexts/ChatContext';
import BankTransferModal from './BankTransferModal';

export default function BuyerInfoPage({ onNavigate, onBack }) {
  const { notifications = [], markAsRead, markAllAsRead, addNotification } = useNotifications();
  const { user } = useAuth();
  const { posts = [], transactions = [], approvePurchaseTransaction, markAsSold, updatePost, updateTransactionBankInfo } = usePosts() || {};
  const { openChatWith } = useChat() || {};

  const [selectedNotifyId, setSelectedNotifyId] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [viewMode, setViewMode] = useState('requests'); // 'requests' | 'history'
  const [showBankModal, setShowBankModal] = useState(false);
  const [pendingBankTransaction, setPendingBankTransaction] = useState(null);
  const containerRef = useRef(null);

  // Lấy các giao dịch liên quan tới người bán (current user)
  const sellerTransactions = transactions.filter((t) => String(t.sellerId) === String(user?.id));
  // Consider 'awaiting_payment' as part of requests so seller still sees requests waiting for buyer transfer
  const pendingTransactions = sellerTransactions.filter((t) => t.status === 'pending' || t.status === 'awaiting_payment');
  const historyTransactions = sellerTransactions.filter((t) => t.status === 'approved' || t.status === 'completed');

  const handleApprovePurchase = (notifyId, transactionId, postId) => {
    try {
      const transaction = transactions.find(t => String(t.id) === String(transactionId));
      
      // Check if payment method is bank transfer
      if (transaction?.buyerInfo?.paymentMethod === 'bank_transfer') {
        // Show bank transfer modal instead of immediate approval
        setPendingBankTransaction({ notifyId, transactionId, postId });
        setShowBankModal(true);
        return;
      }

      // For cash_on_delivery, approve immediately
      finishApproval(notifyId, transactionId, postId);
    } catch (error) {
      console.error('Error approving purchase:', error);
    }
  };

  const finishApproval = (notifyId, transactionId, postId) => {
    try {
      console.log('Approving purchase:', { notifyId, transactionId, postId });
      
      // Approve transaction and get affected txs back
      const res = approvePurchaseTransaction?.(transactionId, postId) || {};
      const approvedTx = res.approvedTx;
      const cancelledTxs = res.cancelledTxs || [];

      // Mark post as sold (attach approved buyer if available)
      if (approvedTx) {
        markAsSold?.(postId, { buyerId: approvedTx.buyerId, buyerName: approvedTx.buyerName || approvedTx.buyerInfo?.name, buyerAvatar: approvedTx.buyerAvatar || approvedTx.buyerInfo?.avatar });
      } else {
        markAsSold?.(postId, null);
      }

      // Update post to change status/move to sold tab
      const post = posts.find(p => String(p.id) === String(postId));
      if (post) {
        updatePost?.(postId, { sold: true, soldTimestamp: new Date().toISOString() });
        console.log('Post updated to sold:', postId);
      }

      // Notify approved buyer
      if (approvedTx && approvedTx.buyerId) {
        addNotification(approvedTx.buyerId, {
          type: 'purchase_approved',
          postId: postId,
          transactionId: approvedTx.id,
          message: `Yêu cầu mua của bạn cho "${post?.title || ''}" đã được chủ bài đăng chấp nhận.`,
        });
      }

      // Notify cancelled buyers
      cancelledTxs.forEach((txn) => {
        if (txn.buyerId) {
          addNotification(txn.buyerId, {
            type: "purchase_cancelled",
            postId: postId,
            transactionId: txn.id,
            postTitle: post?.title,
            message: `Yêu cầu mua hàng của bạn cho "${post?.title}" đã bị hủy. Bài đăng này đã được bán cho người khác.`,
          });
        }
      });

      markAsRead?.(notifyId);

      // Switch to history view and focus the approved transaction
      if (approvedTx) {
        setViewMode('history');
        setSelectedTransactionId(approvedTx.id);
      }
      console.log('Purchase approved successfully');
    } catch (error) {
      console.error('Error in finishApproval:', error);
    }
  };

  const handleBankTransferConfirm = (bankTransferInfo) => {
    try {
      if (!pendingBankTransaction) return;

      const { notifyId, transactionId, postId } = pendingBankTransaction;
      const transaction = transactions.find(t => String(t.id) === String(transactionId));
      const post = posts.find(p => String(p.id) === String(postId));

      // Update transaction with bank transfer info and mark as approved
      updateTransactionBankInfo?.(transactionId, bankTransferInfo);

      // Notify buyer with payment transfer info
      if (transaction?.buyerId) {
        addNotification(transaction.buyerId, {
          type: 'payment_transfer_info',
          transactionId: transactionId,
          postId: postId,
          bankTransferInfo: bankTransferInfo,
          message: `Chủ bài đăng "${post?.title || ''}" đã gửi thông tin chuyển khoản. Vui lòng kiểm tra chi tiết.`,
        });
      }

      // Mark notification as read
      markAsRead?.(notifyId);

      // Close bank transfer modal and keep in requests until buyer confirms payment
      setShowBankModal(false);
      setPendingBankTransaction(null);

      // Do NOT move to history here; wait for buyer to confirm payment.
      console.log('Bank transfer info saved and buyer notified (awaiting buyer payment)');
    } catch (error) {
      console.error('Error handling bank transfer confirmation:', error);
    }
  };

  // Nếu truy cập từ notification (header), sessionStorage có thể chứa focus info
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem('sv_buyer_nav');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.notifyId) {
        // Find the notification to extract transactionId
        const notify = notifications.find((x) => x.id === parsed.notifyId);
        if (notify && notify.transactionId) {
          setSelectedTransactionId(notify.transactionId);
          setViewMode('requests');
        }
        // mark as read
        markAsRead?.(parsed.notifyId);
        // remove key so next open not auto-focus
        window.sessionStorage.removeItem('sv_buyer_nav');
      }
    } catch (e) {}
  }, [markAsRead, notifications]);

  useEffect(() => {
    const id = selectedTransactionId;
    if (!id || !containerRef.current) return;
    const el = document.getElementById(`txn-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.boxShadow = '0 8px 30px rgba(37,99,235,0.14)';
      setTimeout(() => (el.style.boxShadow = ''), 2200);
    }
  }, [selectedTransactionId]);

  const handleContactBuyer = (buyerId, postId) => {
    if (!user) return; // need login
    if (openChatWith) openChatWith(buyerId);
    // navigate to post if provided
    if (postId) onNavigate?.('post-detail', postId);
  };

  return (
    <div style={{ minHeight: '100vh', padding: 24, background: '#f3f7fb' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}>
          <button
            onClick={() => onBack?.()}
            style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer', fontSize: 14 }}
          >
            ← Quay lại
          </button>
          <h2 style={{ margin: 0, fontSize: 20 }}>Thông tin người mua</h2>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => markAllAsRead && markAllAsRead()}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}
            >
              Đánh dấu đã đọc tất cả
            </button>
          </div>
        </div>

        <div ref={containerRef} style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => setViewMode('requests')}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: viewMode === 'requests' ? '1px solid #2563eb' : '1px solid #e5e7eb',
                background: viewMode === 'requests' ? '#eef2ff' : '#fff',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Yêu cầu mua
            </button>
            <button
              onClick={() => setViewMode('history')}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: viewMode === 'history' ? '1px solid #2563eb' : '1px solid #e5e7eb',
                background: viewMode === 'history' ? '#eef2ff' : '#fff',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Lịch sử bán hàng
            </button>
          </div>

          {(viewMode === 'requests' ? pendingTransactions : historyTransactions).length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#6b7280', background: '#fff', borderRadius: 10 }}>
              {viewMode === 'requests' ? 'Không có yêu cầu mua nào.' : 'Không có lịch sử bán hàng.'}
            </div>
          )}

          {(viewMode === 'requests' ? pendingTransactions : historyTransactions).map((transaction) => {
            const n = notifications.find((x) => String(x.transactionId) === String(transaction.id)) || {};
            const post = posts.find((p) => String(p.id) === String(transaction.postId)) || {};
            const isSelected = String(transaction.id) === String(selectedTransactionId);
            const buyerInfo = transaction.buyerInfo || {};
            const statusBadge = transaction.status || 'pending';
            const isAlreadyApproved = statusBadge === 'approved';

            return (
              <div
                id={`txn-${transaction.id}`}
                key={transaction.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  padding: 16,
                  borderRadius: 12,
                  background: isSelected ? '#ffffff' : '#fff',
                  boxShadow: isSelected ? '0 8px 30px rgba(37,99,235,0.06)' : '0 4px 12px rgba(15,23,42,0.04)',
                  border: n.read ? '1px solid #e6eef3' : '2px solid #2563eb',
                }}
              >
                {/* Header: Avatar + Buyer name + Time */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {n.buyerAvatar ? (
                      <img src={n.buyerAvatar} alt={n.buyerName} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
                    ) : (
                      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#eef2f7' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>{n.buyerName || 'Người mua'}</div>
                      <span style={{ background: isAlreadyApproved ? '#d1fae5' : '#fef3c7', color: isAlreadyApproved ? '#065f46' : '#92400e', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                        {isAlreadyApproved ? '✓ Đã duyệt' : 'Chờ xét duyệt'}
                      </span>
                    </div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>{new Date(n.time).toLocaleString()}</div>
                  </div>
                </div>

                {/* Buyer Info Section */}
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thông tin người mua</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 3 }}>Tên</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{buyerInfo.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 3 }}>Điện thoại</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{buyerInfo.phone || 'N/A'}</div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 3 }}>Địa chỉ giao hàng</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{buyerInfo.address || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 3 }}>Số lượng</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{buyerInfo.quantity || 1}</div>
                    </div>
                  </div>
                  {buyerInfo.note && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 3 }}>Ghi chú</div>
                      <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{buyerInfo.note}</div>
                    </div>
                  )}
                </div>

                {/* Post Info Section */}
                <div style={{ display: 'flex', gap: 12, padding: 12, background: '#f1fdf9', borderRadius: 10, border: '1px solid #d1fae5', alignItems: 'center' }}>
                  <img src={(post.images && post.images[0]) || post.image || ''} alt={post.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, background: '#f8fafc' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Bài đăng</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 4 }}>{post.title || '—'}</div>
                    <div style={{ color: '#10b981', fontWeight: 700 }}>{post.price || ''}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      if (n && n.id) markAsRead?.(n.id);
                      if (transaction.postId) onNavigate?.('post-detail', transaction.postId);
                    }}
                    style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Xem bài đăng
                  </button>
                  <button
                    onClick={() => handleContactBuyer(transaction.buyerId, transaction.postId)}
                    style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: '#06b6d4', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Liên hệ
                  </button>
                  {!isAlreadyApproved && (
                    <button
                      onClick={() => {
                        console.log('Approve button clicked with:', { notifyId: n.id, transactionId: transaction.id, postId: transaction.postId });
                        handleApprovePurchase(n.id, transaction.id, transaction.postId);
                      }}
                      style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: 'linear-gradient(90deg,#10b981,#059669)', color: '#fff', cursor: 'pointer', fontWeight: 600, marginLeft: 'auto' }}
                    >
                      ✓ Đồng ý mua hàng
                    </button>
                  )}
                  {isAlreadyApproved && (
                    <div style={{ marginLeft: 'auto', padding: '10px 12px', borderRadius: 10, background: '#d1fae5', color: '#065f46', fontWeight: 600 }}>
                      ✓ Đã xác nhận
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bank Transfer Modal */}
      {showBankModal && pendingBankTransaction && (
        <BankTransferModal
          post={posts.find(p => String(p.id) === String(pendingBankTransaction.postId)) || {}}
          transaction={transactions.find(t => String(t.id) === String(pendingBankTransaction.transactionId)) || {}}
          onClose={() => {
            setShowBankModal(false);
            setPendingBankTransaction(null);
          }}
          onConfirm={handleBankTransferConfirm}
        />
      )}
    </div>
  );
}
