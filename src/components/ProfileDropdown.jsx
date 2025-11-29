import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useWallet } from '../contexts/WalletContext'

export default function ProfileDropdown({ user, onNavigate }) {
    const { logout } = useAuth();
    const { balance } = useWallet();

    // State riêng của component này
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [hoveredLink, setHoveredLink] = useState(null)
    const dropdownRef = useRef(null)

    // Hook để đóng dropdown khi bấm ra ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    // --- STYLES (Đã chuyển từ Header.jsx sang) ---
    const profileContainer = { position: 'relative' }; 
    const avatarBtn = {
        display: 'flex',
        alignItems: 'center',
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '4px 12px 4px 4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        outline: 'none'
    };
    const avatarImg = {
        width: 32,
        height: 32,
        borderRadius: '50%',
        objectFit: 'cover',
        marginRight: 8,
    };
    const avatarBtnHover = {
        ...avatarBtn,
        borderColor: '#c7d2fe',
        background: '#eef2ff',
        boxShadow: '0 2px 4px rgba(0,0,0,.04)',
        transform: 'translateY(-2px)',
        outline: 'none'
    };
    const dropdownMenu = {
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        boxShadow: '0 8px 16px rgba(0,0,0,.1)',
        minWidth: 220,
        padding: 8,
        zIndex: 100,
        opacity: isDropdownOpen ? 1 : 0,
        transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        pointerEvents: isDropdownOpen ? 'auto' : 'none',
    };
    const dropdownLink = {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '8px 12px',
        background: 'transparent',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        borderRadius: 6,
        color: '#374151',
        outline: 'none',
        fontSize: 14,
        fontWeight: 500,
    };
    const dropdownLinkHover = {
        ...dropdownLink,
        background: '#f3f4f6',
    };
    const dropdownLinkDanger = { ...dropdownLink, color: '#ef4444' };
    const dropdownLinkDangerHover = { ...dropdownLinkDanger, background: '#fee2e2' };
    const dropdownDivider = { height: 1, background: '#e5e7eb', margin: '8px 0' };
    // --- Hết Styles ---

    // Hàm tiện ích để vừa điều hướng vừa đóng dropdown
    // Thêm 'data' làm tham số
    const handleNav = (page, data) => {
        onNavigate(page, data); // Truyền 'data' cho onNavigate
        setIsDropdownOpen(false);
    }

    return (
        <div style={profileContainer} ref={dropdownRef}>
            {/* Nút Avatar (bây giờ sẽ mở dropdown) */}
            <button
                style={hovered ? avatarBtnHover : avatarBtn}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseDown={(e) => e.preventDefault()}
                onFocus={(e) => e.currentTarget.blur()}
            >
                <img src={user.avatar} style={avatarImg} alt="avatar" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 8 }}>
                    <span style={{ fontWeight: 500, color: '#111827', fontSize: 14 }}>{user.name}</span>
                    <span style={{ fontWeight: 600, color: '#10b981', fontSize: 12 }}>
                        {balance.toLocaleString('vi-VN')}đ
                    </span>
                </div>
                <i 
                    className={`bi ${isDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}
                    style={{ fontSize: 12, marginLeft: 8, color: '#6b7280', transition: 'transform 0.2s' }}
                ></i>
            </button>

            {/* Menu Dropdown */}
            <div style={dropdownMenu}>
                {/* Link 1: Trang cá nhân */}
                <button
                    style={hoveredLink === 'profile' ? dropdownLinkHover : dropdownLink}
                    onMouseEnter={() => setHoveredLink('profile')}
                    onMouseLeave={() => setHoveredLink(null)}
                    // Sửa 'profile' thành 'user-profile' và truyền user.id
                    onClick={() => handleNav('user-profile', user.id)}
                >
                    <i className="bi bi-person-circle" style={{fontSize: 16, color: '#6b7280'}}></i>
                    <span>Trang cá nhân</span>
                </button>
                
                {/* Link 2: Quản lý bài đăng */}
                <button
                    style={hoveredLink === 'posts' ? dropdownLinkHover : dropdownLink}
                    onMouseEnter={() => setHoveredLink('posts')}
                    onMouseLeave={() => setHoveredLink(null)}
                    onClick={() => handleNav('my-posts')}
                >
                    <i className="bi bi-card-list" style={{fontSize: 16, color: '#6b7280'}}></i>
                    <span>Bài đăng của tôi</span>
                </button>

                {/* Link 3: Lịch sử giao dịch */}
                <button
                    style={hoveredLink === 'transactions' ? dropdownLinkHover : dropdownLink}
                    onMouseEnter={() => setHoveredLink('transactions')}
                    onMouseLeave={() => setHoveredLink(null)}
                    onClick={() => handleNav('transaction-history')}
                >
                    <i className="bi bi-clock-history" style={{fontSize: 16, color: '#6b7280'}}></i>
                    <span>Lịch sử giao dịch</span>
                </button>

                {/* Link 4: Nạp tiền */}
                <button
                    style={hoveredLink === 'recharge' ? dropdownLinkHover : dropdownLink}
                    onMouseEnter={() => setHoveredLink('recharge')}
                    onMouseLeave={() => setHoveredLink(null)}
                    onClick={() => handleNav('recharge')}
                >
                    <i className="bi bi-wallet2" style={{fontSize: 16, color: '#6b7280'}}></i>
                    <span>Nạp tiền</span>
                </button>

                {/* Đường kẻ ngang */}
                <div style={dropdownDivider}></div>
                
                {/* Link 5: Đăng xuất */}
                <button
                    style={hoveredLink === 'logout' ? dropdownLinkDangerHover : dropdownLinkDanger}
                    onMouseEnter={() => setHoveredLink('logout')}
                    onMouseLeave={() => setHoveredLink(null)}
                    onClick={() => {
                        // Đăng xuất khỏi AuthContext
                        logout();
                        // Điều hướng để App reset về home/login
                        handleNav('logout');
                    }}
                >
                    <i className="bi bi-box-arrow-right" style={{fontSize: 16}}></i>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    )
}