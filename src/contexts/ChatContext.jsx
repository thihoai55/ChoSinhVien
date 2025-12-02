import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { getUsers } from '../data/userData'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const { user } = useAuth()
  const [allMessages, setAllMessages] = useState([]) // dạng: {id, fromUserId, toUserId, content, time, read:false}
  const [isOpen, setIsOpen] = useState(false)
  const [targetUserId, setTargetUserId] = useState(null)

  // Đọc toàn bộ lịch sử chat từ localStorage (dùng chung cho tất cả tài khoản)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('sv_exchange_chats')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setAllMessages(parsed)
        }
      }
    } catch {}
  }, [])

  // Ghi toàn bộ lịch sử chat vào localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem('sv_exchange_chats', JSON.stringify(allMessages))
    } catch {}
  }, [allMessages])

  const sendMessage = useCallback((toUserId, content) => {
    if (!user || !toUserId || !content.trim()) return
    setAllMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        fromUserId: user.id,
        toUserId,
        content,
        time: new Date().toISOString(),
        read: false,
        edited: false,
        recalled: false,
        reaction: null,
      },
    ])
  }, [user])

  const editMessage = useCallback((messageId, newContent) => {
    if (!user || !messageId || !newContent.trim()) return
    setAllMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId && String(m.fromUserId) === String(user.id) && !m.recalled) {
          return { ...m, content: newContent, edited: true }
        }
        return m
      })
    )
  }, [user])

  const setMessageReaction = useCallback((messageId, reaction) => {
    if (!user || !messageId) return
    setAllMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          return { ...m, reaction }
        }
        return m
      })
    )
  }, [user])

  const recallMessage = useCallback((messageId) => {
    if (!user || !messageId) return
    setAllMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId && String(m.fromUserId) === String(user.id) && !m.recalled) {
          return {
            ...m,
            content: 'Tin nhắn đã được thu hồi',
            recalled: true,
          }
        }
        return m
      })
    )
  }, [user])

  const markConversationRead = useCallback((convId) => {
    if (!user) return
    setAllMessages((prev) => {
      const msgs = [...prev]
      const [otherId] = convId.split('-').filter((id) => String(id) !== String(user.id))
      if (!otherId) return prev
      return msgs.map((m) => {
        if (
          String(m.toUserId) === String(user.id) &&
          (String(m.fromUserId) === String(otherId) || String(m.toUserId) === String(otherId))
        ) {
          return { ...m, read: true }
        }
        return m
      })
    })
  }, [user])

  // Tạo danh sách cuộc trò chuyện cho user hiện tại
  const conversations = (() => {
    if (!user) return []
    const myId = String(user.id)
    const related = allMessages.filter(
      (m) => String(m.fromUserId) === myId || String(m.toUserId) === myId
    )

    const byPartner = new Map()
    related.forEach((m) => {
      const otherId = String(m.fromUserId) === myId ? String(m.toUserId) : String(m.fromUserId)
      if (!byPartner.has(otherId)) byPartner.set(otherId, [])
      byPartner.get(otherId).push(m)
    })

    const result = []
    byPartner.forEach((list, partnerId) => {
      const users = getUsers();
      const partnerUser = (users && users.find((u) => String(u.id) === String(partnerId))) || {
        id: partnerId,
        name: 'Người dùng',
        avatar: 'https://i.pravatar.cc/150?img=1',
      }
      const unreadCount = list.filter(
        (m) => String(m.toUserId) === myId && !m.read
      ).length
      const convId = myId < partnerId ? `${myId}-${partnerId}` : `${partnerId}-${myId}`

      // Thời điểm hoạt động gần nhất
      const sorted = [...list].sort((a, b) => new Date(a.time) - new Date(b.time))
      const lastMessage = sorted[sorted.length - 1] || null

      // Ưu tiên đọc trạng thái từ localStorage (login/logout)
      let presence = null
      try {
        const key = `sv_user_presence_${partnerId}`
        const raw = window.localStorage.getItem(key)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed && typeof parsed === 'object') presence = parsed
        }
      } catch {}

      const lastActive = presence?.lastActive || lastMessage?.time || null
      const isOnline = presence?.isOnline === true

      result.push({
        id: convId,
        partner: {
          id: partnerId,
          name: partnerUser.username || partnerUser.name,
          avatar: partnerUser.avatar,
          lastActive,
          isOnline,
        },
        messages: sorted,
        unreadCount,
      })
    })

    // Sắp xếp cuộc trò chuyện: mới nhất lên đầu
    result.sort((a, b) => {
      const ta = a.messages[a.messages.length - 1]?.time || 0
      const tb = b.messages[b.messages.length - 1]?.time || 0
      return tb.localeCompare(ta)
    })

    return result
  })()

  const unreadCount = (() => {
    if (!user) return 0
    const myId = String(user.id)
    return allMessages.filter(
      (m) => String(m.toUserId) === myId && !m.read
    ).length
  })()

  return (
    <ChatContext.Provider
      value={{
        allMessages,
        conversations,
        sendMessage,
        editMessage,
        recallMessage,
        setMessageReaction,
        unreadCount,
        markConversationRead,
        isOpen,
        targetUserId,
        openChatList: () => {
          setTargetUserId(null)
          setIsOpen(true)
        },
        openChatWith: (userId) => {
          if (!userId) return
          setTargetUserId(String(userId))
          setIsOpen(true)
        },
        toggleChat: () => setIsOpen((prev) => !prev),
        closeChat: () => setIsOpen(false),
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
