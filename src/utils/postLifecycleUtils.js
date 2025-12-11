/**
 * Utility functions để quản lý vòng đời bài đăng theo gói pricing
 * Hỗ trợ: kiểm tra hết hạn, tự động xóa, gửi notification
 */

import { isPostExpired, shouldAutoDeleteOnExpiry, canNotifyMatchingBuyers } from "../data/pricingPackages";

/**
 * Kiểm tra xem bài đăng có cần được xử lý (xóa/thông báo) không
 * @param {Object} post - Post object
 * @returns {Object} - { shouldDelete: boolean, canNotifyBuyers: boolean }
 */
export function checkPostAction(post) {
    const result = {
        shouldDelete: false,
        canNotifyBuyers: false,
    };

    if (!post || !post.packageType) {
        return result;
    }

    // Kiểm tra xem bài đăng có hết hạn không
    const expired = isPostExpired(post.packageType, post.expiresAt);
    
    if (expired) {
        // Nếu hết hạn, kiểm tra xem có nên tự động xóa không
        result.shouldDelete = shouldAutoDeleteOnExpiry(post.packageType);
    }

    // Kiểm tra xem có thể gửi notification đến buyer không
    result.canNotifyBuyers = canNotifyMatchingBuyers(post.packageType);

    return result;
}

/**
 * Lấy thông tin về thời gian còn lại của bài đăng
 * @param {Date|string|null} expiresAt - Ngày hết hạn
 * @returns {Object} - { daysLeft: number, hoursLeft: number, minutesLeft: number, expired: boolean }
 */
export function getTimeRemaining(expiresAt) {
    if (!expiresAt) {
        return {
            daysLeft: null,
            hoursLeft: null,
            minutesLeft: null,
            expired: false,
            isUnlimited: true,
        };
    }

    const now = new Date();
    const expireDate = new Date(expiresAt);
    const diffTime = expireDate - now;

    if (diffTime <= 0) {
        return {
            daysLeft: 0,
            hoursLeft: 0,
            minutesLeft: 0,
            expired: true,
            isUnlimited: false,
        };
    }

    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return {
        daysLeft: diffDays,
        hoursLeft: diffHours,
        minutesLeft: diffMinutes,
        expired: false,
        isUnlimited: false,
    };
}

/**
 * Định dạng thông báo thời gian còn lại
 * @param {Date|string|null} expiresAt - Ngày hết hạn
 * @returns {string} - Ví dụ: "5 ngày", "2 giờ", "30 phút", "Hết hạn", "Vô hạn"
 */
export function formatTimeRemaining(expiresAt) {
    const timeInfo = getTimeRemaining(expiresAt);

    if (timeInfo.isUnlimited) {
        return "Vô hạn";
    }

    if (timeInfo.expired) {
        return "Hết hạn";
    }

    if (timeInfo.daysLeft > 0) {
        return `${timeInfo.daysLeft} ngày`;
    }

    if (timeInfo.hoursLeft > 0) {
        return `${timeInfo.hoursLeft} giờ`;
    }

    return `${timeInfo.minutesLeft} phút`;
}

/**
 * Tính phần trăm thời gian còn lại để hiển thị progress bar
 * @param {string} packageType - ID của gói (FREE, BASIC, PREMIUM)
 * @param {Date|string|null} expiresAt - Ngày hết hạn
 * @returns {number} - Phần trăm (0-100), null nếu unlimited
 */
export function calculateExpiryProgress(packageType, expiresAt) {
    if (!expiresAt || packageType === 'PREMIUM') {
        return null;
    }

    const now = new Date();
    const expireDate = new Date(expiresAt);
    
    // Giả sử tất cả posts được tạo cách đây một khoảng, 
    // ta cần tính từ lúc post được tạo
    // (Nhưng vì mock data không có createdAtDate chính xác, 
    // ta sẽ dùng expiryDate để tính gần đúng)
    
    if (expireDate <= now) {
        return 0; // Hết hạn
    }

    // Tính dựa trên thời gian còn lại so với ngày hết hạn
    // Đây là cách tính tạm thời, trong thực tế nên lưu createdAt chính xác
    const totalMs = expireDate.getTime() - now.getTime();
    
    // Giả sử tổng thời gian = số ngày trong gói * 24 * 60 * 60 * 1000
    let totalDays = 7; // Mặc định cho BASIC
    if (packageType === 'FREE') totalDays = 1;
    if (packageType === 'BASIC') totalDays = 7;
    
    const totalMs_Expected = totalDays * 24 * 60 * 60 * 1000;
    const percentage = Math.max(0, Math.min(100, (totalMs / totalMs_Expected) * 100));

    return percentage;
}

/**
 * Batch check all posts để tìm những posts cần xử lý
 * @param {Array} posts - Mảng tất cả posts
 * @returns {Object} - { postsToDelete: Array, postsWithBuyerNotifications: Array }
 */
export function batchCheckPosts(posts) {
    const postsToDelete = [];
    const postsWithBuyerNotifications = [];

    posts.forEach((post) => {
        const action = checkPostAction(post);
        
        if (action.shouldDelete) {
            postsToDelete.push(post.id);
        }
        
        if (action.canNotifyBuyers) {
            postsWithBuyerNotifications.push(post.id);
        }
    });

    return {
        postsToDelete,
        postsWithBuyerNotifications,
    };
}

/**
 * Tạo message notification cho buyer khi có PREMIUM post phù hợp
 * @param {Object} buyerPost - Bài "cần mua"
 * @param {Object} sellerPost - Bài "cần bán" PREMIUM
 * @returns {string} - Message notification
 */
export function createBuyerNotificationMessage(buyerPost, sellerPost) {
    return `✨ Có bài đăng mới từ gói Premium phù hợp với danh mục "${buyerPost.category}":\n"${sellerPost.title}"\n\nGiá: ${sellerPost.price}\nĐịa chỉ: ${sellerPost.address}`;
}

/**
 * Kiểm tra xem bài "cần bán" có đủ điều kiện để thông báo đến buyer không
 * @param {Object} sellPost - Bài "cần bán"
 * @param {Object} buyPost - Bài "cần mua"
 * @returns {boolean}
 */
export function canSendBuyerNotification(sellPost, buyPost) {
    // Phải là PREMIUM post
    if (sellPost.packageType !== 'PREMIUM') {
        return false;
    }

    // Phải cùng category
    if (!sellPost.category || !buyPost.category || 
        sellPost.category.toLowerCase() !== buyPost.category.toLowerCase()) {
        return false;
    }

    // Sell post không được bị ẩn hoặc đã bán
    if (sellPost.hidden || sellPost.sold) {
        return false;
    }

    // Buy post không được bị ẩn
    if (buyPost.hidden) {
        return false;
    }

    return true;
}
