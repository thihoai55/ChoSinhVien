import { useEffect, useRef, useState } from 'react'

export default function DropdownThongBao({ notifications = [], onClose, onNotificationClick }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    setVisible(true)
    document.body.style.overflow = 'hidden'
    return () => (document.body.style.overflow = 'auto')
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const filteredNotifications =
    activeTab === 'all' ? notifications : notifications.filter((n) => !n.read)

  const container = {
    position: 'absolute',
    top: '110%',
    right: 0,
    width: 360,
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    zIndex: 100,
    maxHeight: 500,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(-8px)',
    transition: 'all 0.3s ease',
  }

  const header = {
    position: 'sticky',
    top: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    background: '#facc15',
    color: '#fff',
    fontWeight: 700,
    fontSize: 20,
    borderBottom: '1px solid #fde68a',
    zIndex: 10,
  }

  const closeBtn = {
    cursor: 'pointer',
    fontSize: 18,
    border: 'none',
    background: 'transparent',
    color: '#fff',
  }

  const tabBar = {
    display: 'flex',
    borderBottom: '1px solid #fef9c3',
    background: '#fffbeb',
    position: 'sticky',
    top: 52,
    zIndex: 9,
  }

  const tabBtn = (active) => ({
    flex: 1,
    padding: '10px 12px',
    cursor: 'pointer',
    textAlign: 'center',
    fontWeight: active ? 600 : 400,
    background: active ? '#fff' : '#fffbeb',
    borderBottom: active ? '2px solid #facc15' : '2px solid transparent',
    transition: 'all 0.2s ease',
    fontSize: 14,
  })

  const listContainer = {
    overflowY: 'auto',
    flex: 1,
    padding: '8px 0',
  }

  const item = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: '#fff',
    borderRadius: 8,
    margin: '4px 8px',
  }

  const itemHover = {
    background: '#fef9c3',
    transform: 'scale(1.01)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  }

  const iconStyle = (read) => ({
    fontSize: 18,
    marginTop: 2,
    color: read ? '#9ca3af' : '#facc15',
  })

  const messageStyle = (read) => ({
    fontWeight: read ? 400 : 500,
    fontSize: 14,
    color: '#111827',
  })

  const timeStyle = {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  }

  return (
    <div ref={ref} style={container}>
      <div style={header}>
        <span>Thông báo</span>
        <button style={closeBtn} onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div style={tabBar}>
        <div style={tabBtn(activeTab === 'all')} onClick={() => setActiveTab('all')}>
          Tất cả
        </div>
        <div style={tabBtn(activeTab === 'unread')} onClick={() => setActiveTab('unread')}>
          Chưa đọc
        </div>
      </div>

      <div style={listContainer}>
        {filteredNotifications.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>Không có thông báo</div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              style={item}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, itemHover)}
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, { background: '#fff', transform: 'scale(1)', boxShadow: 'none' })
              }
              onClick={() => {
                onNotificationClick?.(n)
              }}
            >
              <i className={n.read ? 'bi bi-bell' : 'bi bi-bell-fill'} style={iconStyle(n.read)}></i>
              <div>
                <div style={messageStyle(n.read)}>{n.message}</div>
                <div style={timeStyle}>{n.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
