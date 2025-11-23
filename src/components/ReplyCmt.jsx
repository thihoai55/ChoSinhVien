import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

export function usePostInteractions(post, postActions) {
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();

  // --- SỬA 1: Thêm `toggleLike` từ context ---
  const { getSavedPosts, toggleSave, addComment, toggleLike } = postActions || {};

  // --- SỬA 2: Đổi tên `liked` thành `isLikedLocal` ---
  const [isLikedLocal, setIsLikedLocal] = useState(false);
  const [isSavedLocal, setIsSavedLocal] = useState(false);

  // (State bình luận giữ nguyên)
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [likedComments, setLikedComments] = useState({});

  // Effect đồng bộ "Đã lưu" (Giữ nguyên)
  useEffect(() => {
    if (user && typeof getSavedPosts === "function" && post) {
      try {
        const saved = getSavedPosts(user.id) || [];
        setIsSavedLocal(saved.some((p) => String(p.id) === String(post.id)));
      } catch (e) {
        setIsSavedLocal(false);
      }
    } else {
        setIsSavedLocal(false);
    }
  }, [user, getSavedPosts, post]);

  // --- SỬA 3: Thêm Effect đồng bộ "Đã thích" ---
  useEffect(() => {
    if (user && post?.likedBy) {
      // Kiểm tra xem user.id có trong mảng likedBy của BÀI VIẾT NÀY không
      setIsLikedLocal(post.likedBy.includes(user.id));
    } else {
      // Nếu không có user hoặc post, reset về false
      setIsLikedLocal(false);
    }
  }, [user, post]); // Chạy lại mỗi khi user hoặc post thay đổi

  // --- SỬA 4: Cập nhật hàm `handleLike` ---
  const handleLike = (showToast) => {
    if (!isAuthenticated || !user) {
      showToast("Vui lòng đăng nhập để thích bài viết!");
      return;
    }
    // Check an toàn
    if (!post || !toggleLike) return;

    const wasLiked = isLikedLocal;

    // Gọi hàm từ context để cập nhật data thật
    toggleLike(post.id, user.id);

    // Cập nhật UI ngay lập tức
    setIsLikedLocal((v) => !v);

    // Nếu trước đó chưa like, đây là một lượt like mới -> tạo thông báo cho chủ bài
    if (!wasLiked && post.authorId && post.authorId !== user.id) {
      addNotification(post.authorId, {
        type: "like",
        postId: post.id,
        fromUserId: user.id,
        message: `${user.name || "Một người dùng"} đã thích bài đăng của bạn`,
      });
    }

    // Đổi thông báo dựa trên trạng thái trước đó
    showToast(wasLiked ? "Đã bỏ thích" : "Đã thích bài viết!");
  };

  const handleSave = (showToast) => {
    if (!isAuthenticated) {
      showToast("Vui lòng đăng nhập để lưu bài viết!");
      return;
    }
    if (!post || !toggleSave) return;
    
    toggleSave(post.id, user?.id || "guest");
    setIsSavedLocal((v) => !v);
    showToast(isSavedLocal ? "Đã bỏ lưu bài viết" : "Đã lưu bài viết");
  };

  // (Các hàm bình luận giữ nguyên)
  const handleLikeComment = (commentId, showToast) => {
    if (!isAuthenticated) {
      showToast("Vui lòng đăng nhập để thích bình luận!");
      return;
    }
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };
  const handleAddReply = (targetComment, showToast) => {
    if (!isAuthenticated) {
      showToast("Vui lòng đăng nhập để trả lời!");
      return;
    }
    if (!replyContent.trim()) {
      showToast("Vui lòng nhập nội dung trả lời!");
      return;
    }
    if (!post || !addComment || !targetComment) return;

    const contentWithMention = `@${targetComment.author} ${replyContent}`;

    const createdReply = addComment(
      post.id,
      contentWithMention,
      user?.id || "guest",
      user?.name || "Khách",
      user?.avatar
    );

    // Tạo thông báo cho chủ bài viết nếu khác với người đang trả lời
    if (post?.authorId && user?.id && post.authorId !== user.id) {
      addNotification(post.authorId, {
        type: "comment",
        postId: post.id,
        fromUserId: user.id,
        commentId: createdReply?.id,
        message: `${user.name || "Một người dùng"} đã trả lời bình luận trên bài đăng của bạn`,
      });
    }

    // Tạo thông báo cho người đã viết bình luận (người được trả lời)
    if (targetComment.authorId && user?.id && targetComment.authorId !== user.id) {
      addNotification(targetComment.authorId, {
        type: "reply",
        postId: post.id,
        fromUserId: user.id,
        commentId: createdReply?.id,
        message: `${user.name || "Một người dùng"} đã trả lời bình luận của bạn`,
      });
    }

    setReplyContent("");
    setReplyingToCommentId(null);
    showToast("Đã gửi trả lời!");
  };

  return {
    isLikedLocal, // <-- SỬA 5: Trả về state đã sửa tên
    isSavedLocal,
    replyingToCommentId,
    replyContent,
    likedComments,
    handleLike, // <-- SỬA 6: Trả về hàm đã cập nhật
    handleSave,
    setReplyContent,
    setReplyingToCommentId,
    handleLikeComment,
    handleAddReply,
  };
}