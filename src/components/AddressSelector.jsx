import { useState, useEffect } from 'react';
import { X, GeoAlt } from 'react-bootstrap-icons';
import { getProvinces, getDistricts, getWards } from '../data/vietnamAddresses';

export default function AddressSelector({ isOpen, onClose, onSelect, currentAddress }) {
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');

  const provinces = getProvinces();
  const districts = getDistricts(province);
  const wards = getWards(province, district);

  // Parse current address nếu có
  useEffect(() => {
    if (currentAddress && isOpen) {
      // Giả sử format: "Xã Sông Phan, Huyện Hàm Tân, Bình Thuận"
      const parts = currentAddress.split(',').map(p => p.trim());
      if (parts.length >= 3) {
        const wardPart = parts[0];
        const districtPart = parts[1];
        const provincePart = parts[2];
        
        // Tìm matching
        const foundProvince = provinces.find(p => provincePart.includes(p) || p.includes(provincePart));
        if (foundProvince) {
          setProvince(foundProvince);
          const foundDistricts = getDistricts(foundProvince);
          const foundDistrict = foundDistricts.find(d => districtPart.includes(d) || d.includes(districtPart));
          if (foundDistrict) {
            setDistrict(foundDistrict);
            const foundWards = getWards(foundProvince, foundDistrict);
            const foundWard = foundWards.find(w => wardPart.includes(w) || w.includes(wardPart));
            if (foundWard) {
              setWard(foundWard);
            }
          }
        }
      }
    }
  }, [isOpen, currentAddress]);

  // Reset khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setProvince('');
      setDistrict('');
      setWard('');
      setSpecificAddress('');
    }
  }, [isOpen]);

  // Khi chọn tỉnh, reset quận và xã
  const handleProvinceChange = (e) => {
    setProvince(e.target.value);
    setDistrict('');
    setWard('');
  };

  // Khi chọn quận, reset xã
  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
    setWard('');
  };

  const handleSubmit = () => {
    if (!province || !district || !ward) {
      return;
    }
    
    const fullAddress = specificAddress 
      ? `${specificAddress}, ${ward}, ${district}, ${province}`
      : `${ward}, ${district}, ${province}`;
    
    onSelect(fullAddress);
    onClose();
  };

  const getPreviewAddress = () => {
    if (!province || !district || !ward) return '';
    return specificAddress 
      ? `${specificAddress}, ${ward}, ${district}, ${province}`
      : `${ward}, ${district}, ${province}`;
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: '1px solid #f1f5f9',
            position: 'sticky',
            top: 0,
            backgroundColor: '#ffffff',
            zIndex: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1f2937',
              fontSize: '18px',
            }}
          >
            <X size={20} />
          </button>
          <h2
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0,
              flex: 1,
              textAlign: 'center',
            }}
          >
            Chọn địa chỉ
          </h2>
          <div style={{ width: '28px' }} /> {/* Spacer để căn giữa */}
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Tỉnh, thành phố */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px',
              }}
            >
              Tỉnh, thành phố <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={province}
                onChange={handleProvinceChange}
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 12px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db',
                  fontSize: '15px',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239ca3af\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#93c5fd';
                  e.target.style.borderWidth = '2px';
                  e.target.style.boxShadow = '0 0 0 3px rgba(147, 197, 253, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.borderWidth = '2px';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {province && (
                <button
                  onClick={() => {
                    setProvince('');
                    setDistrict('');
                    setWard('');
                  }}
                  style={{
                    position: 'absolute',
                    right: '36px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#e5e7eb',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#6b7280',
                    padding: 0,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Quận, huyện, thị xã */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px',
              }}
            >
              Quận, huyện, thị xã <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={district}
                onChange={handleDistrictChange}
                disabled={!province}
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 12px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db',
                  fontSize: '15px',
                  backgroundColor: province ? '#ffffff' : '#f9fafb',
                  color: province ? '#1e293b' : '#9ca3af',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239ca3af\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                  cursor: province ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  if (province) {
                    e.target.style.borderColor = '#93c5fd';
                    e.target.style.borderWidth = '2px';
                    e.target.style.boxShadow = '0 0 0 3px rgba(147, 197, 253, 0.2)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.borderWidth = '2px';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {district && (
                <button
                  onClick={() => {
                    setDistrict('');
                    setWard('');
                  }}
                  style={{
                    position: 'absolute',
                    right: '36px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#e5e7eb',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#6b7280',
                    padding: 0,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Phường, xã, thị trấn */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px',
              }}
            >
              Phường, xã, thị trấn <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                disabled={!district}
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 12px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db',
                  fontSize: '15px',
                  backgroundColor: district ? '#ffffff' : '#f9fafb',
                  color: district ? '#1e293b' : '#9ca3af',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239ca3af\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                  cursor: district ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  if (district) {
                    e.target.style.borderColor = '#93c5fd';
                    e.target.style.borderWidth = '2px';
                    e.target.style.boxShadow = '0 0 0 3px rgba(147, 197, 253, 0.2)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.borderWidth = '2px';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Chọn phường/xã</option>
                {wards.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              {ward && (
                <button
                  onClick={() => setWard('')}
                  style={{
                    position: 'absolute',
                    right: '36px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#e5e7eb',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#6b7280',
                    padding: 0,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Địa chỉ cụ thể */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px',
              }}
            >
              Địa chỉ cụ thể
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={specificAddress}
                onChange={(e) => setSpecificAddress(e.target.value)}
                placeholder="Nhập số nhà, tên đường..."
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 12px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db',
                  fontSize: '15px',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#93c5fd';
                  e.target.style.borderWidth = '2px';
                  e.target.style.boxShadow = '0 0 0 3px rgba(147, 197, 253, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.borderWidth = '2px';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  pointerEvents: 'none',
                }}
              >
                ▼
              </div>
            </div>
          </div>

          {/* Preview địa chỉ */}
          {getPreviewAddress() && (
            <div
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <GeoAlt
                  style={{
                    color: '#3b82f6',
                    fontSize: '20px',
                    marginTop: '2px',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      marginBottom: '8px',
                    }}
                  >
                    Địa chỉ mới sẽ hiển thị trên tin đăng:
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#1f2937',
                      fontWeight: '500',
                      lineHeight: '1.5',
                    }}
                  >
                    {getPreviewAddress()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Button Xong */}
          <button
            onClick={handleSubmit}
            disabled={!province || !district || !ward}
            style={{
              width: '100%',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: (!province || !district || !ward) ? '#e5e7eb' : '#3b82f6',
              color: (!province || !district || !ward) ? '#9ca3af' : '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: (!province || !district || !ward) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (province && district && ward) {
                e.target.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (province && district && ward) {
                e.target.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
}

