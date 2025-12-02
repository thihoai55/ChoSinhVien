import { useEffect, useRef } from 'react';
import { usePosts } from '../contexts/PostContext';
import { useFollow } from '../contexts/FollowContext';
import { useNotifications } from '../contexts/NotificationContext';
import { getUsers } from '../data/userData';

const STORAGE_KEY_NOTIFIED = 'sv_exchange_notified_posts';

function loadNotifiedPosts() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY_NOTIFIED);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveNotifiedPost(postId) {
    if (typeof window === 'undefined') return;
    try {
        const notified = loadNotifiedPosts();
        if (!notified.includes(postId)) {
            notified.push(postId);
            window.localStorage.setItem(STORAGE_KEY_NOTIFIED, JSON.stringify(notified));
        }
    } catch (e) {
        console.error('Failed to save notified post', e);
    }
}

export default function PostNotificationHandler() {
    const { posts, updatePost } = usePosts();
    const { getFollowers } = useFollow();
    const { addNotification } = useNotifications();
    const prevPostsRef = useRef(posts);
    const notifiedPosts = useRef(loadNotifiedPosts());

    useEffect(() => {
        // Kiểm tra các bài đăng vừa được duyệt (từ pending sang không phải pending)
        posts.forEach((currentPost) => {
            if (!currentPost.authorId || currentPost.hidden) return;
            
            const prevPost = prevPostsRef.current.find((p) => String(p.id) === String(currentPost.id));
            
            // Nếu bài đăng vừa được duyệt (từ pending sang không phải pending)
            if (prevPost && prevPost.status === 'pending' && currentPost.status !== 'pending') {
                // Kiểm tra xem bài đăng có được đánh dấu là "đã bán" không
                const isInSoldTab = currentPost.sold === true;
                
                // Nếu bài đăng được đánh dấu là "đã bán" và chưa được gửi thông báo
                if (isInSoldTab && !notifiedPosts.current.includes(currentPost.id)) {
                    const users = getUsers();
                    const author = (users && users.find((u) => String(u.id) === String(currentPost.authorId))) || null;
                    const followers = getFollowers(currentPost.authorId);
                    
                    // Gửi thông báo cho tất cả followers
                    followers.forEach((followerId) => {
                        addNotification(followerId, {
                            type: "new_post",
                            fromUserId: currentPost.authorId,
                            postId: currentPost.id,
                            message: `${author?.name || "Một người dùng"} đã đăng bài mới: ${currentPost.title}`,
                        });
                    });
                    
                    // Đánh dấu đã gửi thông báo
                    notifiedPosts.current.push(currentPost.id);
                    saveNotifiedPost(currentPost.id);
                }
            }
        });
        
        prevPostsRef.current = posts;
    }, [posts, getFollowers, addNotification, updatePost]);

    return null; // Component này không render gì
}

