import { createContext, useContext, useState, useEffect } from "react";
import { mockPostDetails, mockCommentsByPostId } from "../data/mockDetail";

const PostContext = createContext();

const STORAGE_KEY_POSTS = "sv_exchange_posts";
const STORAGE_KEY_COMMENTS = "sv_exchange_comments";

function loadPostsFromStorage() {
    if (typeof window === "undefined") return mockPostDetails;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY_POSTS);
        if (!raw) return mockPostDetails;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.length ? parsed : mockPostDetails;
    } catch (e) {
        console.error("Failed to load posts from localStorage", e);
        return mockPostDetails;
    }
}

function loadCommentsFromStorage() {
    if (typeof window === "undefined") return mockCommentsByPostId;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY_COMMENTS);
        if (!raw) return mockCommentsByPostId;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : mockCommentsByPostId;
    } catch (e) {
        console.error("Failed to load comments from localStorage", e);
        return mockCommentsByPostId;
    }
}

export function PostProvider({ children }) {
    const [posts, setPosts] = useState(loadPostsFromStorage());
    const [comments, setComments] = useState(loadCommentsFromStorage());

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    }, [posts]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
    }, [comments]);

    const addPost = (post) => {
        const newPost = {
            ...post,
            id: Date.now().toString(),
            likes: 0,
            comments: 0,
            views: 0,
            createdAt: "Vừa xong",
            likedBy: [],
            savedBy: [],
            // Giữ nguyên status từ post nếu có, nếu không thì không set status (undefined)
            // Bài đăng "Cần mua" sẽ không có status, bài đăng "Cần bán" sẽ có status: 'pending'
            status: post.status,
        };
        setPosts([newPost, ...posts]);
    };

    const addComment = (postId, content, userId, userName, userAvatar) => {
        const newComment = {
            id: Date.now().toString(),
            postId,
            author: userName,
            authorId: userId,
            authorAvatar: userAvatar,
            content,
            createdAt: "Vừa xong",
            likes: 0,
        };
        setComments({
            ...comments,
            [postId]: [...(comments[postId] || []), newComment],
        });
        return newComment;
    };

    // --- ĐÃ SỬA & GIỮ NGUYÊN TỪ FILE CỦA BẠN ---
    const toggleLike = (postId, userId) => {
        if (!userId) return;
        setPosts(
            posts.map((p) => {
                if (String(p.id) === String(postId)) {
                    const hasLiked = p.likedBy.includes(userId);
                    return {
                        ...p,
                        likes: hasLiked ? p.likes - 1 : p.likes + 1,
                        likedBy: hasLiked
                            ? p.likedBy.filter((id) => id !== userId)
                            : [...p.likedBy, userId],
                    };
                }
                return p;
            })
        );
    };

    const toggleSave = (postId, userId) => {
        if (!userId) return;
        setPosts(
            posts.map((p) => {
                if (String(p.id) === String(postId)) {
                    const hasSaved = p.savedBy.includes(userId);
                    return {
                        ...p,
                        savedBy: hasSaved
                            ? p.savedBy.filter((id) => id !== userId)
                            : [...p.savedBy, userId],
                    };
                }
                return p;
            })
        );
    };

    const getSavedPosts = (userId) =>
        posts.filter((p) => p.savedBy.includes(userId));

    const getLikedPosts = (userId) =>
        posts.filter((p) => p.likedBy.includes(userId));

    const incrementViews = (postId) => {
        setPosts(
            posts.map((p) =>
                p.id === postId ? { ...p, views: p.views + 1 } : p
            )
        );
    };
    // --- KẾT THÚC SỬA ĐỔI ---

    return (
        // --- SỬA LỖI NGHIÊM TRỌNG: Phải là PostContext.Provider ---
        <PostContext.Provider
            value={{
                posts,
                comments,
                addPost,
                addComment,
                toggleLike,
                toggleSave,
                getSavedPosts,
                getLikedPosts,
                incrementViews,
            }}
        >
            {children}
        </PostContext.Provider>
    );
}

// (Hook usePosts giữ nguyên)
export function usePosts() {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("usePosts phải được dùng trong PostProvider");
    }
    return context;
}