import React, { useState, useEffect, useRef } from "react";
import { usePosts } from "../contexts/PostContext";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { useChat } from "../contexts/ChatContext";
import Toast from "./Toast";
//import { mockUsers } from "../data/mockAuthor";
import { mockUsers } from "../data/userData"; 

export function UserProfilePage({ userId, onNavigate, onBack }) {
    const { posts = [] } = usePosts?.() || {};
    const { isAuthenticated = false, user = null } = useAuth?.() || {};
    const { addNotification } = useNotifications();
    const { openChatWith } = useChat?.() || {};

    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState("active");
    const [toastMessage, setToastMessage] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);

    const profile = mockUsers.find(u => String(u.id) === String(userId)) || mockUsers[0];
    const isOwnProfile = user?.id === userId;

    const userPosts = posts.filter((p) => String(p.authorId) === String(userId));
    const soldIndex = userPosts.length > 0 ? Math.ceil(userPosts.length * 0.7) : 0;
    const activePosts = userPosts.slice(0, soldIndex);
    const soldPosts = userPosts.slice(soldIndex);

    const showToast = (msg) => {
        setToastMessage(msg);
    };

    const handleFollow = () => {
        if (!isAuthenticated) {
            showToast("Vui lòng đăng nhập để theo dõi");
            return;
        }
        const nextFollowing = !isFollowing;
        setIsFollowing(nextFollowing);

        if (nextFollowing) {
            // Bắt đầu theo dõi: gửi thông báo cho chủ hồ sơ
            if (profile?.id && user?.id && profile.id !== user.id) {
                addNotification(profile.id, {
                    type: "follow",
                    fromUserId: user.id,
                    message: `${user.name || "Một người dùng"} đã bắt đầu theo dõi bạn`,
                });
            }
            showToast("Đã theo dõi người dùng!");
        } else {
            // Bỏ theo dõi: chỉ hiện toast, không cần thông báo
            showToast("Đã bỏ theo dõi");
        }
    };

    const handleMessage = () => {
        if (!isAuthenticated) {
            showToast("Vui lòng đăng nhập để nhắn tin");
            return;
        }
        if (!openChatWith || !profile?.id) return;
        if (user && String(user.id) === String(profile.id)) {
            showToast("Bạn không thể tự nhắn tin cho chính mình");
            return;
        }
        openChatWith(profile.id);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        showToast("Đã sao chép liên kết hồ sơ");
        setShowMenu(false);
    };

    const handleReport = () => {
        showToast("Đã gửi báo cáo vi phạm");
        setShowMenu(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    // --- STYLES & HELPERS ---
    const Icon = ({ name, size = 16, color = "#475569" }) => (
        <i className={`bi bi-${name}`} style={{ fontSize: size, color, verticalAlign: 'middle', flexShrink: 0 }} /> // Thêm flexShrink
    );

    const baseTransition = { transition: "all 0.2s ease-in-out" };

    const setHoverEffect = (e, shadowColor = "rgba(0,0,0,0.1)") => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 10px 20px ${shadowColor}`;
    };

    const removeHoverEffect = (e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
    };

    const colors = {
        primary: "#3b82f6",
        orange: "#f97316",
        green: "#10b981",
        grayBg: "#f1f5f9",
        lightGrayBg: "#f8fafc",
        textDark: "#1e293b",
        textLight: "#64748b",
        border: "#e5e7eb",
        danger: "#ef4444",
    };

    const cardShadow = '0 0 15px rgba(0, 0, 0, 0.07)';
    const postCardShadow = "0 4px 12px rgba(0,0,0,0.05)";

    const getVerifiedIcon = (platform) => {
        switch (platform) {
            case "facebook":
                return <Icon name="facebook" size={18} color="#1877F2" />;
            case "email":
                return <Icon name="envelope-fill" size={18} color={colors.primary} />;
            case "apple":
                return <Icon name="apple" size={18} color="#333" />;
            default:
                return <Icon name="check-circle-fill" size={18} color={colors.green} />;
        }
    };

    const styles = {
        button: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: 15,
            ...baseTransition,
        },
        buttonGhost: {
            background: 'transparent',
            color: colors.textDark,
        },
        buttonPrimary: {
            background: colors.primary,
            color: '#fff',
        },
        buttonOrange: {
            background: colors.orange,
            color: '#fff',
        },
        buttonOutline: {
            background: '#fff',
            color: colors.textDark,
            border: `1px solid ${colors.border}`,
        },
        card: {
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: cardShadow,
        },
        tabsList: {
            display: 'flex',
            gap: 8,
            background: colors.grayBg,
            padding: 4,
            borderRadius: 8,
        },
        tabsTrigger: (isActive) => ({
            padding: '6px 12px',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 500,
            color: isActive ? colors.textDark : colors.textLight,
            background: isActive ? '#fff' : 'transparent',
            boxShadow: isActive ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
            ...baseTransition,
        }),
        postCard: {
            border: `1px solid ${colors.border}`,
            borderRadius: 10,
            background: "#fff",
            overflow: "hidden",
            cursor: "pointer",
            boxShadow: postCardShadow,
            ...baseTransition,
        }
    };
    
    if (!profile) {
        return (
            <div style={{ minHeight: "100vh", background: colors.lightGrayBg, padding: 40, textAlign: 'center' }}>
                <h3>Không tìm thấy người dùng</h3>
                <button
                    style={{ ...styles.button, ...styles.buttonPrimary, marginTop: 16 }}
                    onClick={() => onNavigate("home")}
                >
                    <Icon name="arrow-left" size={18} color="#fff" />
                    Về trang chủ
                </button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: colors.lightGrayBg }}>
            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
            )}

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
                {/* Back Button */}
                <div style={{ marginBottom: 16 }}>
                    <button
                        style={{ ...styles.button, ...styles.buttonGhost }}
                        onClick={onBack}
                        onMouseEnter={(e) => e.currentTarget.style.background = colors.grayBg}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <Icon name="arrow-left" size={18} />
                        Quay lại
                    </button>
                </div>

                {/* Main Content - 2 Columns */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '30% 1fr',
                    gap: 24,
                    alignItems: 'flex-start'
                }}>

                    {/* Left Sidebar - Profile Info */}
                    <div style={{ position: 'sticky', top: 96 }}>
                        <div style={styles.card}>

                            {/* Nút 3 chấm và Menu */}
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', marginBottom: 16, height: 32 }}>
                                <button
                                    ref={menuButtonRef}
                                    onClick={() => setShowMenu(!showMenu)}
                                    style={{ ...styles.button, ...styles.buttonGhost, padding: 6, width: 32, height: 32 }}
                                    title="Tùy chọn"
                                    onMouseEnter={(e) => e.currentTarget.style.background = colors.grayBg}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Icon name="three-dots-vertical" size={18} color={colors.textLight} />
                                </button>

                                {showMenu && (
                                    <div
                                        ref={menuRef}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            background: '#fff',
                                            borderRadius: 8,
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                            border: `1px solid ${colors.border}`,
                                            zIndex: 10,
                                            width: 200,
                                            padding: '4px 0',
                                        }}>
                                        <button
                                            onClick={handleCopyLink}
                                            style={{ ...styles.button, ...styles.buttonGhost, width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = colors.grayBg}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <Icon name="link-45deg" size={16} /> Sao chép liên kết
                                        </button>
                                        <button
                                            onClick={handleReport}
                                            style={{ ...styles.button, ...styles.buttonGhost, width: '100%', justifyContent: 'flex-start', padding: '8px 12px', color: colors.danger }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = colors.grayBg}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <Icon name="exclamation-triangle-fill" size={16} color={colors.danger} /> Báo cáo vi phạm
                                        </button>
                                    </div>
                                )}
                            </div>


                            {/* Avatar */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        style={{
                                            width: 96,
                                            height: 96,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '4px solid #fff',
                                            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    {profile.verified && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            background: colors.green,
                                            padding: 6,
                                            borderRadius: '50%',
                                            border: '3px solid #fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Icon name="check-lg" size={14} color="#fff" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name & Bio */}
                            <h2 style={{ fontSize: 20, fontWeight: 600, textAlign: 'center', color: colors.textDark, margin: 0 }}>
                                {profile.name}
                            </h2>
                            <p style={{ fontSize: 14, textAlign: 'center', color: colors.textLight, marginTop: 4, minHeight: '1.25rem' }}>
                                {profile.bio}
                            </p>

                            {/* Rating */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '16px 0' }}>
                                <span style={{ fontWeight: 700, fontSize: 18, color: colors.textDark }}>{profile.rating.toFixed(1)}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Icon
                                            key={i}
                                            name="star-fill"
                                            size={16}
                                            color={i < Math.floor(profile.rating) ? "#facc15" : "#e2e8f0"}
                                        />
                                    ))}
                                </div>
                                <span style={{ color: colors.primary, fontSize: 14, fontWeight: 500 }}>
                                    ( {profile.totalReviews} đánh giá )
                                </span>
                            </div>

                            {/* Followers Stats */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 16, fontSize: 14 }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ color: colors.textLight }}>Người theo dõi: </span>
                                    <span style={{ fontWeight: 600, color: colors.textDark }}>{profile.followers}</span>
                                </div>
                                <div style={{ height: 16, width: 1, background: colors.border }}></div>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ color: colors.textLight }}>Đang theo dõi: </span>
                                    <span style={{ fontWeight: 600, color: colors.textDark }}>{profile.following}</span>
                                </div>
                            </div>

                            {/* Follow Button */}
                            {!isOwnProfile && (
                                <button
                                    onClick={handleFollow}
                                    style={{
                                        ...styles.button,
                                        ...(isFollowing ? { background: colors.grayBg, color: colors.textDark } : styles.buttonOrange),
                                        width: '100%',
                                        marginBottom: 16,
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = 0.8}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
                                >
                                    {isFollowing ? (
                                        <>
                                            <Icon name="person-check-fill" size={18} color={colors.textDark} />
                                            Đang theo dõi
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="person-plus-fill" size={18} color="#fff" />
                                            Theo dõi
                                        </>
                                    )}
                                </button>
                            )}

                            <hr style={{ border: 'none', height: 1, background: colors.border, margin: '16px 0' }} />

                            {/* Profile Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <Icon name="chat-dots-fill" size={16} color={colors.textLight} style={{ marginTop: 2 }} />
                                    <div>
                                        <span style={{ color: colors.textLight }}>Phản hồi chat: </span>
                                        <span style={{ fontWeight: 600, color: colors.textDark }}>
                                            {profile.responseTime.rate}%
                                            <span style={{ fontWeight: 500, color: colors.textLight, marginLeft: 4 }}>
                                                ({profile.responseTime.label})
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <Icon name="calendar-check-fill" size={16} color={colors.textLight} style={{ marginTop: 2 }} />
                                    <div>
                                        <span style={{ color: colors.textLight }}>Đã tham gia: </span>
                                        <span style={{ fontWeight: 500, color: colors.textDark }}>{profile.joinedDate}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <Icon name="geo-alt-fill" size={16} color={colors.textLight} style={{ marginTop: 2 }} />
                                    <div>
                                        <span style={{ color: colors.textLight }}>Địa chỉ: </span>
                                        <span style={{ fontWeight: 500, color: colors.textDark }}>{profile.location}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <Icon name="patch-check-fill" size={16} color={colors.textLight} style={{ marginTop: 2 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: colors.textLight, marginBottom: 8 }}>Đã xác thực:</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                            {profile.verifiedPlatforms.map((platform) => (
                                                <div
                                                    key={platform}
                                                    style={{
                                                        background: colors.grayBg,
                                                        padding: 8,
                                                        borderRadius: 8,
                                                        display: 'flex',
                                                        ...baseTransition,
                                                    }}
                                                    title={platform}
                                                >
                                                    {getVerifiedIcon(platform)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Message Button */}
                            {!isOwnProfile && (
                                <>
                                    <hr style={{ border: 'none', height: 1, background: colors.border, margin: '16px 0' }} />
                                    <button
                                        onClick={handleMessage}
                                        style={{ ...styles.button, ...styles.buttonOutline, width: '100%' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = colors.grayBg}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                    >
                                        <Icon name="chat-dots-fill" size={16} />
                                        Nhắn tin
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Content - Posts */}
                    <div>
                        <div style={styles.card}>
                            {/* TABS TỰ TẠO */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                                    <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.textDark, margin: 0 }}>
                                        Bài đăng
                                    </h2>
                                    <div style={styles.tabsList}>
                                        <button
                                            style={styles.tabsTrigger(activeTab === "active")}
                                            onClick={() => setActiveTab("active")}
                                        >
                                            Đang bán ({activePosts.length})
                                        </button>
                                        <button
                                            style={styles.tabsTrigger(activeTab === "sold")}
                                            onClick={() => setActiveTab("sold")}
                                        >
                                            Đã bán ({soldPosts.length})
                                        </button>
                                    </div>
                                </div>

                                {/* --- TABS CONTENT: ACTIVE --- */}
                                {activeTab === 'active' && (
                                    <div>
                                        {activePosts.length > 0 ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                                                {activePosts.map((post) => (
                                                    <div
                                                        key={post.id}
                                                        style={styles.postCard}
                                                        onClick={() => onNavigate("post-detail", post.id)}
                                                        onMouseEnter={(e) => setHoverEffect(e)}
                                                        onMouseLeave={(e) => removeHoverEffect(e)}
                                                    >
                                                        {/* Khối ảnh */}
                                                        {post.image && (
                                                            <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: colors.grayBg }}>
                                                                <img
                                                                    src={post.image}
                                                                    alt={post.title}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', ...baseTransition }}
                                                                />
                                                                {/* ✅ --- THAY ĐỔI: Icon Tim đã "nhạt" bớt --- */}
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    top: 12,
                                                                    right: 12,
                                                                   background: colors.redMuted, // Nền mờ hơn
                                                                    color: '#fff',
                                                                    padding: '4px 8px',
                                                                    borderRadius: 6,
                                                                    fontSize: 13,
                                                                    fontWeight: 500,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 4
                                                                }}>
                                                                    {/* Icon mờ, chữ rõ */}
                                                                    <Icon name="heart-fill" size={14} color="rgba(255, 255, 255, 0.8)" />
                                                                    {post.likes}
                                                                </div>
                                                                {/* ✅ --- KẾT THÚC THAY ĐỔI --- */}
                                                            </div>
                                                        )}
                                                        
                                                        {/* ✅ --- THAY ĐỔI: Khối nội dung "văn bản đơn giản" --- */}
                                                        <div style={{ padding: 16 }}>
                                                            <h4 style={{
                                                                margin: '0 0 2px', // Gần giá hơn
                                                                color: colors.textDark,
                                                                fontWeight: 600,
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                minHeight: '2.5em'
                                                            }}>
                                                                {post.title}
                                                            </h4>
                                                            
                                                            {/* Giá */}
                                                            <div style={{
                                                                color: colors.green,
                                                                fontSize: 15,
                                                                fontWeight: 700,
                                                                margin: '0 0 8px 0' // Điều chỉnh margin
                                                            }}>
                                                                {post.price || "Miễn phí"}
                                                            </div>
                                                            
                                                            {/* Thời gian */}
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 6,
                                                                fontSize: 13,
                                                                color: colors.textLight,
                                                                marginBottom: 4 // Cách địa chỉ
                                                            }}>
                                                                <Icon name="clock" size={14} />
                                                                {post.createdAt || "Vừa xong"}
                                                            </div>

                                                            {/* Địa chỉ */}
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start', // Dùng flex-start để lỡ địa chỉ dài
                                                                gap: 6,
                                                                fontSize: 13,
                                                                color: colors.textLight
                                                            }}>
                                                                <Icon name="geo-alt-fill" size={14} style={{ marginTop: 2 }}/>
                                                                <span>{post.address || "Việt Nam"}</span>
                                                            </div>
                                                        </div>
                                                        {/* ✅ --- KẾT THÚC THAY ĐỔI --- */}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '64px 0', color: colors.textLight }}>
                                                <Icon name="chat-square-dots" size={48} color="#cbd5e1" />
                                                <p style={{ marginTop: 16, fontSize: 16 }}>Chưa có bài đăng nào đang bán</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* --- TABS CONTENT: SOLD --- */}
                                {activeTab === 'sold' && (
                                    <div>
                                        {soldPosts.length > 0 ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                                                {soldPosts.map((post) => (
                                                    <div
                                                        key={post.id}
                                                        style={{
                                                            ...styles.postCard,
                                                            opacity: 0.65,
                                                            cursor: isOwnProfile ? 'pointer' : 'default',
                                                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                                                        }}
                                                        onClick={isOwnProfile ? () => onNavigate("post-detail", post.id) : undefined}
                                                        onMouseEnter={isOwnProfile ? (e) => setHoverEffect(e, 'rgba(0,0,0,0.04)') : undefined}
                                                        onMouseLeave={isOwnProfile ? removeHoverEffect : undefined}
                                                    >
                                                        {/* Khối ảnh */}
                                                        {post.image && (
                                                            <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: colors.grayBg }}>
                                                                <img
                                                                    src={post.image}
                                                                    alt={post.title}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(80%)' }}
                                                                />
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    top: 12,
                                                                    right: 12,
                                                                    background: 'rgba(50,50,50,0.7)',
                                                                    color: '#e2e8f0',
                                                                    padding: '4px 8px',
                                                                    borderRadius: 6,
                                                                    fontSize: 13,
                                                                    fontWeight: 500,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 4
                                                                }}>
                                                                    <Icon name="heart-fill" size={14} color="#e2e8f0" />
                                                                    {post.likes}
                                                                </div>
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    bottom: 12,
                                                                    left: 12,
                                                                    background: 'rgba(50,50,50,0.9)',
                                                                    color: '#fff',
                                                                    padding: '4px 10px',
                                                                    borderRadius: 6,
                                                                    fontSize: 15,
                                                                    fontWeight: 700,
                                                                }}>
                                                                    Đã bán
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* ✅ --- THAY ĐỔI: Khối nội dung "văn bản đơn giản" (Đã bán, chỉ chủ bài có thể bấm xem chi tiết) --- */}
                                                        <div style={{ padding: 16 }}>
                                                            <h4 style={{
                                                                margin: '0 0 8px',
                                                                color: colors.textLight,
                                                                fontWeight: 600,
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                minHeight: '2.5em'
                                                            }}>
                                                                {post.title}
                                                            </h4>

                                                            {/* Giá (gạch ngang) */}
                                                            <div style={{
                                                                color: colors.textLight,
                                                                fontSize: 15,
                                                                fontWeight: 700,
                                                                margin: '4px 0 10px 0',
                                                                textDecoration: 'line-through'
                                                            }}>
                                                                {post.price || "Miễn phí"}
                                                            </div>

                                                            {/* Thời gian (mờ) */}
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 6,
                                                                fontSize: 13,
                                                                color: '#cbd5e1',
                                                                marginBottom: 4
                                                            }}>
                                                                <Icon name="clock" size={14} color="#cbd5e1" />
                                                                {post.createdAt || "Vừa xong"}
                                                            </div>

                                                            {/* Địa chỉ (mờ) */}
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: 6,
                                                                fontSize: 13,
                                                                color: '#cbd5e1'
                                                            }}>
                                                                <Icon name="geo-alt-fill" size={14} color="#cbd5e1" style={{ marginTop: 2 }}/>
                                                                <span>{post.address || "Việt Nam"}</span>
                                                            </div>
                                                        </div>
                                                        {/* ✅ --- KẾT THÚC THAY ĐỔI --- */}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '64px 0', color: colors.textLight }}>
                                                <Icon name="check-circle" size={48} color="#cbd5e1" />
                                                <p style={{ marginTop: 16, fontSize: 16 }}>Chưa có bài đăng nào đã bán</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* KẾT THÚC TABS */}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}