import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Register({ onNavigate }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // === THÊM STATE ĐỂ ĐỒNG BỘ ===
    const [activeInput, setActiveInput] = useState(null);

    const getPasswordStrength = (pass) => {
        if (pass.length === 0) return { level: 0, label: "", color: "" };
        if (pass.length < 6) return { level: 1, label: "Yếu", color: "#ef4444" };
        if (pass.length < 10) return { level: 2, label: "Trung bình", color: "#eab308" };
        return { level: 3, label: "Mạnh", color: "#22c55e" };
    };

    const passwordStrength = getPasswordStrength(password);

    // === THÊM STYLE OBJECTS ĐỂ ĐỒNG BỘ ===
    const inputBase = {
        width: "100%",
        padding: "10px 12px 10px 34px", // Đã có padding cho icon
        border: "1px solid #d1d5db",
        borderRadius: 8,
        outline: "none",
        transition: "all 0.2s",
        boxSizing: 'border-box' // Chống tràn layout
    };

    const inputFocus = {
        borderColor: "#2563eb",
        boxShadow: "0 0 0 2px rgba(37,99,235,.2)" // Hiệu ứng "tràn"
    };
    // ====================================

    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }
        if (!email.includes("@")) {
            setError("Email không hợp lệ");
            return;
        }
        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }
        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }
        if (!agreeTerms) {
            setError("Vui lòng đồng ý với điều khoản sử dụng");
            return;
        }

        setIsLoading(true);
        try {
            await register(name, email, password, phone, location);
            // Chuyển sang trang đăng nhập để user nhập credentials vừa tạo
            setIsLoading(false);
            onNavigate?.("login");
        } catch (err) {
            setIsLoading(false);
            setError(err?.message || 'Đăng ký thất bại');
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#eff6ff,#ffffff)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px 16px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 420,
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    padding: 32,
                    transition: "all 0.3s ease",
                }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                        }}
                    >
                        <i className="bi bi-book" style={{ fontSize: 28, color: "#2563eb" }} />
                        <h2 style={{ color: "#2563eb", margin: 0 }}>Sàn Trao Đổi SV</h2>
                    </div>
                    <p style={{ color: "#6b7280", margin: 0 }}>Tạo tài khoản mới</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                    {error && (
                        <div
                            style={{
                                background: "#fee2e2",
                                border: "1px solid #fecaca",
                                color: "#b91c1c",
                                padding: "10px 12px",
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <i className="bi bi-exclamation-triangle-fill" />
                            <span style={{ fontSize: 14 }}>{error}</span>
                        </div>
                    )}

                    {/* Họ và tên */}
                    <div>
                        <label style={{ fontWeight: 500 }}>Họ và tên *</label>
                        <div style={{ position: "relative", marginTop: 4 }}>
                            <i
                                className="bi bi-person"
                                style={{
                                    position: "absolute",
                                    left: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#9ca3af",
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Nguyễn Văn A"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                // === CẬP NHẬT STYLE VÀ SỰ KIỆN ===
                                style={{
                                    ...inputBase,
                                    ...(activeInput === 'name' && inputFocus)
                                }}
                                onFocus={() => setActiveInput('name')}
                                onBlur={() => setActiveInput(null)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{ fontWeight: 500 }}>Email sinh viên *</label>
                        <div style={{ position: "relative", marginTop: 4 }}>
                            <i
                                className="bi bi-envelope"
                                style={{
                                    position: "absolute",
                                    left: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#9ca3af",
                                }}
                            />
                            <input
                                type="email"
                                placeholder="example@student.edu.vn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                // === CẬP NHẬT STYLE VÀ SỰ KIỆN ===
                                style={{
                                    ...inputBase,
                                    ...(activeInput === 'email' && inputFocus)
                                }}
                                onFocus={() => setActiveInput('email')}
                                onBlur={() => setActiveInput(null)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label style={{ fontWeight: 500 }}>Số điện thoại</label>
                        <div style={{ position: "relative", marginTop: 4 }}>
                            <i
                                className="bi bi-telephone"
                                style={{
                                    position: "absolute",
                                    left: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#9ca3af",
                                }}
                            />
                            <input
                                type="tel"
                                placeholder="0912345678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{
                                    ...inputBase,
                                    ...(activeInput === 'phone' && inputFocus)
                                }}
                                onFocus={() => setActiveInput('phone')}
                                onBlur={() => setActiveInput(null)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Địa chỉ */}
                    <div>
                        <label style={{ fontWeight: 500 }}>Địa chỉ</label>
                        <div style={{ position: "relative", marginTop: 4 }}>
                            <i
                                className="bi bi-geo-alt"
                                style={{
                                    position: "absolute",
                                    left: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#9ca3af",
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Quận/Huyện, Thành phố"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={{
                                    ...inputBase,
                                    ...(activeInput === 'location' && inputFocus)
                                }}
                                onFocus={() => setActiveInput('location')}
                                onBlur={() => setActiveInput(null)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Mật khẩu */}
                    <div>
                        <label style={{ fontWeight: 500 }}>Mật khẩu *</label>
                        <div style={{ position: "relative", marginTop: 4 }}>
                            <i
                                className="bi bi-lock"
                                style={{
                                    position: "absolute",
                                    left: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#9ca3af",
                                }}
                            />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                // === CẬP NHẬT STYLE VÀ SỰ KIỆN ===
                                style={{
                                    ...inputBase,
                                    ...(activeInput === 'password' && inputFocus)
                                }}
                                onFocus={() => setActiveInput('password')}
                                onBlur={() => setActiveInput(null)}
                                disabled={isLoading}
                            />
                        </div>
                        {password && (
                            <div style={{ marginTop: 6 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 4,
                                        marginBottom: 4,
                                    }}
                                >
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            style={{
                                                flex: 1,
                                                height: 4,
                                                borderRadius: 2,
                                                background:
                                                    i <= passwordStrength.level
                                                        ? passwordStrength.color
                                                        : "#e5e7eb",
                                                transition: "all 0.3s",
                                            }}
                                        />
                                    ))}
                                </div>
                                <span style={{ fontSize: 12, color: "#6b7280" }}>
                                    Độ mạnh:{" "}
                                    <b style={{ color: passwordStrength.color }}>
                                        {passwordStrength.label}
                                    </b>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div>
                        <label style={{ fontWeight: 500 }}>Xác nhận mật khẩu *</label>
                        <div style={{ position: "relative", marginTop: 4 }}>
                            <i
                                className="bi bi-lock-fill"
                                style={{
                                    position: "absolute",
                                    left: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#9ca3af",
                                }}
                            />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                // === CẬP NHẬT STYLE VÀ SỰ KIỆN ===
                                style={{
                                    ...inputBase,
                                    ...(activeInput === 'confirmPassword' && inputFocus)
                                }}
                                onFocus={() => setActiveInput('confirmPassword')}
                                onBlur={() => setActiveInput(null)}
                                disabled={isLoading}
                            />
                            {confirmPassword && password === confirmPassword && (
                                <i
                                    className="bi bi-check-circle-fill"
                                    style={{
                                        position: "absolute",
                                        right: 10,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#22c55e",
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Điều khoản */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                        />
                        <span style={{ fontSize: 14, color: "#4b5563" }}>
                            Tôi đồng ý với{" "}
                            <span
                                style={{ color: "#2563eb", cursor: "pointer" }}
                                onClick={() => alert("Điều khoản sử dụng")}
                            >
                                Điều khoản sử dụng
                            </span>{" "}
                            và{" "}
                            <span
                                style={{ color: "#2563eb", cursor: "pointer" }}
                                onClick={() => alert("Chính sách bảo mật")}
                            >
                                Chính sách bảo mật
                            </span>
                        </span>
                    </div>

                    {/* Nút đăng ký */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            padding: "10px 14px",
                            borderRadius: 8,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1d4ed8";
                            e.currentTarget.style.transform = "scale(1.02)";
                            e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#2563eb";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>

                    <div style={{ textAlign: "center", marginTop: 8 }}>
                        <p style={{ fontSize: 14, color: "#6b7280" }}>
                            Đã có tài khoản?{" "}
                            <span
                                onClick={() => onNavigate?.("login")}
                                style={{
                                    color: "#2563eb",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Đăng nhập ngay
                            </span>
                        </p>
                    </div>
                </form>

                <div style={{ textAlign: "center", marginTop: 0 }}>
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
    );
}