import { createContext, useContext, useState } from "react";
// --- THÊM MỚI: Import hàm logic từ file datalogin.js ---
//import { checkLogin, mockUsers } from "../data/datalogin"; // Giả sử đường dẫn này là đúng
import { checkLogin, mockUsers } from "../data/userData";

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
    const register = async (name, email, password) => {
        // Giả lập độ trễ của API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Kiểm tra xem email đã tồn tại trong mockUsers chưa
        const existingUser = mockUsers.find(u => u.email === email);
        
        if (existingUser) {
            // Nếu đã tồn tại, ném lỗi
            throw new Error("Email này đã được đăng ký");
        }

        // Nếu chưa tồn tại, tạo user mới
        const newUser = {
            id: `u${Date.now()}`, // Tạo ID mới
            name: name,
            email: email,
            avatar: "https://i.pravatar.cc/150?img=11", // Avatar mặc định cho user mới
        };
        
        // Tự động đăng nhập cho user mới
        setUser(newUser);

        // Cập nhật trạng thái online cho user mới
        try {
            const key = `sv_user_presence_${newUser.id}`;
            window.localStorage.setItem(
                key,
                JSON.stringify({ isOnline: true, lastActive: new Date().toISOString() })
            );
        } catch {}
        
        // Lưu ý: User mới này sẽ không được lưu vào file datalogin.js
        // nên nếu bạn logout, bạn sẽ không thể login lại bằng tài khoản này
        // (Đây là giới hạn của việc dùng mock data)
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