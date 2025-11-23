import React, { useState, useEffect } from "react";
// --- SỬA 1: Import hook useAuth ---
import { useAuth } from "../contexts/AuthContext";

// --- SỬA 2: Xóa prop "doLogin" ---
export default function Login({ onNavigate }) {
    // --- SỬA 3: Lấy hàm "login" từ context ---
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [shake, setShake] = useState(false);
    const [activeInput, setActiveInput] = useState(null);

    useEffect(() => {
        setTimeout(() => setFadeIn(true), 50);
    }, []);

    // --- SỬA 4: Viết lại handleSubmit để dùng context ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            triggerError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        setIsLoading(true);

        try {
            // Gọi hàm login từ AuthContext
            await login(email, password);
            
            // Nếu thành công, chỉ cần điều hướng
            // AuthContext sẽ tự động cập nhật user cho toàn bộ App
            onNavigate("home");

        } catch (err) {
            // Nếu thất bại (vd: sai pass), AuthContext sẽ ném lỗi
            triggerError(err.message || "Email hoặc mật khẩu không đúng.");
        }

        setIsLoading(false);
    };

    const triggerError = (msg) => {
        setError(msg);
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    // --- (Tất cả các style của bạn giữ nguyên) ---
    const container = {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eff6ff, #ffffff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    };
    const card = {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? "scale(1)" : "scale(0.95)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        animation: shake ? "shake 0.4s ease" : "none",
    };
    const input = {
        width: "100%",
        padding: "10px 12px 10px 38px",
        borderRadius: 8,
        border: "1px solid #d1d5db",
        outline: "none",
        transition: "border-color .2s, box-shadow .2s",
        boxSizing: 'border-box',
        boxShadow: 'inset 0 0 0 50px #fff', 
    };
    const inputFocus = {
        borderColor: "#2563eb",
        boxShadow: 'inset 0 0 0 50px #fff, 0 0 0 2px rgba(37,99,235,.2)',
    };
    const btn = {
        width: "100%",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "10px 14px",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: 600,
        transition: "all .2s",
    };
    const dividerWrap = { margin: "20px 0", position: "relative" };
    const dividerLine = {
        borderTop: "1px solid #e5e7eb",
        position: "absolute",
        top: "50%",
        width: "100%",
    };
    const dividerText = {
        position: "relative",
        background: "#fff",
        padding: "0 8px",
        color: "#6b7280",
        textAlign: "center",
    };

    return (
        <>
            <style>
                {`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}
            </style>
            <div style={container}>
                <div style={card}>
                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <i
                                className="bi bi-book"
                                style={{ fontSize: 28, color: "#2563eb" }}
                            ></i>
                            <h2 style={{ color: "#2563eb", margin: 0 }}>Sàn Trao Đổi SV</h2>
                        </div>
                        <p style={{ color: "#6b7280", marginTop: 8 }}>
                            Đăng nhập để tiếp tục
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div
                                style={{
                                    background: "#fee2e2",
                                    border: "1px solid #fecaca",
                                    color: "#b91c1c",
                                    borderRadius: 8,
                                    padding: "10px 12px",
                                    marginBottom: 16,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <i className="bi bi-exclamation-triangle"></i>
                                <span style={{ fontSize: 14 }}>{error}</span>
                            </div>
                        )}
                        <div style={{ marginBottom: 16 }}>
                            <label
                                style={{ display: "block", marginBottom: 6, fontWeight: 500 }}
                            >
                                Email sinh viên
                            </label>
                            <div style={{ position: "relative" }}>
                                <i
                                    className="bi bi-envelope"
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: 10,
                                        transform: "translateY(-50%)",
                                        color: "#9ca3af",
                                    }}
                                ></i>
                                <input
                                    type="email"
                                    placeholder="example@student.edu.vn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setActiveInput('email')}
                                    onBlur={() => setActiveInput(null)}
                                    style={{
                                        ...input,
                                        ...(activeInput === 'email' && inputFocus),
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label
                                style={{ display: "block", marginBottom: 6, fontWeight: 500 }}
                            >
                                Mật khẩu
                            </label>
                            <div style={{ position: "relative" }}>
                                <i
                                    className="bi bi-lock"
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: 10,
                                        transform: "translateY(-50%)",
                                        color: "#9ca3af",
                                    }}
                                ></i>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setActiveInput('password')}
                                    onBlur={() => setActiveInput(null)}
                                    style={{
                                        ...input,
                                        ...(activeInput === 'password' && inputFocus),
                                    }}
                                />
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 20,
                            }}
                        >
                            <label style={{ fontSize: 14, color: "#374151" }}>
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    style={{ marginRight: 6 }}
                                />
                                Ghi nhớ đăng nhập
                            </label>
                            <button
                                type="button"
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#2563eb",
                                    cursor: "pointer",
                                    fontSize: 14,
                                }}
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                        <button
                            type="submit"
                            style={btn}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = "#1d4ed8";
                                e.currentTarget.style.transform = "scale(1.02)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = "#2563eb";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                        <div style={dividerWrap}>
                            <div style={dividerLine}></div>
                            <div style={dividerText}>Hoặc</div>
                        </div>
                        <button
                            type="button"
                            style={{
                                ...btn,
                                background: "#fff",
                                color: "#111827",
                                border: "1px solid #e5e7eb",
                                marginBottom: 8,
                            }}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.background = "#f3f4f6")
                            }
                            onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
                        >
                            <i
                                className="bi bi-google"
                                style={{ marginRight: 6, color: "#ea4335" }}
                            ></i>
                            Đăng nhập với Google
                        </button>
                        <button
                            type="button"
                            style={{
                                ...btn,
                                background: "#fff",
                                color: "#111827",
                                border: "1px solid #e5e7eb",
                            }}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.background = "#f3f4f6")
                            }
                            onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
                        >
                            <i
                                className="bi bi-facebook"
                                style={{ marginRight: 6, color: "#2563eb" }}
                            ></i>
                            Đăng nhập với Facebook
                        </button>
                    </form>
                    <div style={{ textAlign: "center", marginTop: 20, fontSize: 14 }}>
                        Chưa có tài khoản?{" "}
                        <button
                            onClick={() => onNavigate?.("register")}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#2563eb",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Đăng ký ngay
                        </button>
                    </div>
                    <div style={{ textAlign: "center", marginTop: 20 }}>
                        <button
                            onClick={() => onNavigate?.("home")}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#6b7280",
                                cursor: "pointer",
                                fontSize: 14,
                            }}
                        >
                            ← Quay về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}