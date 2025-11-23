import { useEffect, useRef, useState } from 'react'

// --- SỬA 1: Nhận thêm props ---
export default function DropdownSaved({
  savedPosts = [],
  likedPosts = [],
  onClose,
  user,           // <-- Mới
  onNavigate,     // <-- Mới
  toggleSave,     // <-- Mới
  toggleLike      // <-- Mới
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('saved');

  useEffect(() => setVisible(true), [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => (document.body.style.overflow = 'auto')
  }, [])

  // --- STYLES (Giữ nguyên) ---
  const container = {
    position: 'absolute',
    top: '110%',
    right: 0,
    width: 400,
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    zIndex: 100,
    maxHeight: 500,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(-8px)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  }
  const header = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    background: '#db2777',
    color: '#fff',
    fontWeight: 700,
    fontSize: 20,
    flexShrink: 0,
  }
  const closeBtn = {
    cursor: 'pointer',
    fontSize: 18,
    border: 'none',
    background: 'transparent',
    color: '#fff',
    fontWeight: 700,
  }
  const tabContainer = {
    display: 'flex',
    background: '#f9fafb',
    padding: '8px',
    gap: '8px',
    flexShrink: 0,
    borderBottom: '1px solid #f3f4f6',
  }
  const getTabStyle = (isActive) => ({
    flex: 1,
    textAlign: 'center',
    padding: '10px 12px',
    background: isActive ? '#fff' : 'transparent',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: isActive ? 600 : 500,
    color: isActive ? '#db2777' : '#6b7280',
    boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
  })
  const listContainer = {
    overflowY: 'auto',
    flex: 1,
    padding: '8px 0',
  }
  const postItem = {
    display: 'flex',
    alignItems: 'center', // <-- Sửa: Canh giữa cho đẹp
    gap: 12,
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: '#fff',
    margin: '4px 8px',
    borderRadius: 8,
  }
  const postItemHover = {
    background: '#fdf2f8',
    transform: 'scale(1.01)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  }
  const imageStyle = {
    width: 60,
    height: 60,
    borderRadius: 8,
    objectFit: 'cover',
    flexShrink: 0, // <-- Thêm: tránh bị co ảnh
  }
  const titleStyle = {
    fontWeight: 600,
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  }
  const summaryStyle = {
    fontSize: 13,
    color: '#6b7280',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }

  // --- THÊM MỚI: Style cho nút Xóa ---
  const removeBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af', // gray-400
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto', // Đẩy nút này ra xa
    flexShrink: 0,
    transition: 'all 0.2s ease',
  }
  const removeBtnHover = {
    background: '#fee2e2', // red-100
    color: '#ef4444', // red-500
  }
  // --- KẾT THÚC THÊM MỚI ---


  const postsToDisplay = activeTab === 'saved' ? savedPosts : likedPosts;

  // --- THÊM MỚI: Hàm xử lý ---
  const handleRemove = (e, post) => {
    e.stopPropagation(); // Ngăn không cho click vào thẻ cha (điều hướng)
    if (!user) return; // Chỉ cho chắc

    if (activeTab === 'saved') {
      toggleSave?.(post.id, user.id);
    } else {
      toggleLike?.(post.id, user.id);
    }
    // Context sẽ tự cập nhật và list sẽ tự render lại
  };

  const handleNavigate = (post) => {
    onNavigate?.('post-detail', post.id); // Gọi hàm điều hướng từ App.js
    onClose?.(); // Đóng dropdown
  };
  // --- KẾT THÚC THÊM MỚI ---

  return (
    <div ref={ref} style={container}>
      <div style={header}>
        <span>Yêu thích</span>
        <button style={closeBtn} onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      {/* (Tab container giữ nguyên) */}
      <div style={tabContainer}>
        <button
          style={getTabStyle(activeTab === 'saved')}
          onClick={() => setActiveTab('saved')}
        >
          <i className="bi bi-bookmark-fill" style={{ marginRight: 6 }}></i>
          Đã lưu ({savedPosts.length})
        </button>
        <button
          style={getTabStyle(activeTab === 'liked')}
          onClick={() => setActiveTab('liked')}
        >
          <i className="bi bi-heart-fill" style={{ marginRight: 6 }}></i>
          Đã thích ({likedPosts.length})
        </button>
      </div>

      <div style={listContainer}>
        {postsToDisplay.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>
            {activeTab === 'saved' ? 'Chưa có bài viết nào được lưu' : 'Bạn chưa thích bài viết nào'}
          </div>
        ) : (
          postsToDisplay.map((post) => (
            <div
              key={post.id}
              style={postItem}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, postItemHover)}
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, { background: '#fff', transform: 'scale(1)', boxShadow: 'none' })
              }
              // --- SỬA: Thêm onClick điều hướng ---
              onClick={() => handleNavigate(post)}
            >
              <img src={post.image} alt={post.title} style={imageStyle} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={titleStyle}>{post.title}</div>
                <div style={summaryStyle}>{post.content}</div>
              </div>

              {/* --- THÊM MỚI: Nút Xóa --- */}
              <button
                style={removeBtnStyle}
                title={activeTab === 'saved' ? 'Bỏ lưu' : 'Bỏ thích'}
                onClick={(e) => handleRemove(e, post)}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, removeBtnHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, removeBtnStyle)}
              >
                <i className="bi bi-x-lg" style={{ fontSize: 14 }}></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}