import { createContext, useContext, useState, useEffect } from "react";
import { mockPostDetails, mockCommentsByPostId } from "../data/mockDetail";

const PostContext = createContext();

const STORAGE_KEY_POSTS = "sv_exchange_posts";
const STORAGE_KEY_COMMENTS = "sv_exchange_comments";
const STORAGE_KEY_TRANSACTIONS = "sv_exchange_transactions";
const STORAGE_KEY_RATINGS = "sv_seller_ratings";

function loadTransactionsFromStorage() {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Failed to load transactions", e);
        return [];
    }
}

function saveTransactionsToStorage(transactions) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
        console.error("Failed to save transactions", e);
    }
}

function loadRatingsFromStorage() {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY_RATINGS);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Failed to load ratings", e);
        return [];
    }
}

function saveRatingsToStorage(ratings) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(ratings));
    } catch (e) {
        console.error("Failed to save ratings", e);
    }
}

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
    const [transactions, setTransactions] = useState(loadTransactionsFromStorage());
    const [ratings, setRatings] = useState(loadRatingsFromStorage());

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    }, [posts]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
    }, [comments]);

    useEffect(() => {
        saveTransactionsToStorage(transactions);
    }, [transactions]);

    useEffect(() => {
        saveRatingsToStorage(ratings);
    }, [ratings]);

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
        return newPost; // Trả về post đã tạo để có thể lấy id
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

    // Thêm các hàm mới: updatePost, deletePost, hidePost
    const updatePost = (postId, updatedData) => {
        setPosts(
            posts.map((p) =>
                String(p.id) === String(postId) ? { ...p, ...updatedData } : p
            )
        );
    };

    const deletePost = (postId) => {
        setPosts(posts.filter((p) => String(p.id) !== String(postId)));
        // Xóa comments của bài đăng đó
        const newComments = { ...comments };
        delete newComments[postId];
        setComments(newComments);
    };

    const hidePost = (postId) => {
        setPosts(
            posts.map((p) =>
                String(p.id) === String(postId) ? { ...p, hidden: true, hiddenTimestamp: new Date().toISOString() } : p
            )
        );
    };

    // markAsSold can accept optional buyer info { buyerId, buyerName, buyerAvatar }
    const markAsSold = (postId, buyer = null) => {
        setPosts(
            posts.map((p) =>
                String(p.id) === String(postId)
                    ? {
                          ...p,
                          sold: true,
                          soldTimestamp: new Date().toISOString(),
                          buyerId: buyer?.buyerId || buyer?.id || p.buyerId,
                          buyerName: buyer?.buyerName || buyer?.name || p.buyerName,
                          buyerAvatar: buyer?.buyerAvatar || buyer?.avatar || p.buyerAvatar,
                      }
                    : p
            )
        );
    };

    // Hàm duyệt bài đăng (chỉ dành cho admin)
    // Khi duyệt: bài đăng chuyển sang tab "Đang bán" trong giao diện user
    const approvePost = (postId) => {
        setPosts(
            posts.map((p) =>
                String(p.id) === String(postId) 
                    ? { 
                        ...p, 
                        status: 'approved', 
                        approvedAt: new Date().toISOString(),
                        // Không set sold: true, để bài đăng vào tab "Đang bán" (activePosts)
                    } 
                    : p
            )
        );
    };

    // Hàm từ chối bài đăng (chỉ dành cho admin)
    // Khi từ chối: bài đăng chuyển vào tab "đã ẩn" và không hiển thị trong danh sách
    const rejectPost = (postId, reason = '') => {
        setPosts(
            posts.map((p) =>
                String(p.id) === String(postId) 
                    ? { 
                        ...p, 
                        status: 'rejected', 
                        rejectedAt: new Date().toISOString(), 
                        rejectionReason: reason,
                        hidden: true, // Chuyển vào tab "đã ẩn"
                        hiddenTimestamp: new Date().toISOString()
                    } 
                    : p
            )
        );
    };

    // Add purchase transaction record
    const addPurchaseTransaction = (postId, buyerId, buyerInfo) => {
        const post = posts.find(p => String(p.id) === String(postId));
        const transaction = {
            id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            type: 'purchase',
            postId,
            sellerId: post?.authorId,
            sellerName: post?.authorName,
            sellerAvatar: post?.authorAvatar,
            buyerId,
            buyerInfo: {
                name: buyerInfo.name,
                phone: buyerInfo.phone,
                address: buyerInfo.address,
                quantity: buyerInfo.quantity,
                note: buyerInfo.note,
            },
            timestamp: new Date().toISOString(),
            status: 'pending', // 'pending' -> 'approved' -> 'completed'
        };
        setTransactions((prev) => [transaction, ...prev]);
        return transaction;
    };

    // Approve/complete purchase transaction
    // When seller approves one request, delete all other pending requests and send "sold" notifications
    const approvePurchaseTransaction = (transactionId, postId) => {
        // Build result using current transactions (so caller can notify buyers)
        const prev = transactions || [];
        const approvedTx = prev.find((t) => String(t.id) === String(transactionId)) || null;

        const cancelledTxs = prev
            .filter((t) => String(t.postId) === String(postId) && t.status === 'pending' && String(t.id) !== String(transactionId))
            .map((t) => ({ ...t, status: 'cancelled', cancelReason: 'post_sold' }));

        const updated = prev.map((t) => {
            if (String(t.id) === String(transactionId)) {
                return { ...t, status: 'approved' };
            }
            if (String(t.postId) === String(postId) && t.status === 'pending') {
                return { ...t, status: 'cancelled', cancelReason: 'post_sold' };
            }
            return t;
        });

        // Persist updated transactions
        setTransactions(updated);

        return { approvedTx: approvedTx ? { ...approvedTx, status: 'approved' } : null, cancelledTxs };
    };

    // Get transactions for a user (as seller or buyer)
    const getUserTransactions = (userId) => {
        return transactions.filter((t) => String(t.sellerId) === String(userId) || String(t.buyerId) === String(userId));
    };

    // Tự động xóa bài đăng đã bán sau 2 ngày
    useEffect(() => {
        const now = new Date();
        const postsToDelete = [];
        
        posts.forEach((post) => {
            if (post.sold && post.soldTimestamp) {
                const soldDate = new Date(post.soldTimestamp);
                const diffTime = now - soldDate;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                
                if (diffDays >= 2) {
                    postsToDelete.push(post.id);
                }
            }
        });
        
        if (postsToDelete.length > 0) {
            setPosts(posts.filter((p) => !postsToDelete.includes(p.id)));
            // Xóa comments của các bài đăng đã xóa
            const newComments = { ...comments };
            postsToDelete.forEach((postId) => {
                delete newComments[postId];
            });
            setComments(newComments);
        }
    }, [posts, comments]);

    // Add seller rating
    const addRating = (sellerId, ratingData) => {
        const newRating = {
            id: `rating_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            sellerId,
            sellerName: ratingData.sellerName,
            rating: ratingData.rating,
            review: ratingData.review,
            timestamp: new Date().toISOString(),
        };
        setRatings((prev) => [newRating, ...prev]);
        return newRating;
    };

    // Get ratings for a seller
    const getSellerRatings = (sellerId) => {
        return ratings.filter((r) => String(r.sellerId) === String(sellerId));
    };

    // Calculate average rating for a seller
    const getSellerAverageRating = (sellerId) => {
        const sellerRatings = getSellerRatings(sellerId);
        if (sellerRatings.length === 0) return 0;
        const sum = sellerRatings.reduce((acc, r) => acc + r.rating, 0);
        return (sum / sellerRatings.length).toFixed(1);
    };

    return (
        // --- SỬA LỖI NGHIÊM TRỌNG: Phải là PostContext.Provider ---
        <PostContext.Provider
            value={{
                posts,
                comments,
                transactions,
                ratings,
                addPost,
                addComment,
                toggleLike,
                toggleSave,
                getSavedPosts,
                getLikedPosts,
                incrementViews,
                updatePost,
                deletePost,
                hidePost,
                markAsSold,
                approvePost,
                rejectPost,
                addPurchaseTransaction,
                approvePurchaseTransaction,
                getUserTransactions,
                addRating,
                getSellerRatings,
                getSellerAverageRating,
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