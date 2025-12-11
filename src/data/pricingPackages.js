/**
 * Định nghĩa các gói pricing cho bài đăng "Cần bán"
 * Áp dụng cho bài đăng loại "Cần bán" - đối với "Cần mua" thì không có gói
 */

export const PRICING_PACKAGES = {
    FREE: {
        id: 'FREE',
        name: 'Miễn phí',
        displayDays: 1, // Hiển thị trong 1 ngày
        price: 0,
        features: [
            'Hiển thị trong 1 ngày',
            'Tự động xóa sau 1 ngày',
            'Khả năng tiếp cận cơ bản',
        ],
        autoDeleteAfterExpiry: true, // Tự động xóa bài sau hết hạn
        notifyMatchingBuyers: false, // Không gửi thông báo đến người mua
        allowCategoryMatching: false, // Không match với danh mục
    },
    BASIC: {
        id: 'BASIC',
        name: 'Cơ bản',
        displayDays: 7, // Hiển thị trong 7 ngày
        price: 0, // Hoặc có giá nếu muốn tính phí
        features: [
            'Hiển thị trong 7 ngày',
            'Khả năng tiếp cận rộng hơn',
            'Lưu lại bài đăng tự động',
        ],
        autoDeleteAfterExpiry: true, // Tự động xóa sau 7 ngày
        notifyMatchingBuyers: false, // Không gửi thông báo đến người mua
        allowCategoryMatching: false, // Không match với danh mục
    },
    PREMIUM: {
        id: 'PREMIUM',
        name: 'Premium',
        displayDays: null, // Hiển thị vô hạn (không xóa)
        price: 0, // Hoặc có giá nếu muốn tính phí
        features: [
            'Hiển thị vô hạn thời gian',
            'Khả năng tiếp cận tối đa',
            'Gửi thông báo đến người mua có danh mục phù hợp',
            'Được ưu tiên hiển thị',
        ],
        autoDeleteAfterExpiry: false, // Không tự động xóa
        notifyMatchingBuyers: true, // Gửi thông báo đến người mua có danh mục phù hợp
        allowCategoryMatching: true, // Match với danh mục "Cần mua"
    },
};

/**
 * Lấy thông tin gói dựa trên ID
 */
export function getPackageById(packageId) {
    return PRICING_PACKAGES[packageId] || PRICING_PACKAGES.FREE;
}

/**
 * Tính toán ngày hết hạn của bài đăng
 * @param {Date|string} createdAt - Ngày tạo bài đăng
 * @param {string} packageId - ID của gói (FREE, BASIC, PREMIUM)
 * @returns {Date|null} - Ngày hết hạn hoặc null nếu không hết hạn (PREMIUM)
 */
export function calculateExpiryDate(createdAt, packageId = 'FREE') {
    const pkg = getPackageById(packageId);
    
    if (pkg.displayDays === null) {
        return null; // PREMIUM không hết hạn
    }
    
    const date = new Date(createdAt);
    date.setDate(date.getDate() + pkg.displayDays);
    return date;
}

/**
 * Kiểm tra bài đăng có hết hạn hay không
 * @param {string} packageId - ID của gói
 * @param {Date|string|null} expiresAt - Ngày hết hạn
 * @returns {boolean} - true nếu đã hết hạn
 */
export function isPostExpired(packageId, expiresAt) {
    const pkg = getPackageById(packageId);
    
    if (!expiresAt || pkg.displayDays === null) {
        return false; // PREMIUM không bao giờ hết hạn
    }
    
    return new Date() > new Date(expiresAt);
}

/**
 * Kiểm tra bài đăng có nên tự động xóa hay không
 * @param {string} packageId - ID của gói
 * @returns {boolean}
 */
export function shouldAutoDeleteOnExpiry(packageId) {
    const pkg = getPackageById(packageId);
    return pkg.autoDeleteAfterExpiry;
}

/**
 * Kiểm tra bài đăng PREMIUM có được phép match danh mục không
 * @param {string} packageId - ID của gói
 * @returns {boolean}
 */
export function canNotifyMatchingBuyers(packageId) {
    const pkg = getPackageById(packageId);
    return pkg.notifyMatchingBuyers;
}
