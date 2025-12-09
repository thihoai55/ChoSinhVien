import { useState, useMemo } from 'react'
import ProfileDropdown from './ProfileDropdown'
import DropdownThongBao from './DropdownThongBao'
import DropdownSaved from './DropdownSaved'
import ChatBox from './ChatBox'
import { useAuth } from '../contexts/AuthContext'
import { usePosts } from '../contexts/PostContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useChat } from '../contexts/ChatContext'

export default function Header({ onNavigate, onSearch, showToast }) {
  const { user, logout } = useAuth(); // Đã có user
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const { unreadCount: unreadChats, openChatList } = useChat();

  // --- SỬA 1: Lấy thêm 2 hàm toggle ---
  const { getSavedPosts, getLikedPosts, posts, toggleSave, toggleLike } = usePosts();

  // (useMemo tính toán 2 list này đã đúng)
  const savedPosts = useMemo(() => {
    return (user && getSavedPosts) ? getSavedPosts(user.id) : [];
  }, [user, getSavedPosts, posts]);

  const likedPosts = useMemo(() => {
    return (user && getLikedPosts) ? getLikedPosts(user.id) : [];
  }, [user, getLikedPosts, posts]);
  
  // (useMemo tính tổng cũng đã đúng)
  const favoritePostsCount = useMemo(() => {
    if (!user) return 0;
    const combinedList = [...savedPosts, ...likedPosts];
    const uniquePostIds = new Set(combinedList.map(post => post.id));
    return uniquePostIds.size;
  }, [savedPosts, likedPosts, user]);
  
  const [query, setQuery] = useState('')
  const [hovered, setHovered] = useState(null)
  const [searchFocused, setSearchFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showNotify, setShowNotify] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  // --- STYLES (Giữ nguyên) ---
  const header = { position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,.04)', lineHeight: '1.2' }
  const container = { maxWidth: 1200, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, minHeight: '56px' }
  const brand = { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#2563eb', textDecoration: 'none', fontWeight: 700, transition: 'all 0.2s ease', outline: 'none' }
  const actions = { display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }
  const buttonGhost = { background: 'transparent', border: '1px solid #e5e7eb', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s ease', outline: 'none' }
  const buttonPrimary = { background: '#2563eb', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s ease', outline: 'none' }
  const iconBtn = { width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', position: 'relative', cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none' }
  const badge = { position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 11, borderRadius: 10, padding: '2px 6px', border: '1px solid #fff' }
  const searchWrap = { flex: 1, maxWidth: 420, margin: '0 16px' }
  const searchInput = { width: '100%', padding: '10px 12px 10px 36px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box' }
  const searchIcon = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 18, transition: 'all 0.2s ease' }
  const brandHover = { opacity: 0.7 }
  const iconBtnHover = { background: '#f8fafc', transform: 'scale(1.05)', boxShadow: '0 4px 8px rgba(0,0,0,.05)' }
  const buttonGhostHover = { background: '#f3f4f6', transform: 'translateY(-2px)', boxShadow: '0 2px 4px rgba(0,0,0,.04)' }
  const buttonPrimaryHover = { opacity: 0.9, transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }
  const searchInputFocused = { borderColor: '#2563eb', boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.2)' }
  const searchIconFocused = { color: '#2563eb' }
  const suggestionBox = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    background: '#fff',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
    zIndex: 40,
    maxHeight: 220,
    overflowY: 'auto',
  }
  const suggestionItem = {
    padding: '8px 12px',
    fontSize: 14,
    color: '#374151',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }

  const searchKeywords = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return []
    const raw = []
    posts.forEach((p) => {
      if (p.title) raw.push(p.title)
      if (p.category) raw.push(p.category)
      if (p.address) raw.push(p.address)
    })
    const seen = new Set()
    const result = []
    raw.forEach((text) => {
      const key = String(text).trim().toLowerCase()
      if (!key || seen.has(key)) return
      seen.add(key)
      result.push(text)
    })
    return result
  }, [posts])

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return searchKeywords.filter((text) =>
      String(text).toLowerCase().includes(q)
    ).slice(0, 6)
  }, [query, searchKeywords])

  const navigateByQuery = (value) => {
    const q = String(value || '').trim().toLowerCase()
    if (!q) return
    if (!posts || !Array.isArray(posts)) return

    const match =
      posts.find((p) => String(p.title || '').toLowerCase().includes(q)) ||
      posts.find((p) => String(p.category || '').toLowerCase().includes(q)) ||
      posts.find((p) => String(p.address || '').toLowerCase().includes(q))

    if (match && match.id != null) {
      onNavigate?.('post-detail', match.id)
    }
  }

  // --- FUNCTION (Giữ nguyên, bổ sung notify) ---
  const handleProtectedClick = (action) => {
    if (!user) {
      showToast?.("Vui lòng đăng nhập!");
    } else {
      if (action === 'notify') {
        // Khi mở dropdown thông báo lần đầu, đánh dấu tất cả là đã đọc
        if (!showNotify) {
          markAllAsRead?.();
        }
        setShowNotify((prev) => !prev)
        setShowSaved(false)

      } else if (action === 'saved') {
        setShowSaved((prev) => !prev)
        setShowNotify(false)
      } else if (action === 'chat') {
        openChatList?.()
      } else {
        onNavigate(action)
      }
    }
  };

  return (
    <header style={header}>
      <div style={container}>
        <a
          style={hovered === 'brand' ? { ...brand, ...brandHover } : brand}
          onClick={() => onNavigate('home')}
          onMouseEnter={() => setHovered('brand')}
          onMouseLeave={() => setHovered(null)}
          onMouseDown={(e) => e.preventDefault()}
          onFocus={(e) => e.currentTarget.blur()}
        >
          <i className="bi bi-book" style={{ fontSize: 22 }} />
          <span style={{ fontSize: '16px' }}>Sàn Trao Đổi SV</span>
        </a>

        <div style={searchWrap}>
          <div style={{ position: 'relative', width: '100%' }}>
            <i
              className="bi bi-search"
              style={searchFocused ? { ...searchIcon, ...searchIconFocused } : searchIcon}
            ></i>
            <input
              style={searchFocused ? { ...searchInput, ...searchInputFocused } : searchInput}
              placeholder="Tìm kiếm đồ đạc, sách vở..."
              value={query}
              onChange={(e) => {
                const value = e.target.value
                setQuery(value)
                onSearch?.(value)
                setShowSuggestions(!!value.trim())
              }}
              onFocus={() => {
                setSearchFocused(true)
                if (query.trim()) setShowSuggestions(true)
              }}
              onBlur={() => {
                setSearchFocused(false)
                setTimeout(() => setShowSuggestions(false), 100)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigateByQuery(query)
                  setShowSuggestions(false)
                }
              }}
            />

            {showSuggestions && filteredSuggestions.length > 0 && (
              <div style={suggestionBox}>
                {filteredSuggestions.map((text) => (
                  <div
                    key={text}
                    style={suggestionItem}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      setQuery(text)
                      onSearch?.(text)
                      navigateByQuery(text)
                      setShowSuggestions(false)
                    }}
                  >
                    <i className="bi bi-search" style={{ fontSize: 14, color: '#9ca3af' }} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={actions}>
          <div style={{ position: 'relative' }}>
            <button
              style={hovered === 'saved' ? { ...iconBtn, ...iconBtnHover } : iconBtn}
              title="Bài viết đã lưu & Đã thích"
              onClick={() => handleProtectedClick('saved')}
              onMouseEnter={() => setHovered('saved')}
              onMouseLeave={() => setHovered(null)}
            >
              <i className="bi bi-heart" style={{ color: '#db2777', fontSize: 18 }} />
              
              {/* (Badge này đã đếm tổng số) */}
              <span style={badge}>{favoritePostsCount}</span>
            </button>
            
            {/* --- SỬA 2: Truyền thêm props xuống Dropdown --- */}
            {showSaved && (
              <DropdownSaved 
                savedPosts={savedPosts} 
                likedPosts={likedPosts}
                onClose={() => setShowSaved(false)}
                // Thêm các props cần thiết
                user={user}
                onNavigate={onNavigate}
                toggleSave={toggleSave}
                toggleLike={toggleLike}
              />
            )}
          </div>

          {/* (Các nút Chat, Notify giữ nguyên) */}
          <button
            style={hovered === 'chat' ? { ...iconBtn, ...iconBtnHover } : iconBtn}
            title="Tin nhắn"
            onClick={() => handleProtectedClick('chat')}
            onMouseEnter={() => setHovered('chat')}
            onMouseLeave={() => setHovered(null)}
          >
            <i className="bi bi-chat-dots" style={{ color: '#2563eb', fontSize: 18 }} />
            <span style={{ ...badge, background: '#3b82f6' }}>{unreadChats}</span>
          </button>
          <div style={{ position: 'relative' }}>
            <button
              style={hovered === 'notify' ? { ...iconBtn, ...iconBtnHover } : iconBtn}
              title="Thông báo"
              onClick={() => handleProtectedClick('notify')}
              onMouseEnter={() => setHovered('notify')}
              onMouseLeave={() => setHovered(null)}
            >
              <i className="bi bi-bell" style={{ color: '#facc15', fontSize: 18 }} />
              <span style={{ ...badge, background: '#fbbf24' }}>{unreadCount}</span>
            </button>
            {showNotify && (
              <DropdownThongBao
                notifications={notifications}
                onClose={() => setShowNotify(false)}
                onNotificationClick={(n) => {
                  setShowNotify(false)

                  // Follow notification -> go to that user's profile
                  if (n.type === 'follow' && n.fromUserId) {
                    onNavigate('user-profile', n.fromUserId)
                    return
                  }

                  // Post rejected: navigate to your profile and open 'hidden' tab where rejected posts live
                  if (n.type === 'post_rejected' && n.postId) {
                    try {
                      window.sessionStorage.setItem('sv_profile_nav', JSON.stringify({ tab: 'hidden', focusPostId: n.postId }))
                    } catch {}
                    // go to current user's profile (notification owner)
                    onNavigate('user-profile', user?.id)
                    return
                  }

                  // Purchase notification -> open buyer info page
                  if (n.type === 'purchase') {
                    try {
                      window.sessionStorage.setItem('sv_buyer_nav', JSON.stringify({ notifyId: n.id, postId: n.postId }));
                    } catch {}
                    // mark this notify as read and open buyers page
                    markAsRead?.(n.id);
                    onNavigate('buyers');
                    return;
                  }

                  // Payment transfer info notification -> open post detail with payment modal
                  if (n.type === 'payment_transfer_info') {
                    try {
                      window.sessionStorage.setItem('sv_payment_notification', JSON.stringify({
                        transactionId: n.transactionId,
                        postId: n.postId,
                        bankTransferInfo: n.bankTransferInfo
                      }));
                    } catch {}
                    // mark this notify as read and navigate to post detail
                    markAsRead?.(n.id);
                    onNavigate('post-detail', n.postId);
                    return;
                  }

                  // Other post-related notifications: open post detail (approved, comment, etc.)
                  if (n.postId) {
                    if (n.commentId && typeof window !== 'undefined') {
                      try {
                        window.sessionStorage.setItem(
                          'sv_focus_comment',
                          JSON.stringify({ postId: n.postId, commentId: n.commentId })
                        );
                      } catch {}
                    }
                    onNavigate('post-detail', n.postId)
                  }
                }}
              />
            )}
          </div>

          <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px' }}></div>

          {/* (Logic User/Login giữ nguyên) */}
          {user ? (
            <>
              {user.role === 'admin' && (
                <button
                  style={hovered === 'admin' ? { ...buttonPrimary, ...buttonPrimaryHover, background: '#10b981' } : { ...buttonPrimary, background: '#10b981' }}
                  onClick={() => onNavigate('admin')}
                  onMouseEnter={() => setHovered('admin')}
                  onMouseLeave={() => setHovered(null)}
                  title="Trang quản trị"
                >
                  <i className="bi bi-shield-check" style={{ fontSize: 16 }} />
                  <span>Admin</span>
                </button>
              )}
              <button
                style={hovered === 'create' ? { ...buttonPrimary, ...buttonPrimaryHover } : buttonPrimary}
                onClick={() => onNavigate('create-post')}
                onMouseEnter={() => setHovered('create')}
                onMouseLeave={() => setHovered(null)}
              >
                <i className="bi bi-plus-circle" style={{ fontSize: 16 }} />
                <span>Tạo bài đăng</span>
              </button>
              <ProfileDropdown user={user} logout={logout} onNavigate={onNavigate} />
            </>
          ) : (
            <>
              <button
                style={hovered === 'login' ? { ...buttonGhost, ...buttonGhostHover } : buttonGhost}
                onClick={() => onNavigate('login')}
                onMouseEnter={() => setHovered('login')}
                onMouseLeave={() => setHovered(null)}
              >
                <i className="bi bi-box-arrow-in-right" style={{ fontSize: 16, color: '#111827' }} />
                <span>Đăng nhập</span>
              </button>
              <button
                style={hovered === 'register' ? { ...buttonPrimary, ...buttonPrimaryHover } : buttonPrimary}
                onClick={() => onNavigate('register')}
                onMouseEnter={() => setHovered('register')}
                onMouseLeave={() => setHovered(null)}
              >
                <i className="bi bi-person-plus" style={{ fontSize: 16, color: '#fff' }} />
                <span>Đăng ký</span>
              </button>
            </>
          )}
        </div>
      </div>
      <ChatBox onNavigate={onNavigate} />
    </header>
  )
}