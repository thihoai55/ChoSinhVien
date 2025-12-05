import React, { useState } from 'react';

export default function RatingSellerModal({ seller, onConfirm, onCancel }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState(null);

  const handleConfirm = () => {
    if (!review.trim()) {
      alert('Vui lòng nhập đánh giá của bạn');
      return;
    }
    onConfirm({
      rating,
      review: review.trim(),
      sellerId: seller?.id,
      sellerName: seller?.name,
    });
    setRating(5);
    setReview('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          maxWidth: 500,
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Seller Info */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {seller?.avatar ? (
              <img src={seller.avatar} alt={seller.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <i className="bi bi-person-fill" style={{ fontSize: 32, color: '#9ca3af' }}></i>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, marginBottom: 4 }}>
              Đánh giá người bán
            </h2>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0, marginBottom: 2 }}>
              {seller?.name || 'Người bán'}
            </p>
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
              Chia sẻ trải nghiệm của bạn
            </p>
          </div>
        </div>

        {/* Star Rating */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            Đánh giá
          </label>
          <div style={{ display: 'flex', gap: 12, fontSize: 40 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 40,
                  padding: 0,
                  opacity: (hoveredStar || rating) >= star ? 1 : 0.3,
                  transition: 'all 0.2s ease',
                  color: (hoveredStar || rating) >= star ? '#fbbf24' : '#d1d5db',
                }}
              >
                ★
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8, margin: 0 }}>
            {rating === 5 && 'Tuyệt vời!'}
            {rating === 4 && 'Rất tốt'}
            {rating === 3 && 'Bình thường'}
            {rating === 2 && 'Chưa tốt'}
            {rating === 1 && 'Không hài lòng'}
          </p>
        </div>

        {/* Review Text */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            Nhận xét của bạn
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn với người bán..."
            style={{
              width: '100%',
              minHeight: 100,
              padding: 12,
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
              color: '#111827',
            }}
          />
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4, margin: 0 }}>
            {review.length}/300 ký tự
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#374151',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#f3f4f6')}
            onMouseLeave={(e) => (e.target.style.background = '#fff')}
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(90deg,#f59e0b,#f97316)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.target.boxShadow = '0 8px 20px rgba(245,158,11,0.3)')}
            onMouseLeave={(e) => (e.target.boxShadow = 'none')}
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}
