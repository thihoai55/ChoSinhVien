import { useState, useRef } from 'react';
import { 
  CardText, GeoAlt, Tag, Upload, 
  CheckCircle, CartPlus, CurrencyDollar, 
  StarFill, ShieldCheck, LightningCharge
} from 'react-bootstrap-icons';
import AddressSelector from './AddressSelector';
import { PRICING_PACKAGES } from '../data/pricingPackages';

export default function CreatePostForm({ 
  postType, 
  setPostType, 
  title, 
  setTitle, 
  content, 
  setContent, 
  price, 
  setPrice, 
  condition, 
  setCondition, 
  location, 
  setLocation, 
  files, 
  setFiles, 
  selectedPackage, 
  setSelectedPackage,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  errors,
  setErrors,
  submitting,
  onSubmit,
  onBack,
  // Props cho edit mode và repost mode
  isEditMode = false,
  isRepostMode = false,
  existingImages = [],
  existingVideos = [],
  removeExistingImage,
  removeExistingVideo,
}) {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Helper functions for colors
  const getFocusColor = () => {
    return postType === 'sell' ? '#fbbf24' : '#93c5fd';
  };

  const getFocusShadow = () => {
    return postType === 'sell' 
      ? '0 0 0 3px rgba(251, 191, 36, 0.2)' 
      : '0 0 0 3px rgba(147, 197, 253, 0.2)';
  };

  const getIconFocusColor = () => {
    return postType === 'sell' ? '#f59e0b' : '#60a5fa';
  };

  // File upload handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file =>
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles].slice(0, 10));
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Styles
  const inputStyle = {
    width: '100%',
    padding: '8px 12px 8px 40px',
    borderRadius: '8px',
    border: '2px solid #d1d5db',
    fontSize: '15px',
    boxSizing: 'border-box',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    position: 'relative',
    textAlign: 'left',
  };

  const sectionTitle = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s ease',
    paddingLeft: '4px',
    letterSpacing: '0.01em',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        {/* Header */}
        <div
          style={{
            borderBottom: postType === 'buy' ? '1px solid #f1f5f9' : '2px solid #fbbf24',
            padding: '0 0 12px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            backgroundColor: postType === 'sell' ? '#fffbeb' : 'transparent',
            padding: postType === 'sell' ? '12px' : '0 0 12px',
            borderRadius: postType === 'sell' ? '8px' : '0',
            border: postType === 'sell' ? '1px solid #fde68a' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {postType === 'buy' ? (
              <CartPlus size={20} color="#2563eb" />
            ) : (
              <div style={{ position: 'relative' }}>
                <CurrencyDollar size={20} color="#f59e0b" />
                <StarFill 
                  size={10} 
                  color="#fbbf24" 
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                  }}
                />
              </div>
            )}
            <h1
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: postType === 'buy' ? '#2563eb' : '#f59e0b',
                margin: 0,
                lineHeight: '1.3'
              }}
            >
              {postType === 'buy' ? 'ĐĂNG TIN CẦN MUA' : 'ĐĂNG TIN CẦN BÁN'}
            </h1>
            {postType === 'sell' && (
              <div
                style={{
                  backgroundColor: '#fbbf24',
                  color: '#1f2937',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: 'auto',
                }}
              >
                <ShieldCheck size={12} />
                <span>PREMIUM</span>
              </div>
            )}
          </div>
          <p
            style={{
              color: postType === 'buy' ? '#64748b' : '#92400e',
              fontSize: '12px',
              margin: 0,
              paddingLeft: '30px',
              lineHeight: '1.4',
              fontWeight: postType === 'sell' ? '500' : '400'
            }}
          >
            {postType === 'buy'
              ? 'Mô tả chi tiết sản phẩm bạn đang cần mua - Hoàn toàn miễn phí'
              : 'Mô tả chi tiết sản phẩm bạn muốn bán - Đăng bài có phí để tiếp cận nhiều người mua hơn'}
          </p>
        </div>

        {/* Premium Package Selection - Hiển thị động từ PRICING_PACKAGES */}
        {postType === 'sell' && (
          <div
            style={{
              backgroundColor: '#fef3c7',
              border: '2px solid #fbbf24',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <LightningCharge size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#92400e', margin: 0 }}>
                Chọn gói đăng bài
              </h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {/* Render các gói từ PRICING_PACKAGES */}
              {Object.entries(PRICING_PACKAGES).map(([packageKey, packageInfo]) => {
                const packageId = packageKey.toLowerCase();
                const isSelected = selectedPackage === packageId;
                const isFreePackage = packageId === 'free';
                const isBasicPackage = packageId === 'basic';
                const isPremiumPackage = packageId === 'premium';
                
                // Chọn màu sắc dựa trên gói
                let borderColor = '#d1d5db';
                let bgColor = '#f9fafb';
                let priceColor = '#6b7280';
                
                if (isSelected) {
                  if (isFreePackage) {
                    borderColor = '#10b981';
                    bgColor = '#f0fdf4';
                    priceColor = '#10b981';
                  } else if (isBasicPackage) {
                    borderColor = '#f59e0b';
                    bgColor = '#ffffff';
                    priceColor = '#f59e0b';
                  } else {
                    borderColor = '#f59e0b';
                    bgColor = '#fffbeb';
                    priceColor = '#f59e0b';
                  }
                } else {
                  if (isFreePackage) {
                    priceColor = '#10b981';
                  } else if (isBasicPackage) {
                    priceColor = '#f59e0b';
                  } else {
                    priceColor = '#f59e0b';
                  }
                }

                return (
                  <div
                    key={packageId}
                    onClick={() => setSelectedPackage(packageId)}
                    style={{
                      border: `2px solid ${borderColor}`,
                      borderRadius: '8px',
                      padding: '14px',
                      backgroundColor: bgColor,
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Badge cho PREMIUM */}
                    {isPremiumPackage && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '12px',
                          backgroundColor: '#fbbf24',
                          color: '#1f2937',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '10px',
                          fontWeight: '700',
                        }}
                      >
                        TỐT NHẤT
                      </div>
                    )}

                    {/* Header: Tên gói + Checkmark */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                        Gói {packageInfo.name}
                      </span>
                      {isSelected && (
                        <CheckCircle size={18} color="#10b981" />
                      )}
                    </div>

                    {/* Giá */}
                    <div style={{ fontSize: isFreePackage ? '18px' : '20px', fontWeight: '700', color: priceColor, marginBottom: '4px' }}>
                      {isFreePackage ? 'MIỄN PHÍ' : (packageInfo.price === 0 ? 'MIỄN PHÍ' : `${packageInfo.price}.000đ`)}
                    </div>

                    {/* Features */}
                    <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                      {packageInfo.features.map((feature, idx) => (
                        <div key={idx}>• {feature}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Thông tin thanh toán */}
            <div
              style={{
                marginTop: '12px',
                padding: '10px',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                border: '1px solid #fde68a',
              }}
            >
              <div style={{ fontSize: '13px', color: '#92400e', fontWeight: '500' }}>
                💳 Thanh toán: {
                  !selectedPackage || selectedPackage === 'free' ? 'MIỄN PHÍ' :
                  selectedPackage === 'basic' ? '10.000đ' : 
                  '25.000đ'
                } sẽ được tính khi bạn nhấn "Đăng bài"
              </div>
            </div>
          </div>
        )}

        {/* General Error message (nếu có) */}
        {errors.general && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fecaca',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⚠️</span>
            <span>{errors.general}</span>
          </div>
        )}

        {/* Post type selection - Disable trong edit mode */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ ...labelStyle, fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>
            Loại bài đăng
            {isEditMode && (
              <span style={{ fontSize: '12px', fontWeight: '400', color: '#6b7280', marginLeft: '8px' }}>
                (Không thể thay đổi)
              </span>
            )}
          </label>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '4px',
            }}
          >
            <button
              type="button"
              onClick={() => !isEditMode && setPostType('buy')}
              disabled={isEditMode}
              style={{
                flex: 1,
                backgroundColor: postType === 'buy' ? '#3b82f6' : '#f8fafc',
                color: postType === 'buy' ? '#fff' : '#475569',
                border: `2px solid ${postType === 'buy' ? '#3b82f6' : '#d1d5db'}`,
                fontWeight: '600',
                padding: '10px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isEditMode ? 'not-allowed' : 'pointer',
                opacity: isEditMode ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isEditMode && postType === 'buy') {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isEditMode && postType === 'buy') {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.transform = '';
                }
              }}
            >
              <CartPlus size={18} />
              <span>Cần mua</span>
            </button>
            <button
              type="button"
              onClick={() => !isEditMode && setPostType('sell')}
              disabled={isEditMode}
              style={{
                flex: 1,
                backgroundColor: postType === 'sell' ? '#fbbf24' : '#f8fafc',
                color: postType === 'sell' ? '#1f2937' : '#475569',
                border: `2px solid ${postType === 'sell' ? '#fbbf24' : '#d1d5db'}`,
                fontWeight: '600',
                padding: '10px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isEditMode ? 'not-allowed' : 'pointer',
                opacity: isEditMode ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isEditMode && postType === 'sell') {
                  e.target.style.borderColor = '#f59e0b';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isEditMode && postType === 'sell') {
                  e.target.style.borderColor = '#fbbf24';
                  e.target.style.transform = '';
                }
              }}
            >
              <CurrencyDollar size={18} />
              <span>Cần bán</span>
            </button>
          </div>
        </div>

        {/* Category Selection */}
        {selectedCategory !== undefined && categories && categories.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <label style={sectionTitle}>
              <Tag size={18} color={getIconFocusColor()} style={{ marginRight: '8px' }} />
              <span style={{ fontWeight: '600' }}>Danh mục *</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Tag
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  width: '18px',
                  height: '18px',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />
              <select
                value={selectedCategory || 'Tất cả'}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (errors.category && setErrors) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.category;
                      return newErrors;
                    });
                  }
                }}
                style={{
                  ...inputStyle,
                  paddingLeft: '40px',
                  borderColor: errors.category ? '#ef4444' : '#d1d5db',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = errors.category ? '#ef4444' : getFocusColor();
                  e.target.style.boxShadow = getFocusShadow();
                  const icon = e.target.parentElement.querySelector('svg');
                  if (icon) icon.style.color = getIconFocusColor();
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.category ? '#ef4444' : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                  const icon = e.target.parentElement.querySelector('svg');
                  if (icon) icon.style.color = '#6b7280';
                }}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', paddingLeft: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>⚠️</span>
                  <span>{errors.category}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Title and Location */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={sectionTitle}>
              <CardText className="me-2" style={{ width: '18px', height: '18px' }} />
              <span style={{ fontWeight: '600' }}>Tiêu đề bài đăng *</span>
            </label>
            <div style={{ position: 'relative' }}>
              <CardText
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  width: '18px',
                  height: '18px',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder={postType === 'buy' ? "Ví dụ: Cần mua laptop cũ giá rẻ" : "Ví dụ: Bán laptop Dell cũ giá tốt"}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  // Clear error khi user bắt đầu nhập
                  if (errors.title && setErrors) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.title;
                      return newErrors;
                    });
                  }
                }}
                style={{
                  ...inputStyle,
                  paddingLeft: '40px',
                  borderColor: errors.title ? '#ef4444' : '#d1d5db',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = errors.title ? '#ef4444' : getFocusColor();
                  e.target.style.borderWidth = '2px';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = getFocusShadow();
                  const icon = e.target.parentElement.querySelector('svg');
                  if (icon) icon.style.color = getIconFocusColor();
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.title ? '#ef4444' : '#d1d5db';
                  e.target.style.borderWidth = '2px';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = 'none';
                  const icon = e.target.parentElement.querySelector('svg');
                  if (icon) icon.style.color = '#6b7280';
                }}
                required
              />
              {errors.title && (
                <div
                  style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '6px',
                    paddingLeft: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>⚠️</span>
                  <span>{errors.title}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={sectionTitle}>
              <GeoAlt className="me-2" />
              Địa điểm
            </label>
            <div style={{ position: 'relative' }}>
              <GeoAlt
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  width: '18px',
                  height: '18px',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={location}
                readOnly
                onClick={() => setIsAddressModalOpen(true)}
                placeholder="Chọn địa điểm..."
                style={{
                  ...inputStyle,
                  paddingLeft: '40px',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = getFocusColor();
                  e.target.style.borderWidth = '2px';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = getFocusShadow();
                  const icon = e.target.parentElement.querySelector('svg');
                  if (icon) icon.style.color = getIconFocusColor();
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.borderWidth = '2px';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = 'none';
                  const icon = e.target.parentElement.querySelector('svg');
                  if (icon) icon.style.color = '#6b7280';
                }}
              />
            </div>
          </div>
        </div>

        {/* Price and Condition */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <div>
            <label style={{ ...labelStyle, fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>
              {postType === 'buy' ? 'Ngân sách' : 'Giá bán'} (VNĐ)
            </label>
            {postType === 'buy' ? (
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{
                  ...inputStyle,
                  padding: '8px 36px 8px 12px',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = getFocusColor();
                  e.target.style.borderWidth = '2px';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = getFocusShadow();
                  const iconColor = getIconFocusColor();
                  e.target.style.backgroundImage = `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${iconColor.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.borderWidth = '2px';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundImage = 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239ca3af\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")';
                }}
              >
                <option value="">Chọn mức giá</option>
                <option value="0-50000">Dưới 50.000đ</option>
                <option value="50000-200000">50.000đ - 200.000đ</option>
                <option value="200000-500000">200.000đ - 500.000đ</option>
                <option value="500000-1000000">500.000đ - 1.000.000đ</option>
                <option value="1000000-5000000">1.000.000đ - 5.000.000đ</option>
                <option value="5000000+">Trên 5.000.000đ</option>
              </select>
            ) : (
              <div style={{ position: 'relative' }}>
                <Tag
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    width: '18px',
                    height: '18px',
                    zIndex: 10,
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    // Clear error khi user bắt đầu nhập
                    if (errors.price && setErrors) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.price;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder="Nhập giá bán"
                  style={{
                    ...inputStyle,
                    paddingLeft: '40px',
                    borderColor: errors.price ? '#ef4444' : '#d1d5db',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.price ? '#ef4444' : getFocusColor();
                    e.target.style.borderWidth = '2px';
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = getFocusShadow();
                    const icon = e.target.parentElement.querySelector('svg');
                    if (icon) icon.style.color = getIconFocusColor();
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.price ? '#ef4444' : '#d1d5db';
                    e.target.style.borderWidth = '2px';
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = 'none';
                    const icon = e.target.parentElement.querySelector('svg');
                    if (icon) icon.style.color = '#6b7280';
                  }}
                  required
                />
                {errors.price && (
                  <div
                    style={{
                      color: '#ef4444',
                      fontSize: '12px',
                      marginTop: '6px',
                      paddingLeft: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>⚠️</span>
                    <span>{errors.price}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label style={sectionTitle}>
              <CheckCircle className="me-2" style={{ width: '18px', height: '18px' }} />
              <span style={{ fontWeight: '600' }}>Tình trạng *</span>
            </label>
            <div style={{ position: 'relative' }}>
              <CheckCircle
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  width: '18px',
                  height: '18px',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                style={{
                  ...inputStyle,
                  padding: '8px 36px 8px 40px',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = getFocusColor();
                  e.target.style.borderWidth = '2px';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = getFocusShadow();
                  const iconColor = getIconFocusColor();
                  e.target.style.backgroundImage = `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${iconColor.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`;
                  const icon = e.target.parentElement.querySelector('svg');
                  if (icon) icon.style.color = getIconFocusColor();
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.borderWidth = '2px';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundImage = 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239ca3af\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")';
                  const icon = e.target.parentElement.querySelector('svg');
                  if (icon) icon.style.color = '#6b7280';
                }}
                required
              >
                <option value="Mới">Mới</option>
                <option value="Như mới">Như mới</option>
                <option value="Đã sử dụng ít">Đã sử dụng ít</option>
                <option value="Đã sử dụng nhiều">Đã sử dụng nhiều</option>
                <option value="Còn bảo hành">Còn bảo hành</option>
                <option value="Hết bảo hành">Hết bảo hành</option>
              </select>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ ...labelStyle, fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>
            Hình ảnh / Video
            <span
              style={{
                color: '#6b7280',
                fontWeight: 'normal',
                marginLeft: '6px',
                fontSize: '13px',
              }}
            >
              (Tối đa 10 file)
            </span>
          </label>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: postType === 'sell' ? 'rgba(251, 191, 36, 0.05)' : 'rgba(99, 102, 241, 0.05)',
              border: postType === 'sell' ? '2px dashed #fbbf24' : '2px dashed #6366f1',
              borderRadius: '12px',
              padding: '32px 24px',
              width: '100%',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              if (postType === 'sell') {
                e.target.style.borderColor = '#f59e0b';
                e.target.style.background = 'rgba(251, 191, 36, 0.08)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.15)';
              } else {
                e.target.style.borderColor = '#4f46e5';
                e.target.style.background = 'rgba(99, 102, 241, 0.08)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = postType === 'sell' ? '#fbbf24' : '#6366f1';
              e.target.style.background = postType === 'sell' ? 'rgba(251, 191, 36, 0.05)' : 'rgba(99, 102, 241, 0.05)';
              e.target.style.transform = '';
              e.target.style.boxShadow = '';
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: postType === 'sell' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(99, 102, 241, 0.1)',
              margin: '0 auto 16px',
              transition: 'all 0.3s ease'
            }}>
              <Upload size={28} color={postType === 'sell' ? '#f59e0b' : '#6366f1'} style={{ transition: 'all 0.3s ease' }} />
            </div>
            <div style={{
              color: postType === 'sell' ? '#f59e0b' : '#4f46e5',
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '8px',
              transition: 'all 0.3s ease'
            }}>
              Kéo thả hình ảnh vào đây hoặc nhấn để chọn
            </div>
            <div style={{
              color: '#6b7280',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}>
              Tối đa 10 ảnh (hỗ trợ JPG, PNG, GIF)
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,video/*"
              style={{ display: 'none' }}
            />
          </button>

          {/* Existing images/videos (hiển thị khi edit mode hoặc repost mode) */}
          {(isEditMode || isRepostMode) && (existingImages.length > 0 || existingVideos.length > 0) && (
            <div style={{ marginTop: '16px', marginBottom: files.length > 0 ? '16px' : '0' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                Ảnh/Video hiện có:
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '12px',
                }}
              >
                {existingImages.map((imgUrl, index) => (
                  <div
                    key={`existing-img-${index}`}
                    style={{
                      position: 'relative',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      aspectRatio: '1',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Existing ${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {removeExistingImage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingImage(index);
                        }}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {existingVideos.map((videoUrl, index) => (
                  <div
                    key={`existing-video-${index}`}
                    style={{
                      position: 'relative',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      aspectRatio: '1',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f3f4f6',
                        color: '#6b7280',
                      }}
                    >
                      <div style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎥</div>
                        <div style={{ fontSize: '11px' }}>Video</div>
                      </div>
                    </div>
                    {removeExistingVideo && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingVideo(index);
                        }}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File previews */}
          {files.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '12px',
                marginTop: (isEditMode || isRepostMode) && (existingImages.length > 0 || existingVideos.length > 0) ? '0' : '16px',
              }}
            >
              {files.map((file, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    aspectRatio: '1',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f3f4f6',
                        color: '#6b7280',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f3f4f6',
                        color: '#6b7280',
                      }}
                    >
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '16px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '24px',
                            marginBottom: '8px',
                          }}
                        >
                          🎥
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            wordBreak: 'break-word',
                            lineHeight: '1.3',
                          }}
                        >
                          {file.name.length > 15
                            ? file.name.substring(0, 12) + '...'
                            : file.name}
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: 0,
                      lineHeight: 1,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(0, 0, 0, 0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(0, 0, 0, 0.7)';
                    }}
                    aria-label="Xóa file"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ ...labelStyle, fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>
            Nội dung chi tiết
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              // Clear error khi user bắt đầu nhập
              if (errors.content && setErrors) {
                setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.content;
                  return newErrors;
                });
              }
            }}
            rows={6}
            placeholder={postType === 'buy' 
              ? "Mô tả chi tiết sản phẩm hoặc nhu cầu của bạn..." 
              : "Mô tả chi tiết sản phẩm bạn muốn bán (tình trạng, thông số kỹ thuật, lý do bán...)"}
            style={{
              ...inputStyle,
              minHeight: '150px',
              resize: 'vertical',
              lineHeight: '1.6',
              padding: '10px 12px',
              borderColor: errors.content ? '#ef4444' : '#d1d5db',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = errors.content ? '#ef4444' : getFocusColor();
              e.target.style.borderWidth = '2px';
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.boxShadow = getFocusShadow();
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.content ? '#ef4444' : '#d1d5db';
              e.target.style.borderWidth = '2px';
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.content && (
            <div
              style={{
                color: '#ef4444',
                fontSize: '12px',
                marginTop: '6px',
                paddingLeft: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>⚠️</span>
              <span>{errors.content}</span>
            </div>
          )}
        </div>

        {/* Submit buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb',
            marginTop: '8px',
          }}
        >
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            style={{
              backgroundColor: '#fff',
              color: '#374151',
              border: '1.5px solid #e5e7eb',
              padding: '12px 20px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.target.style.backgroundColor = '#fff';
              }
            }}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              backgroundColor: postType === 'sell' ? '#fbbf24' : '#3b82f6',
              color: postType === 'sell' ? '#1f2937' : '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.target.style.backgroundColor = postType === 'sell' ? '#f59e0b' : '#2563eb';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = postType === 'sell' 
                  ? '0 4px 12px rgba(251, 191, 36, 0.3)' 
                  : '0 4px 12px rgba(37, 99, 235, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.target.style.backgroundColor = postType === 'sell' ? '#fbbf24' : '#3b82f6';
                e.target.style.transform = '';
                e.target.style.boxShadow = '';
              }
            }}
          >
            {submitting ? (
              <>
                <span
                  className="spinner"
                  style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: postType === 'sell' ? '#1f2937' : '#fff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px',
                  }}
                ></span>
                {isEditMode ? 'Đang cập nhật...' : 'Đang đăng...'}
              </>
            ) : (
              isEditMode ? 'Cập nhật bài đăng' : 'Đăng bài'
            )}
          </button>
        </div>
      </form>

      {/* Address Selector Modal */}
      <AddressSelector
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelect={(address) => {
          setLocation(address);
          setIsAddressModalOpen(false);
        }}
        currentAddress={location}
      />
    </>
  );
}

