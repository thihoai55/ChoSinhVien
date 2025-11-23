import React, { useState } from "react";

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "default",
  size = "default",
  style = {},
  className = "",
}) {
  const [hovered, setHovered] = useState(false);

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.25s ease",
    border: "none",
    outline: "none",
    opacity: disabled ? 0.6 : 1,
    userSelect: "none",
  };

  const variantStyles = {
    default: {
      background: hovered ? "#2563ebcc" : "#2563eb",
      color: "#fff",
    },
    destructive: {
      background: hovered ? "#dc2626cc" : "#dc2626",
      color: "#fff",
    },
    outline: {
      background: hovered ? "#f9fafb" : "#fff",
      color: "#111",
      border: "1px solid #d1d5db",
    },
    secondary: {
      background: hovered ? "#e0e7ff" : "#eef2ff",
      color: "#1e3a8a",
    },
    ghost: {
      background: hovered ? "rgba(0,0,0,0.05)" : "transparent",
      color: "#374151",
    },
    link: {
      background: "transparent",
      color: hovered ? "#1d4ed8" : "#2563eb",
      textDecoration: hovered ? "underline" : "none",
    },
  };

  const sizeStyles = {
    default: { padding: "8px 16px", height: 36 },
    sm: { padding: "6px 12px", height: 32, fontSize: 13 },
    lg: { padding: "10px 20px", height: 42, fontSize: 15 },
    icon: { width: 36, height: 36, borderRadius: "50%" },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
