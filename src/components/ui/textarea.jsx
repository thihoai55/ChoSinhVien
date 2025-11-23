import React, { useState } from "react";

export default function Textarea({
  value,
  onChange,
  placeholder,
  disabled = false,
  rows = 3,
  style = {},
  className = "",
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const baseStyle = {
    width: "100%",
    minHeight: "64px",
    padding: "10px 12px",
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    resize: "none",
    outline: "none",
    transition: "all 0.25s ease",
    backgroundColor: disabled ? "#f3f4f6" : "#fff",
    color: disabled ? "#9ca3af" : "#111827",
    boxShadow: focused
      ? "0 0 0 3px rgba(59,130,246,0.3)"
      : "0 1px 2px rgba(0,0,0,0.05)",
  };

  const placeholderStyle = {
    color: "#9ca3af",
  };

  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...baseStyle,
        ...style,
      }}
      className={className}
      {...props}
    />
  );
}
