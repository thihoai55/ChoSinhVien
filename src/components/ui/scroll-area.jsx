import React from "react";

export function ScrollArea({ children, height = "300px", style = {}, ...props }) {
  return (
    <div
      style={{
        position: "relative",
        overflowY: "auto",
        maxHeight: height,
        borderRadius: 8,
        scrollbarWidth: "thin",
        scrollbarColor: "#d1d5db transparent",
        ...style,
      }}
      {...props}
    >
      {children}

      {/* Custom scrollbar style */}
      <style>
        {`
        /* Webkit scrollbar */
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }
        div::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
      `}
      </style>
    </div>
  );
}
