import React, { useState, useEffect } from 'react';
import { usePosts } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import RatingSellerModal from './RatingSellerModal';

export default function RatingSellersPage({ onNavigate }) {
  const { user } = useAuth();
  const { posts = [], getUserTransactions, addRating, getSellerAverageRating, getSellerRatings } = usePosts();
  const { addNotification } = useNotifications();
  const [sellersList, setSellersList] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    // Get all transactions where user is buyer
    const userTransactions = getUserTransactions?.(user?.id) || [];
    
    // Get sellers from approved transactions with actual user data from posts
    const sellers = new Map();
    userTransactions.forEach((txn) => {
      if (String(txn.buyerId) === String(user?.id) && txn.status === 'approved') {
        // Avoid duplicates
        if (!sellers.has(txn.sellerId)) {
          // Try to find seller info from posts (to get avatar and accurate name)
          const sellerPosts = posts.filter(p => String(p.authorId) === String(txn.sellerId));
          const sellerPost = sellerPosts[0];
          
          sellers.set(txn.sellerId, {
            id: txn.sellerId,
            name: txn.sellerName || sellerPost?.authorName || 'Người bán',
            avatar: txn.sellerAvatar || sellerPost?.authorAvatar || '',
          });
        }
      }
    });

    setSellersList(Array.from(sellers.values()));
  }, [user?.id, getUserTransactions, posts]);

  const handleRatingSeller = (seller) => {
    setSelectedSeller(seller);
    setShowRatingModal(true);
  };

  const handleConfirmRating = (ratingData) => {
    try {
      // Add rating to context
      addRating?.(selectedSeller.id, ratingData);
      
      // Send notification to the seller being rated
      addNotification(selectedSeller.id, {
        type: 'seller_rating',
        fromUserId: user?.id,
        fromUserName: user?.name,
        fromUserAvatar: user?.avatar,
        rating: ratingData.rating,
        review: ratingData.review,
        message: `${user?.name || 'Một người dùng'} đã đánh giá bạn ${ratingData.rating} sao: "${ratingData.review}"`,
      });
      
      setShowRatingModal(false);
      setSelectedSeller(null);
      // Show success notification
      alert('Cảm ơn bạn đã đánh giá! Người bán sẽ nhận được thông báo của bạn.');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Lỗi khi gửi đánh giá. Vui lòng thử lại.');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      {/* Back button */}
      <button
        onClick={() => onNavigate?.('user-profile', user?.id)}
        style={{
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          border: 'none',
          background: '#f3f4f6',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 500,
          color: '#374151',
        }}
      >
        <i className="bi bi-arrow-left" style={{ fontSize: 16 }}></i>
        Quay lại
      </button>

      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: 0, marginBottom: 8 }}>
          Đánh giá người bán
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
          Chia sẻ trải nghiệm của bạn với những người bán mà bạn đã mua hàng
        </p>
      </div>

      {/* Sellers List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        {sellersList.length === 0 ? (
          <div
            style={{
              padding: 40,
              background: '#f9fafb',
              borderRadius: 12,
              textAlign: 'center',
              border: '1px dashed #e5e7eb',
            }}
          >
            <i className="bi bi-inbox" style={{ fontSize: 40, color: '#d1d5db', marginBottom: 16, display: 'block' }}></i>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
              Bạn chưa có giao dịch nào để đánh giá. Hãy mua hàng và đánh giá người bán!
            </p>
          </div>
        ) : (
          sellersList.map((seller) => {
            const avgRating = getSellerAverageRating?.(seller.id) || 0;
            const totalRatings = getSellerRatings?.(seller.id)?.length || 0;

            return (
              <div
                key={seller.id}
                style={{
                  padding: 20,
                  borderRadius: 12,
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af',
                      fontSize: 24,
                    }}
                  >
                    {seller.avatar ? (
                      <img src={seller.avatar} alt={seller.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <i className="bi bi-person-fill"></i>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 4 }}>
                      {seller.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 2, color: '#fbbf24' }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ opacity: i < Math.floor(avgRating) ? 1 : 0.3 }}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>
                        {avgRating > 0 ? `${avgRating} (${totalRatings} đánh giá)` : 'Chưa có đánh giá'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRatingSeller(seller)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(90deg,#f59e0b,#f97316)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                    marginLeft: 16,
                  }}
                >
                  Đánh giá
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingSellerModal
          seller={selectedSeller}
          onConfirm={handleConfirmRating}
          onCancel={() => {
            setShowRatingModal(false);
            setSelectedSeller(null);
          }}
        />
      )}
    </div>
  );
}
