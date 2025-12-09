import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function EditProfile({ onNavigate }) {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const [verifiedPlatforms, setVerifiedPlatforms] = useState([])
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
      setLocation(user.location || '')
      setBio(user.bio || '')
      setAvatar(user.avatar || '')
      setVerified(Boolean(user.verified))
      setVerifiedPlatforms(Array.isArray(user.verifiedPlatforms) ? user.verifiedPlatforms : [])
    }
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setError(null)
    if (!name) return setError('Vui lòng nhập tên')
    setLoading(true)
    try {
      await updateProfile(user.id, { name, phone, location, bio, avatar, verified, verifiedPlatforms })
      setLoading(false)
      // Sau khi lưu, điều hướng về trang cá nhân
      onNavigate?.('user-profile', user.id)
    } catch (err) {
      setLoading(false)
      setError(err?.message || 'Lưu thất bại')
    }
  }

  if (!user) return null

  // layout styles
  const page = { minHeight: '100vh', padding: 24, background: '#f3f4f6' }
  const wrapper = { maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }
  const leftCard = { background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)' }
  const rightCard = { background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)' }
  const avatarStyle = { width: 120, height: 120, borderRadius: 12, objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 6px 18px rgba(15,23,42,0.08)' }
  const label = { fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 6, display: 'block' }
  const input = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e6edf3', outline: 'none', boxSizing: 'border-box' }
  const textareaStyle = { width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #e6edf3', minHeight: 120, resize: 'vertical' }
  const saveBtn = { padding: '12px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }
  const cancelBtn = { padding: '12px 18px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, cursor: 'pointer' }

  const badge = (bg, color) => ({ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 999, background: bg, color, fontWeight: 700 })

  return (
    <div style={page}>
      <div style={wrapper}>
        <div style={leftCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={avatar || `https://i.pravatar.cc/150?u=${user.id}`} alt="avatar" style={avatarStyle} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{name || user.name}</div>
              <div style={{ color: '#6b7280', marginTop: 6 }}>{user.email}</div>
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ color: '#6b7280' }}>Số điện thoại</div>
              <div style={{ fontWeight: 700 }}>{phone || (user.phone || 'Chưa có')}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ color: '#6b7280' }}>Địa chỉ</div>
              <div style={{ fontWeight: 700 }}>{location || (user.location || 'Chưa có')}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280', marginBottom: 8 }}>Xác thực</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {verifiedPlatforms && verifiedPlatforms.length > 0 ? (
                  verifiedPlatforms.map((p) => (
                    <div key={p} style={badge('#ecfeff', '#064e3b')}>{p}</div>
                  ))
                ) : (
                  <div style={badge('#fff7ed', '#92400e')}>Chưa xác thực</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={rightCard}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Chỉnh sửa thông tin cá nhân</h2>
          {error && <div style={{ background: '#fee2e2', padding: 10, borderRadius: 8, color: '#b91c1c' }}>{error}</div>}

          <form onSubmit={handleSave} style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={label}>Họ và tên</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={input}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,99,235,0.08)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e6edf3'; e.currentTarget.style.boxShadow = ''; }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={label}>Số điện thoại</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} style={input}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,99,235,0.08)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e6edf3'; e.currentTarget.style.boxShadow = ''; }}
                />
              </div>
              <div>
                <label style={label}>Địa chỉ</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} style={input}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,99,235,0.08)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e6edf3'; e.currentTarget.style.boxShadow = ''; }}
                />
              </div>
            </div>

            <div>
              <label style={label}>Tiểu sử / Giới thiệu</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={textareaStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,99,235,0.08)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e6edf3'; e.currentTarget.style.boxShadow = ''; }}
              />
            </div>

            <div>
              <label style={label}>Avatar (URL)</label>
              <input value={avatar} onChange={(e) => setAvatar(e.target.value)} style={input}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,99,235,0.08)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e6edf3'; e.currentTarget.style.boxShadow = ''; }}
              />
            </div>

            <div> 
              <label style={label}>Xác thực tài khoản</label>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={verifiedPlatforms.includes('email')} onChange={(e) => {
                    const next = e.target.checked ? [...verifiedPlatforms, 'email'] : verifiedPlatforms.filter(p => p !== 'email')
                    setVerifiedPlatforms(next)
                    setVerified(next.length > 0)
                  }} />
                  Email
                </label>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={verifiedPlatforms.includes('facebook')} onChange={(e) => {
                    const next = e.target.checked ? [...verifiedPlatforms, 'facebook'] : verifiedPlatforms.filter(p => p !== 'facebook')
                    setVerifiedPlatforms(next)
                    setVerified(next.length > 0)
                  }} />
                  Facebook
                </label>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={verifiedPlatforms.includes('apple')} onChange={(e) => {
                    const next = e.target.checked ? [...verifiedPlatforms, 'apple'] : verifiedPlatforms.filter(p => p !== 'apple')
                    setVerifiedPlatforms(next)
                    setVerified(next.length > 0)
                  }} />
                  Apple
                </label>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={verified} onChange={(e) => {
                    const v = e.target.checked
                    setVerified(v)
                    if (!v) setVerifiedPlatforms([])
                    else if (verifiedPlatforms.length === 0) setVerifiedPlatforms(['email'])
                  }} />
                  Đã xác thực (tổng quan)
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
              <button type="button" onClick={() => onNavigate?.('user-profile', user.id)} style={cancelBtn}>Hủy</button>
              <button type="submit" disabled={loading} style={saveBtn}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
