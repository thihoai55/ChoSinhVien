import React from "react";

export function Separator({
  orientation = "horizontal",
  style = {},
  ...props
}) {
  const baseStyle = {
    backgroundColor: "#e5e7eb", // Màu xám nhạt (giống border Tailwind)
    flexShrink: 0,
  };

  const separatorStyle =
    orientation === "horizontal"
      ? { height: 1, width: "100%", margin: "12px 0" }
      : { width: 1, height: "100%", margin: "0 12px" };

  return (
    <div
      style={{ ...baseStyle, ...separatorStyle, ...style }}
      aria-orientation={orientation}
      {...props}
    />
  );
}
