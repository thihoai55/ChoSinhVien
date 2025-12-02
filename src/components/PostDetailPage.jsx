import React, { useState, useEffect, useRef } from "react";

import { usePosts } from "../contexts/PostContext";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { useChat } from "../contexts/ChatContext";

import Toast from "./Toast";
import { usePostInteractions } from "./ReplyCmt";
import { getTimeAgo } from "../utils/timeUtils";
import DeletePostModal from "./DeletePostModal";
import HidePostModal from "./HidePostModal";

export default function PostDetailPage({ postId, onNavigate }) {
    const { posts = [], comments = {}, ...postActions } = usePosts?.() || {};
    const { user = null, isAuthenticated = false } = useAuth?.() || {};
    const { openChatWith, isOpen: isChatOpen } = useChat?.() || {};

    const { addNotification } = useNotifications();

    const post = posts.find((p) => String(p.id) === String(postId));

    const postComments = comments[postId] || [];

    const authorPosts = post
        ? posts
            .filter(
                (p) =>
                    p.authorId === post.authorId && 
                    String(p.id) !== String(postId) &&
                    p.status !== 'pending' // Chỉ hiển thị bài đăng đã được duyệt
            )
            .slice(0, 4)
        : [];

    const [commentContent, setCommentContent] = useState("");

    const [toastMessage, setToastMessage] = useState(null);
    const [currentImage, setCurrentImage] = useState(post?.image || "");
    const [showPostMenu, setShowPostMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showHideModal, setShowHideModal] = useState(false);
    const postMenuRef = useRef(null);
    const postMenuButtonRef = useRef(null);

    const showToast = (msg) => setToastMessage(msg);

    const {
        isLikedLocal,
        isSavedLocal,
        replyingToCommentId,

        replyContent,
        likedComments,
        handleLike,
        handleSave,
        setReplyContent,
        setReplyingToCommentId,
        handleLikeComment,
        handleAddReply,
    } = usePostInteractions(post, postActions);

    // Auto-focus & scroll đến comment khi đi từ thông báo
    useEffect(() => {
        if (!post) return;
        if (typeof window === "undefined") return;

        try {
            const raw = window.sessionStorage.getItem("sv_focus_comment");
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (!parsed || parsed.postId !== post.id || !parsed.commentId) return;

            // Mở ô trả lời cho comment đó
            setReplyingToCommentId(parsed.commentId);

            // Cuộn đến đúng vị trí comment
            const el = document.getElementById(`comment-${parsed.commentId}`);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } catch (e) {
            // ignore
        } finally {
            try {
                window.sessionStorage.removeItem("sv_focus_comment");
            } catch {}
        }
    }, [post, setReplyingToCommentId]);

    useEffect(() => {
        // Ưu tiên lấy ảnh đầu tiên từ mảng images, nếu không có thì lấy image
        if (post?.images && post.images.length > 0) {
            setCurrentImage(post.images[0]);
        } else if (post?.image) {
            setCurrentImage(post.image);
        }
    }, [post]);

    // Đóng menu khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showPostMenu &&
                postMenuRef.current &&
                !postMenuRef.current.contains(event.target) &&
                postMenuButtonRef.current &&
                !postMenuButtonRef.current.contains(event.target)
            ) {
                setShowPostMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPostMenu]);

    if (!post) {
        return (
            <div style={{ textAlign: "center", padding: 40, background: '#f8fafc', minHeight: '100vh' }}> 
                <h3>Không tìm thấy bài viết</h3>
                <button
                    onClick={() => onNavigate?.("home")}
                    style={{
                        padding: "10px 18px", 
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 16, 
                        display: 'inline-flex', alignItems: 'center', gap: 8 
                    }}
                >
                    <i className="bi bi-arrow-left" style={{ fontSize: 18 }}></i> Quay lại trang chủ
                </button>
            </div>
        );
    }

    // Chỉ cho chủ bài đăng xem chi tiết bài đã bán
    const isOwner = user?.id && post?.authorId && String(user.id) === String(post.authorId);
    const authorAllPosts = posts.filter((p) => String(p.authorId) === String(post.authorId));
    const soldIndex = authorAllPosts.length > 0 ? Math.ceil(authorAllPosts.length * 0.7) : 0;
    const isSold = authorAllPosts.slice(soldIndex).some((p) => String(p.id) === String(post.id));
    
    // Kiểm tra nếu bài đăng đang chờ duyệt
    const isPending = post?.status === 'pending';

    // Không cho hiển thị chi tiết cho bài đã bị từ chối (theo yêu cầu): hướng người dùng về tab đã ẩn
    if (post?.status === 'rejected') {
        return (
            <div style={{ textAlign: "center", padding: 40, background: '#f8fafc', minHeight: '100vh' }}>
                <h3 style={{ color: '#ef4444', marginBottom: 16 }}>Bài đăng này đã bị từ chối và không hiển thị chi tiết.</h3>
                <p style={{ color: '#6b7280', marginBottom: 20 }}>Bạn có thể xem bài đăng này trong tab "Đã ẩn" trên trang cá nhân.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                    <button
                        onClick={() => {
                            try { window.sessionStorage.setItem('sv_profile_nav', JSON.stringify({ tab: 'hidden', focusPostId: post.id })); } catch {}
                            onNavigate?.('user-profile', post.authorId);
                        }}
                        style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' }}
                    >
                        Xem ở hồ sơ (Đã ẩn)
                    </button>
                    <button onClick={() => onNavigate?.('home')} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}>Về trang chủ</button>
                </div>
            </div>
        );
    }

    // Kiểm tra nếu bài đăng đang chờ duyệt và user không phải chủ bài thì không cho xem
    if (isPending && !isOwner) {
        return (
            <div style={{ textAlign: "center", padding: 40, background: '#f8fafc', minHeight: '100vh' }}>
                <h3 style={{ marginBottom: 16 }}>Bài đăng này đang chờ duyệt và chỉ người đăng mới có thể xem chi tiết</h3>
                <button
                    onClick={() => onNavigate?.("home")}
                    style={{
                        padding: "10px 18px",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 16,
                        display: 'inline-flex', alignItems: 'center', gap: 8
                    }}
                >
                    <i className="bi bi-arrow-left" style={{ fontSize: 18 }}></i> Quay lại trang chủ
                </button>
            </div>
        );
    }

    if (isSold && !isOwner) {
        return (
            <div style={{ textAlign: "center", padding: 40, background: '#f8fafc', minHeight: '100vh' }}>
                <h3 style={{ marginBottom: 16 }}>Bài đăng này đã bán và chỉ người đăng mới có thể xem chi tiết</h3>
                <button
                    onClick={() => onNavigate?.("home")}
                    style={{
                        padding: "10px 18px",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 16,
                        display: 'inline-flex', alignItems: 'center', gap: 8
                    }}
                >
                    <i className="bi bi-arrow-left" style={{ fontSize: 18 }}></i> Quay lại trang chủ
                </button>
            </div>
        );
    }

    const handleAddComment = () => {
        if (!isAuthenticated) {
            showToast("Vui lòng đăng nhập để bình luận!");
            return;
        }
        if (!commentContent.trim()) {
            showToast("Vui lòng nhập nội dung bình luận!");
            return;
        }
        const created = postActions.addComment?.(
            post.id,
            commentContent,
            user?.id || "guest",
            user?.name || "Khách",
            user?.avatar
        );

        // Tạo thông báo cho chủ bài viết nếu người bình luận khác chủ bài
        if (post?.authorId && user?.id && post.authorId !== user.id) {
            addNotification(post.authorId, {
                type: "comment",
                postId: post.id,
                fromUserId: user.id,
                commentId: created?.id,
                message: `${user.name || "Một người dùng"} đã bình luận về bài đăng của bạn`,
            });
        }

        setCommentContent("");
        showToast("Đã thêm bình luận!");
    };

    const handleCallPhone = () => {
        if (!isAuthenticated) {
            showToast("Vui lòng đăng nhập để xem số điện thoại!");
            return;
        }
        if (post.authorPhone) window.location.href = `tel:${post.authorPhone}`;
    };

    const handleShare = () => {
        try {
            navigator.clipboard.writeText(window.location.href);
            showToast("Đã sao chép link bài viết!");
        } catch (e) {
            showToast("Không thể sao chép link.");
        }
    };

    const handleChat = () => {
        if (!isAuthenticated) {
            showToast("Vui lòng đăng nhập để nhắn tin!");
            return;
        }
        if (!post?.authorId || !openChatWith) return;
        if (user && String(user.id) === String(post.authorId)) {
            showToast("Đây là bài đăng của bạn.");
            return;
        }
        openChatWith(post.authorId);
    };

    // Xử lý menu bài đăng
    const handleHidePost = () => {
        if (!isOwner) {
            showToast("Chỉ chủ bài đăng mới có thể ẩn bài đăng!");
            return;
        }
        setShowPostMenu(false);
        setShowHideModal(true);
    };

    const confirmHidePost = () => {
        postActions.hidePost?.(post.id);
        showToast("Đã ẩn bài đăng!");
        setShowHideModal(false);
        onNavigate?.("home");
    };

    const handleEditPost = () => {
        if (!isOwner) {
            showToast("Chỉ chủ bài đăng mới có thể sửa bài đăng!");
            return;
        }
        setShowPostMenu(false);
        onNavigate?.("edit-post", post.id);
    };

    const handleDeletePost = () => {
        if (!isOwner) {
            showToast("Chỉ chủ bài đăng mới có thể xóa bài đăng!");
            return;
        }
        setShowPostMenu(false);
        setShowDeleteModal(true);
    };

    const confirmDeletePost = () => {
        postActions.deletePost?.(post.id);
        showToast("Đã xóa bài đăng!");
        setShowDeleteModal(false);
        onNavigate?.("home");
    };

    // --- STYLES & HELPERS ---
    const Icon = ({ name, size = 16, color = "#475569" }) => (
        <i className={`bi bi-${name}`} style={{ fontSize: size, color }} />
    );
    const baseTransition = { transition: "all 0.2s ease-in-out" };
    const setHoverEffect = (e, shadowColor = "rgba(0,0,0,0.1)") => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 15px ${shadowColor}`;
    };
    const removeHoverEffect = (e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
    };
    const colors = {
        primary: "#3b82f6",
        green: "#10b981",
        red: "#f87171",
        yellow: "#facc15",
        grayBg: "#f1f5f9",
        textDark: "#1e293b",
        textLight: "#64748b",
        lightGrayBg: "#f8fafc" // Màu nền mới
    };

    // Bóng đổ nhẹ hơn để giao diện hài hòa hơn
    const cardShadow = '0 10px 30px rgba(15, 23, 42, 0.06)';

    // --- KẾT THÚC STYLES ---

    // Danh sách bài viết tương tự:
    // 1) Ưu tiên các bài cùng danh mục với bài hiện tại, sắp xếp theo lượt thích (likes)
    // 2) Nếu chưa đủ, bổ sung thêm các bài khác danh mục nhưng nhiều tương tác
    const sameCategory = posts
        .filter(
            (p) =>
                String(p.id) !== String(postId) &&
                p.category === post.category
        )
        .sort((a, b) => (b.likes || 0) - (a.likes || 0));

    const otherCategory = posts
        .filter(
            (p) =>
                String(p.id) !== String(postId) &&
                p.category !== post.category
        )
        .sort((a, b) => (b.likes || 0) - (a.likes || 0));

    const similarPosts = [...sameCategory, ...otherCategory].slice(0, 12);

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: 20,
                // SỬA 1: Đổi màu nền chính
                background: colors.lightGrayBg,
            }}
        >
            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
            )}

            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 30,
                }}
            >
                {/* Header Quay lại */}
                <div>
                    <button
                        onClick={() => onNavigate?.("home")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            border: "none",
                            background: "transparent",
                            color: colors.primary,
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: 18, // SỬA 2: Chữ to hơn
                            ...baseTransition,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
                    >
                        <Icon name="arrow-left" color={colors.primary} size={20} /> {/* SỬA 2: Icon to hơn */} Quay lại
                    </button>
                </div>

                {/* Main grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "68% 32%",
                        gap: 24,
                        alignItems: "flex-start",
                    }}
                >
                    {/* LEFT — bài viết */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 12,
                            boxShadow: cardShadow,
                            padding: 20,
                            position: "relative",
                        }}
                    >
                        {/* Nút 3 chấm menu - chỉ hiển thị cho chủ bài đăng */}
                        {isOwner && (
                            <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
                                <button
                                    ref={postMenuButtonRef}
                                    onClick={() => setShowPostMenu(!showPostMenu)}
                                    style={{
                                        background: "rgba(255, 255, 255, 0.9)",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 36,
                                        height: 36,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                        ...baseTransition,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#fff";
                                        e.currentTarget.style.transform = "scale(1.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                >
                                    <Icon name="three-dots-vertical" size={18} color={colors.textDark} />
                                </button>

                                {showPostMenu && (
                                    <div
                                        ref={postMenuRef}
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: 0,
                                            marginTop: 8,
                                            background: "#fff",
                                            borderRadius: 8,
                                            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                                            border: "1px solid #e5e7eb",
                                            zIndex: 20,
                                            minWidth: 180,
                                            padding: "4px 0",
                                        }}
                                    >
                                        <button
                                            onClick={handleHidePost}
                                            style={{
                                                width: "100%",
                                                padding: "10px 16px",
                                                border: "none",
                                                background: "transparent",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                color: colors.textDark,
                                                fontSize: 14,
                                                ...baseTransition,
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = colors.grayBg)}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <Icon name="eye-slash" size={16} color={colors.textLight} />
                                            Ẩn bài đăng
                                        </button>
                                        <button
                                            onClick={handleEditPost}
                                            style={{
                                                width: "100%",
                                                padding: "10px 16px",
                                                border: "none",
                                                background: "transparent",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                color: colors.textDark,
                                                fontSize: 14,
                                                ...baseTransition,
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = colors.grayBg)}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <Icon name="pencil" size={16} color={colors.primary} />
                                            Sửa bài đăng
                                        </button>
                                        <button
                                            onClick={handleDeletePost}
                                            style={{
                                                width: "100%",
                                                padding: "10px 16px",
                                                border: "none",
                                                background: "transparent",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                color: colors.red,
                                                fontSize: 14,
                                                ...baseTransition,
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <Icon name="trash" size={16} color={colors.red} />
                                            Xóa bài đăng
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Khối ảnh chính (Giữ nguyên) */}
                        <div
                            style={{
                                position: "relative",
                                borderRadius: 12,
                                overflow: "hidden",
                                marginBottom: 16,
                            }}
                        >
                            <img
                                src={currentImage || (post.images && post.images.length > 0 ? post.images[0] : post.image) || ""}
                                alt={post.title}
                                style={{
                                    width: "100%",
                                    height: 400,
                                    objectFit: "cover",
                                    display: "block",
                                    ...baseTransition,
                                }}
                            />
                            {post.category && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 12,
                                        left: 12,
                                        background: `rgba(59, 130, 246, 0.9)`,
                                        color: "#fff",
                                        padding: "4px 10px",
                                        borderRadius: 999,
                                        fontSize: 13,
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                                    }}
                                >
                                    <Icon name="tag" size={13} color="#fff" /> {post.category}
                                </div>
                            )}
                            {post.price && (
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 12,
                                        left: 12,
                                        background: `rgba(16, 185, 129, 0.9)`,
                                        color: "#fff",
                                        padding: "8px 14px",
                                        borderRadius: 8,
                                        fontSize: 18,
                                        fontWeight: 700,
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                                    }}
                                >
                                    {post.price}
                                </div>
                            )}
                        </div>

                        {/* Thư viện ảnh thu nhỏ - Hiển thị nếu có nhiều hơn 1 ảnh */}
                        {post.images && post.images.length > 1 && (
                            <div
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    marginBottom: 16,
                                    overflowX: "auto",
                                }}
                            >
                                {post.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`thumbnail ${index + 1}`}
                                        onClick={() => setCurrentImage(img)}
                                        style={{
                                            width: 80,
                                            height: 60,
                                            objectFit: "cover",
                                            borderRadius: 6,
                                            cursor: "pointer",
                                            border:
                                                currentImage === img
                                                    ? `3px solid ${colors.primary}`
                                                    : "3px solid #e2e8f0",
                                            ...baseTransition,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                        <h2
                            style={{
                                margin: "0 0 8px",
                                color: colors.textDark,
                                fontSize: "1.9rem",
                                lineHeight: "2.25rem",
                                fontWeight: 600,
                            }}
                        >
                            {post.title}
                        </h2>
                        <p
                            style={{
                                color: "#4b5563",
                                lineHeight: 1.7,
                                fontSize: 15,
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {post.content || post.description}
                        </p>

                        {/* Info (Giữ nguyên) */}
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                flexWrap: "wrap",
                                marginTop: 12,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    color: colors.textLight,
                                    background: colors.grayBg,
                                    borderRadius: 8,
                                    padding: "6px 10px",
                                }}
                            >
                                <Icon name="clock" /> {getTimeAgo(post.timestamp) || post.createdAt || "Vừa xong"}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    color: colors.textLight,
                                    background: colors.grayBg,
                                    borderRadius: 8,
                                    padding: "6px 10px",
                                }}
                            >
                                <Icon name="eye" /> {post.views} lượt xem
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    color: colors.textLight,
                                    background: colors.grayBg,
                                    borderRadius: 8,
                                    padding: "6px 10px",
                                }}
                            >
                                <Icon name="geo-alt-fill" /> {post.location || post.address || "Đang cập nhật"}
                            </div>
                        </div>

                        {/* Like, Save, Share Buttons (Giữ nguyên) */}
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                marginTop: 20,
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                onClick={() => !isPending && handleLike(showToast)}
                                disabled={isPending}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    background: isLikedLocal ? colors.red : colors.grayBg,
                                    color: isLikedLocal ? "#fff" : colors.textDark,
                                    border: "none",
                                    cursor: isPending ? "not-allowed" : "pointer",
                                    opacity: isPending ? 0.6 : 1,
                                    ...baseTransition,
                                }}
                                onMouseEnter={(e) => !isPending && setHoverEffect(e, "rgba(239, 68, 68, 0.2)")}
                                onMouseLeave={removeHoverEffect}
                            >
                                <Icon
                                    name="heart-fill"
                                    color={isLikedLocal ? "#fff" : colors.red}
                                />
                                {post.likes}
                            </button>
                            <button
                                onClick={() => !isPending && handleSave(showToast)}
                                disabled={isPending}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    background: isSavedLocal ? colors.yellow : colors.grayBg,
                                    color: isSavedLocal ? "#422006" : colors.textDark,
                                    border: "none",
                                    cursor: isPending ? "not-allowed" : "pointer",
                                    opacity: isPending ? 0.6 : 1,
                                    ...baseTransition,  
                                }}
                                onMouseEnter={(e) =>
                                    !isPending && setHoverEffect(e, "rgba(245, 158, 11, 0.2)")
                                }
                                onMouseLeave={removeHoverEffect}
                            >
                                <Icon
                                    name={isSavedLocal ? "bookmark-check-fill" : "bookmark"}
                                    color={isSavedLocal ? "#422006" : "#f59e0b"}
                                />
                                {isSavedLocal ? "Đã lưu" : "Lưu"}
                            </button>
                            <button
                                onClick={() => !isPending && handleShare()}
                                disabled={isPending}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    background: colors.grayBg,
                                    color: colors.textDark,
                                    border: "none",
                                    cursor: isPending ? "not-allowed" : "pointer",
                                    opacity: isPending ? 0.6 : 1,
                                    ...baseTransition,
                                }}
                                onMouseEnter={(e) =>
                                    !isPending && setHoverEffect(e, "rgba(59, 130, 246, 0.2)")
                                }
                                onMouseLeave={removeHoverEffect}
                            >
                                <Icon name="share-fill" color={colors.primary} />
                                Chia sẻ
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {/* Info người đăng */}
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: 12,
                                padding: 16,
                                boxShadow: cardShadow,
                                // SỬA 3: Bỏ borderTop màu xanh
                                // borderTop: `4px solid ${colors.primary}`,
                            }}
                        >
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <img
                                    src={post.authorAvatar}
                                    alt={post.author}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "2px solid #e2e8f0",
                                    }}
                                />
                                <div>
                                    <div style={{ fontWeight: 600, color: colors.textDark }}>
                                        {post.author}
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                                <button
                                    onClick={() => onNavigate?.("user-profile", post.authorId)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: 8,
                                        border: "1px solid #e2e8f0",
                                        background: "#f8fafc",
                                        cursor: "pointer",
                                        ...baseTransition,
                                    }}
                                    onMouseEnter={(e) => setHoverEffect(e)}
                                    onMouseLeave={removeHoverEffect}
                                >
                                    <Icon name="person" /> Xem trang cá nhân
                                </button>
                                <button
                                    onClick={handleCallPhone}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: 8,
                                        border: "none",
                                        background: colors.green,
                                        color: "#fff",
                                        cursor: "pointer",
                                        ...baseTransition,
                                    }}
                                    onMouseEnter={(e) =>
                                        setHoverEffect(e, "rgba(16, 185, 129, 0.3)")
                                    }
                                    onMouseLeave={removeHoverEffect}
                                >
                                    <Icon name="telephone-fill" color="#fff" /> Gọi điện
                                </button>
                                <button
                                    onClick={handleChat}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: 8,
                                        border: "none",
                                        background: colors.primary,
                                        color: "#fff",
                                        cursor: "pointer",
                                        ...baseTransition,
                                    }}
                                    onMouseEnter={(e) =>
                                        setHoverEffect(e, "rgba(59, 130, 246, 0.3)")
                                    }
                                    onMouseLeave={removeHoverEffect}
                                >
                                    <Icon name="chat-dots-fill" color="#fff" /> Nhắn tin
                                </button>
                            </div>
                        </div>

                        {/* KHỐI BÌNH LUẬN - Hiển thị nhưng disable khi pending */}
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: 12,
                                padding: 16,
                                boxShadow: cardShadow,
                                opacity: isPending ? 0.7 : 1,
                            }}
                        >
                            <h3 style={{ margin: "0 0 16px", color: colors.textDark }}>
                                <Icon name="chat-dots" /> Bình luận
                                {isPending && (
                                    <span style={{ fontSize: '13px', color: colors.textLight, fontWeight: 'normal', marginLeft: '8px' }}>
                                        (Bài đăng đang chờ duyệt - không thể bình luận)
                                    </span>
                                )}
                            </h3>
                            <div
                                style={{
                                    maxHeight: 260,
                                    overflowY: "auto",
                                    marginBottom: 10,
                                }}
                            >
                                {postComments.length > 0 ? (
                                    postComments.map((c) => {
                                        const isLiked = !!likedComments[c.id];
                                        const isReplying = replyingToCommentId === c.id;
                                        return (
                                            <div
                                                key={c.id}
                                                id={`comment-${c.id}`}
                                                style={{
                                                    borderBottom: "1px solid #f1f5f9",
                                                    padding: "8px 0",
                                                }}
                                            >
                                                <strong style={{ color: colors.textDark }}>
                                                    {c.author}
                                                </strong>
                                                <p style={{ margin: "4px 0 0", color: "#475569" }}>
                                                    {c.content}
                                                </p>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: 16,
                                                        alignItems: "center",
                                                        marginTop: 8,
                                                    }}
                                                >
                                                    <button
                                                        onClick={() => !isPending && handleLikeComment(c.id, showToast)}
                                                        disabled={isPending}
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            cursor: isPending ? "not-allowed" : "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 4,
                                                            color: isLiked ? colors.red : colors.textLight,
                                                            fontWeight: isLiked ? 600 : 400,
                                                            opacity: isPending ? 0.6 : 1,
                                                            ...baseTransition,
                                                        }}
                                                    >
                                                        <Icon
                                                            name={isLiked ? "heart-fill" : "heart"}
                                                            color={isLiked ? colors.red : colors.textLight}
                                                        />
                                                        Thích
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (isPending) {
                                                                showToast("Bài đăng đang chờ duyệt - không thể trả lời!");
                                                                return;
                                                            }
                                                            if (isReplying) {
                                                                setReplyingToCommentId(null);
                                                            } else {
                                                                setReplyingToCommentId(c.id);
                                                                setReplyContent("");
                                                            }
                                                        }}
                                                        disabled={isPending}
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            cursor: isPending ? "not-allowed" : "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 4,
                                                            color: isReplying
                                                                ? colors.primary
                                                                : colors.textLight,
                                                            fontWeight: isReplying ? 600 : 400,
                                                            opacity: isPending ? 0.6 : 1,
                                                            ...baseTransition,
                                                        }}
                                                    >
                                                        <Icon
                                                            name="chat-dots"
                                                            color={
                                                                isReplying ? colors.primary : colors.textLight
                                                            }
                                                        />
                                                        Trả lời
                                                    </button>
                                                </div>
                                                {isReplying && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: 8,
                                                            alignItems: "flex-start",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: 10,
                                                            overflow: "hidden",
                                                            padding: 8,
                                                            background: "#f9fafb",
                                                            marginTop: 10,
                                                        }}
                                                    >
                                                        <textarea
                                                            value={replyContent}
                                                            onChange={(e) => !isPending && setReplyContent(e.target.value)}
                                                            placeholder={isPending ? "Bài đăng đang chờ duyệt - không thể trả lời" : `Trả lời ${c.author}...`}
                                                            rows={2}
                                                            disabled={!isAuthenticated || isPending}
                                                            onClick={() => {
                                                                if (isPending) {
                                                                    showToast("Bài đăng đang chờ duyệt - không thể trả lời!");
                                                                } else if (!isAuthenticated) {
                                                                    showToast("Vui lòng đăng nhập để trả lời!");
                                                                }
                                                            }}
                                                            style={{
                                                                flex: 1,
                                                                border: "none",
                                                                outline: "none",
                                                                fontSize: 14,
                                                                background: "transparent",
                                                                resize: "vertical",
                                                                fontFamily: "inherit",
                                                                padding: 4,
                                                                minHeight: 38,
                                                                cursor: (isAuthenticated && !isPending) ? "text" : "not-allowed",
                                                            }}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                !isPending && handleAddReply(c, showToast)
                                                            }
                                                            disabled={!isAuthenticated || isPending}
                                                            style={{
                                                                flexShrink: 0,
                                                                background: colors.primary,
                                                                border: "none",
                                                                cursor: (isAuthenticated && !isPending)
                                                                    ? "pointer"
                                                                    : "not-allowed",
                                                                color: "#fff",
                                                                width: 38,
                                                                height: 38,
                                                                borderRadius: 8,
                                                                ...baseTransition,
                                                                opacity: (isAuthenticated && !isPending) ? 1 : 0.5,
                                                            }}
                                                        >
                                                            <Icon name="send" size={18} color="#fff" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            color: colors.textLight,
                                            padding: "40px 20px",
                                        }}
                                    >
                                        {/* SỬA 2: Icon gần chữ hơn (margin 12px) */}
                                        <div style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            background: colors.grayBg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 12px auto' // Giảm margin
                                        }}>
                                            <Icon name="chat-dots" size={40} color={colors.textLight} />
                                        </div>

                                        {/* SỬA 3: Chữ in nghiêng, mờ, không đậm */}
                                        <div style={{
                                            fontSize: 16, // Giảm cỡ chữ 1 chút
                                            fontStyle: 'italic', // In nghiêng
                                            color: colors.textLight, // Dùng màu mờ
                                            marginBottom: 4
                                        }}>
                                            Chưa có bình luận nào.
                                        </div>
                                        <div style={{
                                            fontSize: 15,
                                            fontStyle: 'italic', // In nghiêng
                                            color: colors.textLight
                                        }}>
                                            Hãy để lại bình luận cho người bán.
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* SỬA: KHUNG NHẬP LIỆU MỚI */}
                            {/* SỬA 4 & 5: KHUNG NHẬP LIỆU (NÚT NGOÀI, MÀU XANH) */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center", // Canh giữa theo chiều dọc
                                    gap: 8, // Khoảng cách giữa input và nút
                                }}
                            >
                                {/* Khối input màu xám (không chứa nút) */}
                                <div style={{
                                    flex: 1, // Chiếm hết không gian
                                    display: "flex",
                                    alignItems: "center",
                                    border: "none",
                                    borderRadius: 9999, // Bo tròn thành viên thuốc
                                    padding: "4px 8px 4px 16px", // Padding bên trong
                                    background: isAuthenticated ? colors.grayBg : "#eef2ff",
                                }}>
                                    <textarea
                                        value={commentContent}
                                        onChange={(e) => !isPending && setCommentContent(e.target.value)}
                                        placeholder={
                                            isPending
                                                ? "Bài đăng đang chờ duyệt - không thể bình luận"
                                                : isAuthenticated
                                                ? "Bình luận..."
                                                : "Vui lòng đăng nhập để bình luận"
                                        }
                                        rows={1} // Bắt đầu bằng 1 dòng, nó sẽ tự dãn ra
                                        disabled={!isAuthenticated || isPending}
                                        onClick={() => {
                                            if (isPending) {
                                                showToast("Bài đăng đang chờ duyệt - không thể bình luận!");
                                            } else if (!isAuthenticated) {
                                                showToast("Vui lòng đăng nhập để bình luận!");
                                            }
                                        }}
                                        style={{
                                            flex: 1,
                                            border: "none",
                                            outline: "none",
                                            fontSize: 15,
                                            background: "transparent",
                                            resize: "vertical",
                                            fontFamily: "inherit",
                                            padding: "8px 4px",
                                            minHeight: "auto",
                                            cursor: (isAuthenticated && !isPending) ? "text" : "not-allowed",
                                        }}
                                    />
                                </div>

                                {/* Nút gửi MÀU XANH (ICON), ở ngoài */}
                                <button
                                    onClick={() => !isPending && handleAddComment()}
                                    disabled={!isAuthenticated || isPending}
                                    style={{
                                        flexShrink: 0,
                                        background: "transparent", // Nền trong suốt
                                        border: "none",
                                        cursor: (isAuthenticated && !isPending) ? "pointer" : "not-allowed",
                                        width: "auto",
                                        height: "auto",
                                        borderRadius: '50%',
                                        padding: 8, // Vùng bấm
                                        ...baseTransition,
                                        opacity: (isAuthenticated && !isPending) ? 1 : 0.5, // Mờ đi khi bị vô hiệu hóa
                                    }}
                                >
                                    <Icon
                                        name="send-fill"
                                        size={18}
                                        color={colors.primary} // Icon LUÔN CÓ MÀU XANH
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Khối "Bài viết khác của tác giả" - Hiển thị các bài đăng của cùng tác giả */}
                {authorPosts.length > 0 && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: 20,
                            boxShadow:
                                "0 6px 20px -3px rgba(0, 0, 0, 0.06), 0 3px 6px -4px rgba(0, 0, 0, 0.06)",
                        }}
                    >
                        <h4 style={{ color: colors.textDark, marginBottom: 16 }}>
                            <Icon name="person-fill" /> Bài viết khác của {post.author}
                        </h4>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: 16,
                            }}
                        >
                            {authorPosts.map((authorPost) => (
                                <div
                                    key={authorPost.id}
                                    onClick={() => {
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                        onNavigate?.("post-detail", authorPost.id);
                                    }}
                                    style={{
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 10,
                                        background: "#f8fafc",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                                        ...baseTransition,
                                    }}
                                    onMouseEnter={(e) => setHoverEffect(e)}
                                    onMouseLeave={removeHoverEffect}
                                >
                                    <div style={{ position: "relative" }}>
                                        <img
                                            src={authorPost.image}
                                            alt={authorPost.title}
                                            style={{
                                                width: "100%",
                                                height: 140,
                                                objectFit: "cover",
                                                borderBottom: "1px solid #e5e7eb",
                                            }}
                                        />
                                        {authorPost.category && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: 8,
                                                    left: 8,
                                                    background: `rgba(59, 130, 246, 0.9)`,
                                                    color: "#fff",
                                                    padding: "2px 8px",
                                                    borderRadius: 999,
                                                    fontSize: 12,
                                                }}
                                            >
                                                <Icon name="tag" size={12} color="#fff" />{" "}
                                                {authorPost.category}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: 10 }}>
                                        <div style={{ fontWeight: 600, color: colors.textDark }}>
                                            {authorPost.title}
                                        </div>
                                        <div style={{ color: colors.green, fontWeight: 500 }}>
                                            {authorPost.price || "Miễn phí"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bài viết tương tự - Chỉ hiển thị khi không phải bài đăng đang chờ duyệt */}
                {!isPending && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: 20,
                            boxShadow:
                                "0 6px 15px -3px rgba(0, 0, 0, 0.06), 0 3px 6px -4px rgba(0, 0, 0, 0.06)",
                        }}
                    >
                        <h4 style={{ color: colors.textDark, marginBottom: 16 }}>
                            <Icon name="fire" /> Bài viết tương tự
                        </h4>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: 16,
                            }}
                        >
                            {similarPosts.map((similar) => (
                            <div
                                key={similar.id}
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                    onNavigate?.("post-detail", similar.id);
                                }}
                                style={{
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 10,
                                    background: "#f8fafc",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                                    ...baseTransition,
                                }}
                                onMouseEnter={(e) => setHoverEffect(e)}
                                onMouseLeave={removeHoverEffect}
                            >
                                <div style={{ position: "relative" }}>
                                    <img
                                        src={similar.image}
                                        alt={similar.title}
                                        style={{
                                            width: "100%",
                                            height: 140,
                                            objectFit: "cover",
                                            borderBottom: "1px solid #e5e7eb",
                                        }}
                                    />
                                    {similar.category && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 8,
                                                left: 8,
                                                background: `rgba(59, 130, 246, 0.9)`,
                                                color: "#fff",
                                                padding: "2px 8px",
                                                borderRadius: 999,
                                                fontSize: 12,
                                            }}
                                        >
                                            <Icon name="tag" size={12} color="#fff" />{" "}
                                            {similar.category}
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: 10 }}>
                                    <div style={{ fontWeight: 600, color: colors.textDark }}>
                                        {similar.title}
                                    </div>
                                    <div style={{ color: colors.green, fontWeight: 500 }}>
                                        {similar.price || "Miễn phí"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}

            </div>

            {/* --- SỬA 4: CHATBOX NỔI (chỉ hiện khi chat đang đóng) --- */}
            {!isChatOpen && (
                <button
                    onClick={handleChat}
                    style={{
                        position: 'fixed',
                        bottom: 30,
                        right: 30,
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: colors.primary,
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: 24,
                        zIndex: 1000,
                        ...baseTransition,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(59, 130, 246, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                    }}
                >
                    <i className="bi bi-chat-dots-fill"></i>
                </button>
            )}
            {/* --- KẾT THÚC SỬA 4 --- */}

            {/* Delete Post Modal */}
            <DeletePostModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDeletePost}
                postTitle={post?.title}
            />

            {/* Hide Post Modal */}
            <HidePostModal
                isOpen={showHideModal}
                onClose={() => setShowHideModal(false)}
                onConfirm={confirmHidePost}
                postTitle={post?.title}
            />
        </div>
    );
}