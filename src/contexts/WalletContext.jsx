import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WalletContext = createContext();

const STORAGE_KEY_BALANCE = "sv_wallet_balance";
const STORAGE_KEY_TRANSACTIONS = "sv_wallet_transactions";

// Load balance từ localStorage
function loadBalanceFromStorage(userId) {
    if (typeof window === "undefined" || !userId) return 0;
    try {
        const key = `${STORAGE_KEY_BALANCE}_${userId}`;
        const raw = window.localStorage.getItem(key);
        if (!raw) return 0;
        const parsed = parseFloat(raw);
        return isNaN(parsed) ? 0 : parsed;
    } catch (e) {
        console.error("Failed to load balance from localStorage", e);
        return 0;
    }
}

// Load transactions từ localStorage
function loadTransactionsFromStorage(userId) {
    if (typeof window === "undefined" || !userId) return [];
    try {
        const key = `${STORAGE_KEY_TRANSACTIONS}_${userId}`;
        const raw = window.localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error("Failed to load transactions from localStorage", e);
        return [];
    }
}

export function WalletProvider({ children }) {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);

    // Load balance và transactions khi user đăng nhập
    useEffect(() => {
        if (user?.id) {
            const userBalance = loadBalanceFromStorage(user.id);
            const userTransactions = loadTransactionsFromStorage(user.id);
            setBalance(userBalance);
            setTransactions(userTransactions);
        } else {
            setBalance(0);
            setTransactions([]);
        }
    }, [user?.id]);

    // Lưu balance vào localStorage khi thay đổi
    useEffect(() => {
        if (user?.id && typeof window !== "undefined") {
            try {
                const key = `${STORAGE_KEY_BALANCE}_${user.id}`;
                window.localStorage.setItem(key, balance.toString());
            } catch (e) {
                console.error("Failed to save balance to localStorage", e);
            }
        }
    }, [balance, user?.id]);

    // Lưu transactions vào localStorage khi thay đổi
    useEffect(() => {
        if (user?.id && typeof window !== "undefined") {
            try {
                const key = `${STORAGE_KEY_TRANSACTIONS}_${user.id}`;
                window.localStorage.setItem(key, JSON.stringify(transactions));
            } catch (e) {
                console.error("Failed to save transactions to localStorage", e);
            }
        }
    }, [transactions, user?.id]);

    // Hàm nạp tiền
    const recharge = (amount, paymentMethod = "VNPay") => {
        if (!user?.id || amount <= 0) return false;

        const newBalance = balance + amount;
        setBalance(newBalance);

        // Thêm transaction vào lịch sử
        const newTransaction = {
            id: Date.now().toString(),
            type: "recharge", // 'recharge' | 'payment' | 'refund'
            amount: amount,
            balance: newBalance,
            paymentMethod: paymentMethod,
            status: "success",
            description: `Nạp tiền ${amount.toLocaleString('vi-VN')}đ qua ${paymentMethod}`,
            timestamp: new Date().toISOString(),
            createdAt: new Date().toLocaleString('vi-VN'),
        };

        setTransactions((prev) => [newTransaction, ...prev]);
        return true;
    };

    // Hàm thanh toán (trừ tiền)
    const pay = (amount, description = "Thanh toán") => {
        if (!user?.id || amount <= 0 || balance < amount) return false;

        const newBalance = balance - amount;
        setBalance(newBalance);

        // Thêm transaction vào lịch sử
        const newTransaction = {
            id: Date.now().toString(),
            type: "payment",
            amount: -amount,
            balance: newBalance,
            paymentMethod: "internal",
            status: "success",
            description: description,
            timestamp: new Date().toISOString(),
            createdAt: new Date().toLocaleString('vi-VN'),
        };

        setTransactions((prev) => [newTransaction, ...prev]);
        return true;
    };

    return (
        <WalletContext.Provider
            value={{
                balance,
                transactions,
                recharge,
                pay,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet phải được dùng trong WalletProvider");
    }
    return context;
}

