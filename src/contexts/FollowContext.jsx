import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FollowContext = createContext();

const STORAGE_KEY = "sv_exchange_follows";

// Cấu trúc: { userId: [list of userIds they are following] }
function loadFollowsFromStorage() {
    if (typeof window === "undefined") return {};
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.error("Failed to load follows from localStorage", e);
        return {};
    }
}

function saveFollowsToStorage(follows) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(follows));
    } catch (e) {
        console.error("Failed to save follows to localStorage", e);
    }
}

export function FollowProvider({ children }) {
    const { user } = useAuth();
    const [follows, setFollows] = useState(loadFollowsFromStorage());

    // Lưu vào localStorage mỗi khi follows thay đổi
    useEffect(() => {
        saveFollowsToStorage(follows);
    }, [follows]);

    // Lấy danh sách người mà userId đang theo dõi
    const getFollowing = (userId) => {
        return follows[userId] || [];
    };

    // Lấy danh sách người đang theo dõi userId
    const getFollowers = (userId) => {
        const followers = [];
        for (const [followerId, followingList] of Object.entries(follows)) {
            if (followingList.includes(userId)) {
                followers.push(followerId);
            }
        }
        return followers;
    };

    // Kiểm tra xem currentUser có đang theo dõi targetUserId không
    const isFollowing = (currentUserId, targetUserId) => {
        if (!currentUserId || !targetUserId) return false;
        const followingList = follows[currentUserId] || [];
        return followingList.includes(targetUserId);
    };

    // Theo dõi hoặc bỏ theo dõi
    const toggleFollow = (followerId, followingId) => {
        if (!followerId || !followingId || followerId === followingId) return;

        setFollows((prev) => {
            const newFollows = { ...prev };
            const followingList = newFollows[followerId] || [];

            if (followingList.includes(followingId)) {
                // Bỏ theo dõi
                newFollows[followerId] = followingList.filter((id) => id !== followingId);
            } else {
                // Theo dõi
                newFollows[followerId] = [...followingList, followingId];
            }

            return newFollows;
        });
    };

    // Lấy số lượng người đang theo dõi userId
    const getFollowersCount = (userId) => {
        return getFollowers(userId).length;
    };

    // Lấy số lượng người mà userId đang theo dõi
    const getFollowingCount = (userId) => {
        return getFollowing(userId).length;
    };

    return (
        <FollowContext.Provider
            value={{
                follows,
                getFollowing,
                getFollowers,
                isFollowing,
                toggleFollow,
                getFollowersCount,
                getFollowingCount,
            }}
        >
            {children}
        </FollowContext.Provider>
    );
}

export function useFollow() {
    const context = useContext(FollowContext);
    if (!context) {
        throw new Error("useFollow must be used within FollowProvider");
    }
    return context;
}

