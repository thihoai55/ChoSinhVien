import React from "react";

export function Card({ children, style = {}, className = "", ...props }) {
  return (
    <div
      style={{
        background: "#fff",
        color: "#111827",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "all 0.25s ease",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, style = {}, className = "", ...props }) {
  return (
    <div
      style={{
        padding: "20px 24px 0 24px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        borderBottom: "1px solid #f3f4f6",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, style = {}, className = "", ...props }) {
  return (
    <h4
      style={{
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 1.4,
        margin: 0,
        color: "#111827",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </h4>
  );
}

export function CardDescription({
  children,
  style = {},
  className = "",
  ...props
}) {
  return (
    <p
      style={{
        fontSize: 14,
        color: "#6b7280",
        margin: 0,
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardAction({ children, style = {}, className = "", ...props }) {
  return (
    <div
      style={{
        alignSelf: "flex-end",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, style = {}, className = "", ...props }) {
  return (
    <div
      style={{
        padding: "0 24px 24px 24px",
        flex: 1,
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ children, style = {}, className = "", ...props }) {
  return (
    <div
      style={{
        padding: "12px 24px 20px 24px",
        borderTop: "1px solid #f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

