import { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2000); // Tự ẩn sau 2.5s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fee2e2", // đỏ nhạt đều
        color: "#b91c1c", // đỏ đậm cho chữ
        padding: "14px 24px",
        borderRadius: 10,
        border: "1px solid #fca5a5",
        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        fontWeight: 600,
        zIndex: 9999,
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "slideDown 0.4s ease, shake 0.5s ease 0.4s",
      }}
    >
      <i
        className="bi bi-exclamation-triangle-fill"
        style={{ marginRight: 10, fontSize: 18, color: "#dc2626" }}
      ></i>
      {message}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -40px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translate(-50%, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-50%, 0) rotate(0deg); }
          20%, 60% { transform: translate(-50%, 0) rotate(2deg); }
          40%, 80% { transform: translate(-50%, 0) rotate(-2deg); }
        }
      `}</style>
    </div>
  );
}
