import { createContext, useContext, useState } from "react";
// --- THÊM MỚI: Import hàm logic từ file datalogin.js ---
//import { checkLogin, mockUsers } from "../data/datalogin"; // Giả sử đường dẫn này là đúng
import { checkLogin, getUsers, addUser, isStudentEmail } from "../data/userData";

const AuthContext = createContext();

// ✅ Provider quản lý người dùng đăng nhập / đăng ký
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // 🟢 Đăng nhập (ĐÃ SỬA)
    const login = async (email, password) => {        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Gọi hàm kiểm tra thật từ datalogin.js
        const loggedInUser = checkLogin(email, password);

        if (loggedInUser) {
            // Nếu thành công, set user
            setUser(loggedInUser);

            // Cập nhật trạng thái online vào localStorage
            try {
                const key = `sv_user_presence_${loggedInUser.id}`;
                window.localStorage.setItem(
                    key,
                    JSON.stringify({ isOnline: true, lastActive: new Date().toISOString() })
                );
            } catch {}

            // Trả về user để component có thể sử dụng
            return loggedInUser;

        } else {
            // Nếu thất bại, ném ra lỗi để UI có thể bắt
            throw new Error("Email hoặc mật khẩu không đúng");
        }
    };

    // 🟡 Đăng ký (ĐÃ SỬA)
    const register = async (name, email, password, phone = '', location = '', bio = '') => {
        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Kiểm tra định dạng email sinh viên
        if (!isStudentEmail(email)) {
            throw new Error('Email phải là email sinh viên (đuôi .edu.vn)');
        }

        // Kiểm tra xem email đã tồn tại trong danh sách users chưa
        const existingUser = getUsers().find(u => u.email === email);
        if (existingUser) {
            throw new Error("Email này đã được đăng ký");
        }

        // Thêm user mới vào storage (cùng lưu password để có thể login sau)
        const created = addUser({ name, email, password, phone, location, bio });

        // Tự động đăng nhập cho user mới (created không chứa password)
        setUser(created);

        // Cập nhật trạng thái online cho user mới
        try {
            const key = `sv_user_presence_${created.id}`;
            window.localStorage.setItem(
                key,
                JSON.stringify({ isOnline: true, lastActive: new Date().toISOString() })
            );
        } catch {}

        return created;
    };

    // Cập nhật profile hiện tại (thực hiện lưu vào storage và cập nhật context)
    const updateProfile = async (userId, updates = {}) => {
        // Synchronous update (mock API)
        const { updateUser } = await import('../data/userData');
        const updated = updateUser(userId, updates);
        setUser(updated);
        return updated;
    };

    // 🔴 Đăng xuất
    const logout = () => {
        if (user) {
            try {
                const key = `sv_user_presence_${user.id}`;
                window.localStorage.setItem(
                    key,
                    JSON.stringify({ isOnline: false, lastActive: new Date().toISOString() })
                );
            } catch {}
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                updateProfile,
                logout,
                isAuthenticated: !!user, // Vẫn giữ nguyên logic này
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ✅ Hook để sử dụng context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth phải được dùng trong AuthProvider");
    }
    return context;
}