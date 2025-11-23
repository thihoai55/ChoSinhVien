import React from "react";

export default function Badge({ 
  children, 
  variant = "default", 
  style = {}, 
  ...props 
}) {
  // Định nghĩa các kiểu cho từng variant
  const variantStyles = {
    default: {
      backgroundColor: "#2563eb", // xanh dương
      color: "#fff",
      border: "1px solid transparent",
    },
    secondary: {
      backgroundColor: "#e5e7eb", // xám nhạt
      color: "#111827",
      border: "1px solid transparent",
    },
    destructive: {
      backgroundColor: "#ef4444", // đỏ
      color: "#fff",
      border: "1px solid transparent",
    },
    outline: {
      backgroundColor: "transparent",
      color: "#111827",
      border: "1px solid #d1d5db",
    },
  };

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    padding: "3px 8px",
    fontSize: 12,
    fontWeight: 500,
    whiteSpace: "nowrap",
    gap: 4,
    cursor: "default",
    transition: "all 0.25s ease",
    userSelect: "none",
    ...variantStyles[variant],
    ...style,
  };

  return (
    <span
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = "brightness(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "brightness(1)";
      }}
      {...props}
    >
      {children}
    </span>
  );
}
