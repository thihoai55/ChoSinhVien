import { useState, useEffect, useRef } from 'react'
import { useChat } from '../contexts/ChatContext'
import { useAuth } from '../contexts/AuthContext'
import { mockUsers } from '../data/userData'

export default function ChatBox({ onNavigate }) {
    const { user } = useAuth()
    const {
        conversations,
        sendMessage,
        editMessage,
        recallMessage,
        setMessageReaction,
        markConversationRead,
        isOpen,
        targetUserId,
        closeChat,
    } = useChat()
    const [activeConvId, setActiveConvId] = useState(null)
    const [text, setText] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [activeMenuId, setActiveMenuId] = useState(null)
    const messagesEndRef = useRef(null)
    const [editingMessageId, setEditingMessageId] = useState(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return

        // Nếu có targetUserId, ưu tiên tìm hoặc tạo hội thoại với người đó
        if (targetUserId) {
            const myId = String(user?.id || '')
            const partnerId = String(targetUserId)
            const convId = myId && partnerId
                ? (myId < partnerId ? `${myId}-${partnerId}` : `${partnerId}-${myId}`)
                : null

            if (convId) {
                setActiveConvId(convId)
                return
            }
        }
    }, [isOpen, targetUserId, activeConvId, conversations, user])

    useEffect(() => {
        if (!isOpen || !activeConvId) return
        markConversationRead(activeConvId)
    }, [isOpen, activeConvId, markConversationRead])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }, [activeConvId, conversations])

    if (!isOpen || !user) return null

    const activeConv = conversations.find((c) => c.id === activeConvId) || null
    const msgs = activeConv ? activeConv.messages : []
    let partner = activeConv?.partner || null

    const formatTime = (isoString) => {
        if (!isoString) return ''
        try {
            const d = new Date(isoString)
            return d.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            })
        } catch {
            return ''
        }
    }

    if (!partner && targetUserId) {
        const partnerUser =
            mockUsers.find((u) => String(u.id) === String(targetUserId)) || {
                id: targetUserId,
                name: 'Người dùng',
                avatar: 'https://i.pravatar.cc/150?img=1',
            }

        partner = {
            id: String(partnerUser.id),
            name: partnerUser.username || partnerUser.name,
            avatar: partnerUser.avatar,
        }
    }
    const isListMode = !targetUserId

    // Đối tượng hiển thị ở header: nếu ở chế độ 1-1 dùng partner,
    // nếu ở list mode thì ưu tiên partner của cuộc trò chuyện đang chọn.
    const headerPartner = !isListMode
        ? partner
        : activeConv?.partner || null

    const getPartnerStatusText = () => {
        if (!headerPartner) return ''

        const { isOnline, lastActive } = headerPartner
        if (isOnline) return 'Đang hoạt động'

        // Nếu chưa từng có lịch sử hoặc dữ liệu lỗi -> coi như không hoạt động
        if (!lastActive) return 'Không hoạt động'

        try {
            const last = new Date(lastActive).getTime()
            if (Number.isNaN(last)) return 'Không hoạt động'

            const diffMs = Date.now() - last
            const diffMinutes = Math.floor(diffMs / 60000)

            if (diffMinutes < 1) return 'Vừa hoạt động'
            if (diffMinutes < 60) return `Hoạt động ${diffMinutes} phút trước`

            const diffHours = Math.floor(diffMinutes / 60)
            if (diffHours < 24) return `Hoạt động ${diffHours} giờ trước`

            const diffDays = Math.floor(diffHours / 24)
            // Nếu quá 30 ngày coi như không hoạt động
            if (diffDays > 30) return 'Không hoạt động'
            return `Hoạt động ${diffDays} ngày trước`
        } catch {
            return 'Không hoạt động'
        }
    }

    const filteredConversations = conversations.filter((c) => {
        const name = c.partner?.name || 'Người dùng'
        if (!searchTerm.trim()) return true
        return name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    })

    const handleSend = () => {
        if (!text.trim() || !partner) return
        if (editingMessageId) {
            editMessage?.(editingMessageId, text.trim())
            setEditingMessageId(null)
            setText('')
            return
        }

        sendMessage(partner.id, text.trim())
        setText('')
    }

    const handleRecall = (m) => {
        recallMessage?.(m.id)
        setActiveMenuId(null)
    }

    const handleEdit = (m) => {
        setEditingMessageId(m.id)
        setText(m.content)
        setActiveMenuId(null)
        setTimeout(() => {
            if (inputRef.current) inputRef.current.focus()
        }, 0)
    }

    const handleRootClick = (e) => {
        if (!activeMenuId) return
        const target = e.target
        const inMenu = target && target.closest ? target.closest('.chat-menu') : null
        const inBtn = target && target.closest ? target.closest('.chat-menu-btn') : null
        if (!inMenu && !inBtn) {
            setActiveMenuId(null)
        }
    }

    return (
        <div
            onClick={handleRootClick}
            style={{
                position: 'fixed',
                right: 24,
                bottom: 24,
                width: isListMode ? 460 : 380,
                height: 520,
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 20px 40px rgba(15,23,42,0.25)',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 60,
            }}
        >
            {/* Header */}
            <div
                style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    zIndex: 70,
                }}
            >
                <button
                    onClick={closeChat}
                    style={{
                        border: 'none',
                        background: '#f3f4ff',
                        cursor: 'pointer',
                        padding: 4,
                        borderRadius: 999,
                    }}
                >
                    <i className="bi bi-x" style={{ fontSize: 18, color: '#6b7280' }} />
                </button>
            </div>

            {/* Thân chat: 2 chế độ */}
            {isListMode ? (
                <>
                    {/* Chế độ: danh sách cuộc trò chuyện + khung tin nhắn (mở từ header) */}
                    <div
                        style={{
                            display: 'flex',
                            borderBottom: '1px solid #e5e7eb',
                            background: '#f9fafb',
                            flex: 1,
                            minHeight: 0,
                        }}
                    >
                        {/* Cột trái: profile + tìm kiếm + danh sách hội thoại */}
                        <div
                            style={{
                                flex: '0 0 40%',
                                borderRight: '1px solid #e5e7eb',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                background: '#f9fafb',
                            }}
                        >
                            <div
                                style={{
                                    padding: '8px 10px',
                                    borderBottom: '1px solid #e5e7eb',
                                    background: '#f3f4ff',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <div
                                        style={{ position: 'relative', cursor: user ? 'pointer' : 'default' }}
                                        onClick={() => {
                                            if (user && onNavigate) onNavigate('user-profile', user.id)
                                        }}
                                    >
                                        <img
                                            src={user?.avatar}
                                            alt={user?.username || user?.name || 'Bạn'}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '1px solid #e5e7eb',
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: '#111827',
                                            }}
                                        >
                                            {user?.username || user?.name || 'Tài khoản của bạn'}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                    }}
                                >
                                    <i
                                        className="bi bi-search"
                                        style={{
                                            position: 'absolute',
                                            left: 10,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontSize: 14,
                                            color: '#9ca3af',
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Tìm kiếm..."
                                        style={{
                                            width: '100%',
                                            borderRadius: 999,
                                            border: '1px solid #d1d5db',
                                            padding: '6px 10px 6px 28px',
                                            fontSize: 13,
                                            outline: 'none',
                                            background: '#fff',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: '10px 10px 4px',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: '#6b7280',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Tin nhắn
                            </div>
                            {filteredConversations.length === 0 && (
                                <div style={{ padding: 10, fontSize: 13, color: '#9ca3af' }}>
                                    Chưa có tin nhắn
                                </div>
                            )}
                            {filteredConversations.map((c) => {
                                const lastMsg = c.messages[c.messages.length - 1]
                                const hasUnread = c.unreadCount > 0
                                return (
                                    <div
                                        key={c.id}
                                        onClick={() => setActiveConvId(c.id)}
                                        style={{
                                            padding: '10px 12px',
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            background: c.id === activeConvId ? '#e5f0ff' : 'transparent',
                                            display: 'flex',
                                            gap: 8,
                                            alignItems: 'center',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (c.id !== activeConvId) {
                                                e.currentTarget.style.background = '#f3f4ff'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (c.id !== activeConvId) {
                                                e.currentTarget.style.background = 'transparent'
                                            }
                                        }}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={c.partner?.avatar}
                                                alt={c.partner?.name || 'Người dùng'}
                                                style={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    border: '1px solid #e5e7eb',
                                                }}
                                            />
                                            {hasUnread && (
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        right: -1,
                                                        top: -1,
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        background: '#ef4444',
                                                        border: '1px solid #fff',
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: 2,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontWeight: hasUnread ? 700 : 500,
                                                        color: '#111827',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {c.partner?.name || 'Người dùng'}
                                                </span>
                                                <span
                                                    style={{
                                                        marginLeft: 8,
                                                        fontSize: 11,
                                                        color: '#9ca3af',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {formatTime(lastMsg?.time)}
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: hasUnread ? '#111827' : '#6b7280',
                                                    fontWeight: hasUnread ? 600 : 400,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {lastMsg ? lastMsg.content : 'Chưa có tin nhắn'}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Cột phải: header người đang chat + khung chat */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {headerPartner && (
                                <div
                                    style={{
                                        padding: '8px 12px',
                                        borderBottom: '1px solid #e5e7eb',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        background: '#f3f4ff',
                                    }}
                                >
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={headerPartner.avatar}
                                            alt={headerPartner.name}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '1px solid #e5e7eb',
                                                cursor: onNavigate ? 'pointer' : 'default',
                                            }}
                                            onClick={() => {
                                                if (onNavigate && headerPartner?.id) {
                                                    onNavigate('user-profile', headerPartner.id)
                                                }
                                            }}
                                        />
                                        {headerPartner.isOnline && (
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    bottom: 0,
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    background: '#22c55e',
                                                    border: '1px solid #fff',
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>
                                            {headerPartner.name}
                                        </span>
                                        <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                            {getPartnerStatusText()}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div
                                style={{
                                    flex: 1,
                                    padding: '10px 14px',
                                    overflowY: 'auto',
                                    background: '#f9fafb',
                                    minHeight: 0,
                                }}
                            >
                                {msgs.length === 0 && (
                                    <div style={{ fontSize: 13, color: '#9ca3af' }}>
                                        Chưa có tin nhắn nào
                                    </div>
                                )}
                                {msgs.map((m) => {
                                    const isMe = m.fromUserId === user.id
                                    const isOpenMenu = activeMenuId === m.id
                                    return (
                                        <div
                                            key={m.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: isMe ? 'flex-end' : 'flex-start',
                                                marginBottom: 6,
                                            }}
                                            onMouseEnter={(e) => {
                                                const row = e.currentTarget.querySelector('.chat-reaction-row')
                                                if (row && !isMe) row.style.opacity = 1
                                            }}
                                            onMouseLeave={(e) => {
                                                const row = e.currentTarget.querySelector('.chat-reaction-row')
                                                if (row && !isMe) row.style.opacity = 0
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: isMe ? 'row-reverse' : 'row',
                                                    alignItems: 'flex-end',
                                                    gap: 6,
                                                }}
                                            >
                                                {!isMe && (
                                                    <img
                                                        src={headerPartner?.avatar}
                                                        alt={headerPartner?.name || 'Người dùng'}
                                                        style={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            border: '1px solid #e5e7eb',
                                                        }}
                                                    />
                                                )}
                                                <div style={{ position: 'relative', maxWidth: '80%' }}>
                                                    <div
                                                        title={formatTime(m.time)}
                                                        style={{
                                                            padding: '8px 12px',
                                                            borderRadius: 999,
                                                            fontSize: 14,
                                                            lineHeight: 1.4,
                                                            background: isMe ? '#2563eb' : '#e5e7eb',
                                                            color: isMe ? '#fff' : '#111827',
                                                            cursor: 'default',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        {m.content}
                                                    </div>
                                                    {m.reaction && (
                                                        <span
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: -6,
                                                                left: isMe ? 'auto' : 10,
                                                                right: isMe ? 10 : 'auto',
                                                                background: 'transparent',
                                                                borderRadius: 999,
                                                                padding: '0 2px',
                                                                fontSize: 12,
                                                            }}
                                                        >
                                                            {m.reaction}
                                                        </span>
                                                    )}
                                                    {!isMe && (
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 4,
                                                                paddingLeft: 4,
                                                                opacity: 0,
                                                                transition: 'opacity 0.15s ease-in-out',
                                                                position: 'absolute',
                                                                top: '100%',
                                                                left: 0,
                                                                marginTop: 2,
                                                            }}
                                                            className="chat-reaction-row"
                                                        >
                                                            {['👍', '❤️', '😊'].map((icon) => (
                                                                <button
                                                                    key={icon}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setMessageReaction?.(
                                                                            m.id,
                                                                            m.reaction === icon ? null : icon
                                                                        )
                                                                    }
                                                                    style={{
                                                                        border: 'none',
                                                                        background: 'transparent',
                                                                        cursor: 'pointer',
                                                                        padding: 0,
                                                                        fontSize: 14,
                                                                    }}
                                                                >
                                                                    {icon}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {isMe && (
                                                    <>
                                                        <button
                                                            className="chat-menu-btn"
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveMenuId((prev) => (prev === m.id ? null : m.id))
                                                            }
                                                            style={{
                                                                border: 'none',
                                                                background: 'transparent',
                                                                cursor: 'pointer',
                                                                padding: 2,
                                                                color: '#9ca3af',
                                                            }}
                                                            title="Tùy chọn"
                                                        >
                                                            <i className="bi bi-three-dots-vertical" style={{ fontSize: 14 }} />
                                                        </button>

                                                        {isOpenMenu && (
                                                            <div
                                                                className="chat-menu"
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '100%',
                                                                    right: 0,
                                                                    marginTop: 4,
                                                                    background: '#fff',
                                                                    borderRadius: 8,
                                                                    boxShadow: '0 8px 16px rgba(15,23,42,0.15)',
                                                                    border: '1px solid #e5e7eb',
                                                                    padding: 4,
                                                                    zIndex: 20,
                                                                    minWidth: 140,
                                                                }}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRecall(m)}
                                                                    style={{
                                                                        width: '100%',
                                                                        textAlign: 'left',
                                                                        padding: '6px 8px',
                                                                        border: 'none',
                                                                        background: 'transparent',
                                                                        fontSize: 13,
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    Thu hồi tin nhắn
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEdit(m)}
                                                                    style={{
                                                                        width: '100%',
                                                                        textAlign: 'left',
                                                                        padding: '6px 8px',
                                                                        border: 'none',
                                                                        background: 'transparent',
                                                                        fontSize: 13,
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    Chỉnh sửa tin nhắn
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Ô nhập tin nhắn - nằm trong cột bên phải */}
                            <div
                                style={{
                                    padding: 10,
                                    borderTop: '1px solid #e5e7eb',
                                    display: 'flex',
                                    gap: 8,
                                    background: '#fff',
                                }}
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleSend()
                                        }
                                    }}
                                    placeholder={editingMessageId ? 'Chỉnh sửa tin nhắn...' : 'Nhập tin nhắn...'}
                                    style={{
                                        flex: 1,
                                        borderRadius: 999,
                                        border: '1px solid #d1d5db',
                                        padding: '8px 12px',
                                        fontSize: 14,
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    style={{
                                        borderRadius: 999,
                                        border: 'none',
                                        padding: '5px 8px',
                                        background: '#2563eb',
                                        color: '#fff',
                                        fontSize: 13,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <i className="bi bi-send" style={{ fontSize: 12 }} />
                                    {editingMessageId ? 'Lưu' : 'Gửi'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Chế độ: chỉ khung trò chuyện với 1 người (mở từ nút "Nhắn tin") */}
                    <div
                        style={{
                            borderBottom: '1px solid #e5e7eb',
                            background: '#f9fafb',
                            flex: 1,
                            minHeight: 0,
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                background: '#f9fafb',
                            }}
                        >
                            {headerPartner && (
                                <div
                                    style={{
                                        padding: '8px 12px',
                                        borderBottom: '1px solid #e5e7eb',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        background: '#f3f4ff',
                                    }}
                                >
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={headerPartner.avatar}
                                            alt={headerPartner.name}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '1px solid #e5e7eb',
                                            }}
                                        />
                                        {headerPartner.isOnline && (
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    bottom: 0,
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    background: '#22c55e',
                                                    border: '1px solid #fff',
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>
                                            {headerPartner.name}
                                        </span>
                                        <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                            {getPartnerStatusText()}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div
                                style={{
                                    flex: 1,
                                    padding: '10px 14px',
                                    overflowY: 'auto',
                                    background: '#f9fafb',
                                }}
                            >
                                {msgs.length === 0 && (
                                    <div style={{ fontSize: 13, color: '#9ca3af' }}>
                                        Chưa có tin nhắn nào
                                    </div>
                                )}
                                {msgs.map((m) => {
                                    const isMe = m.fromUserId === user.id
                                    const isOpenMenu = activeMenuId === m.id
                                    return (
                                        <div
                                            key={m.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: isMe ? 'flex-end' : 'flex-start',
                                                marginBottom: 6,
                                            }}
                                            onMouseEnter={(e) => {
                                                const row = e.currentTarget.querySelector('.chat-reaction-row')
                                                if (row && !isMe) row.style.opacity = 1
                                            }}
                                            onMouseLeave={(e) => {
                                                const row = e.currentTarget.querySelector('.chat-reaction-row')
                                                if (row && !isMe) row.style.opacity = 0
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: isMe ? 'row-reverse' : 'row',
                                                    alignItems: 'flex-end',
                                                    gap: 6,
                                                    position: 'relative',
                                                }}
                                            >
                                                {!isMe && (
                                                    <img
                                                        src={headerPartner?.avatar}
                                                        alt={headerPartner?.name || 'Người dùng'}
                                                        style={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            border: '1px solid #e5e7eb',
                                                        }}
                                                    />
                                                )}
                                                <div
                                                    title={formatTime(m.time)}
                                                    style={{
                                                        maxWidth: '80%',
                                                        padding: '8px 12px',
                                                        borderRadius: 999,
                                                        fontSize: 14,
                                                        lineHeight: 1.4,
                                                        background: isMe ? '#2563eb' : '#e5e7eb',
                                                        color: isMe ? '#fff' : '#111827',
                                                        cursor: 'default',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {m.content}
                                                </div>
                                                {m.reaction && (
                                                    <span
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: -6,
                                                            right: isMe ? 4 : 'auto',
                                                            left: isMe ? 'auto' : 4,
                                                            background: 'transparent',
                                                            borderRadius: 999,
                                                            padding: '0 2px',
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        {m.reaction}
                                                    </span>
                                                )}
                                                {isMe ? (
                                                    <>
                                                        <button
                                                            className="chat-menu-btn"
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveMenuId((prev) => (prev === m.id ? null : m.id))
                                                            }
                                                            style={{
                                                                border: 'none',
                                                                background: 'transparent',
                                                                cursor: 'pointer',
                                                                padding: 2,
                                                                color: '#9ca3af',
                                                            }}
                                                            title="Tùy chọn"
                                                        >
                                                            <i className="bi bi-three-dots-vertical" style={{ fontSize: 14 }} />
                                                        </button>

                                                        {isOpenMenu && (
                                                            <div
                                                                className="chat-menu"
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '100%',
                                                                    right: 0,
                                                                    marginTop: 4,
                                                                    background: '#fff',
                                                                    borderRadius: 8,
                                                                    boxShadow: '0 8px 16px rgba(15,23,42,0.15)',
                                                                    border: '1px solid #e5e7eb',
                                                                    padding: 4,
                                                                    zIndex: 20,
                                                                    minWidth: 140,
                                                                }}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRecall(m)}
                                                                    style={{
                                                                        width: '100%',
                                                                        textAlign: 'left',
                                                                        padding: '6px 8px',
                                                                        border: 'none',
                                                                        background: 'transparent',
                                                                        fontSize: 13,
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    Thu hồi tin nhắn
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEdit(m)}
                                                                    style={{
                                                                        width: '100%',
                                                                        textAlign: 'left',
                                                                        padding: '6px 8px',
                                                                        border: 'none',
                                                                        background: 'transparent',
                                                                        fontSize: 13,
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    Chỉnh sửa tin nhắn
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 4,
                                                            paddingLeft: 4,
                                                            opacity: 0,
                                                            transition: 'opacity 0.15s ease-in-out',
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: 0,
                                                            marginTop: 2,
                                                        }}
                                                        className="chat-reaction-row"
                                                    >
                                                        {['👍', '❤️', '😊'].map((icon) => (
                                                            <button
                                                                key={icon}
                                                                type="button"
                                                                onClick={() =>
                                                                    setMessageReaction?.(
                                                                        m.id,
                                                                        m.reaction === icon ? null : icon
                                                                    )
                                                                }
                                                                style={{
                                                                    border: 'none',
                                                                    background: 'transparent',
                                                                    cursor: 'pointer',
                                                                    padding: 0,
                                                                    fontSize: 14,
                                                                }}
                                                            >
                                                                {icon}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Ô nhập tin nhắn - chế độ 1 người */}
                            <div
                                style={{
                                    padding: 10,
                                    borderTop: '1px solid #e5e7eb',
                                    display: 'flex',
                                    gap: 8,
                                    background: '#fff',
                                }}
                            >
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleSend()
                                        }
                                    }}
                                    placeholder="Nhập tin nhắn..."
                                    style={{
                                        flex: 1,
                                        borderRadius: 999,
                                        border: '1px solid #d1d5db',
                                        padding: '8px 12px',
                                        fontSize: 14,
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    style={{
                                        borderRadius: 999,
                                        border: 'none',
                                        padding: '6px 10px',
                                        background: '#2563eb',
                                        color: '#fff',
                                        fontSize: 13,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 3,
                                    }}
                                >
                                    <i className="bi bi-send" style={{ fontSize: 14 }} />
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

