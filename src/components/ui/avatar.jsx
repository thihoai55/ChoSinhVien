import React, { useState } from "react";

export default function Avatar({
  src,
  alt = "avatar",
  size = 40,
  fallbackText = "👤",
  className = "",
  style = {},
}) {
  const [imgError, setImgError] = useState(false);

  const baseStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6", // màu nền fallback (xám nhạt)
    position: "relative",
    flexShrink: 0,
    boxShadow: "0 0 3px rgba(0,0,0,0.1)",
    ...style,
  };

  return (
    <div style={baseStyle} className={className}>
      {!imgError && src ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      ) : (
        <span
          style={{
            color: "#6b7280",
            fontSize: size / 2.5,
            userSelect: "none",
          }}
        >
          {fallbackText}
        </span>
      )}
    </div>
  );
}
