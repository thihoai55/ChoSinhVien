# 🚀 Quick Start Guide - Thanh toán ngân hàng

## 5 Bước nhanh

### 👤 Cho người mua

```
1️⃣ Mở sản phẩm → Nhấn "Mua ngay"
   ↓
2️⃣ Chọn: "Thanh toán trước (chuyển khoản)"
   ↓
3️⃣ Điền: Tên, SĐT, Địa chỉ, Số lượng
   ↓
4️⃣ Nhấn "Gửi yêu cầu mua"
   ↓
5️⃣ Chờ người bán gửi thông tin tài khoản
```

### 💼 Cho chủ bài đăng

```
1️⃣ Vào "Thông tin người mua" từ thông báo
   ↓
2️⃣ Xem yêu cầu (nếu paymentMethod = "bank_transfer")
   ↓
3️⃣ Nhấn "✓ Đồng ý mua hàng"
   ↓
4️⃣ Nhập: Ngân hàng, Số TK, Tên chủ TK, Phí vận chuyển (tùy)
   ↓
5️⃣ Upload QR code (tùy) → Nhấn "Lưu thông tin"
```

### 💰 Cho người mua (tiếp)

```
1️⃣ Nhận thông báo "Người bán đã gửi thông tin tài khoản"
   ↓
2️⃣ Nhấn vào thông báo → PaymentNotificationModal hiện
   ↓
3️⃣ Xem thông tin TK, tổng tiền, hướng dẫn
   ↓
4️⃣ Mở ngân hàng → Chuyển khoản theo hướng dẫn
   ↓
5️⃣ Quay lại app → Nhấn "✓ Đã thanh toán"
```

---

## 🔄 Luồng dữ liệu

```
PurchaseConfirmModal
    ↓ (submit with paymentMethod)
PostContext.addPurchaseTransaction()
    ↓
Transaction: {
  paymentMethod: "bank_transfer",
  bankTransferInfo: null
}
    ↓
Header notification
    ↓
BuyerInfoPage.handleApprovePurchase()
    ↓ (check paymentMethod)
BankTransferModal
    ↓ (submit bankInfo)
PostContext.updateTransactionBankInfo()
    ↓
Transaction.bankTransferInfo = {
  accountNumber, bankName, accountHolder, shippingFee, qrImageData
}
    ↓
Notification: payment_transfer_info
    ↓
Header notification
    ↓
PostDetailPage PaymentNotificationModal
    ↓ (confirm payment)
PostContext.completeTransactionPayment()
    ↓
Transaction.status = "completed"
    ↓
Notification: payment_completed (cho seller)
```

---

## 📂 File location

| File | Mục đích |
|------|---------|
| `src/components/BankTransferModal.jsx` | Form nhập bank info |
| `src/components/PaymentNotificationModal.jsx` | Modal hiển thị thông tin thanh toán |
| `src/components/PurchaseConfirmModal.jsx` | ✏️ Chỉnh sửa - Thêm payment method |
| `src/components/BuyerInfoPage.jsx` | ✏️ Chỉnh sửa - Logic hiển thị BankTransferModal |
| `src/components/PostDetailPage.jsx` | ✏️ Chỉnh sửa - Logic PaymentNotificationModal |
| `src/components/Header.jsx` | ✏️ Chỉnh sửa - Notification routing |
| `src/contexts/PostContext.jsx` | ✏️ Chỉnh sửa - Transaction handlers |

---

## 🎯 Key Functions

```javascript
// BuyerInfoPage
handleApprovePurchase(notifyId, transactionId, postId)
  → Kiểm tra paymentMethod
  → Nếu bank_transfer → showBankModal = true
  → Nếu cash_on_delivery → finishApproval()

handleBankTransferConfirm(bankInfo)
  → updateTransactionBankInfo(transactionId, bankInfo)
  → addNotification(buyerId, payment_transfer_info)
  → finishApproval()

// PostDetailPage
handlePaymentConfirmed()
  → completeTransactionPayment(transactionId)
  → addNotification(sellerId, payment_completed)

// PostContext
updateTransactionBankInfo(transactionId, bankInfo)
  → transaction.bankTransferInfo = bankInfo

completeTransactionPayment(transactionId)
  → transaction.status = "completed"
```

---

## 🧪 Test Checklist

- [ ] PurchaseConfirmModal: Chọn payment method được lưu
- [ ] BankTransferModal: Hiển thị khi duyệt (bank_transfer)
- [ ] BankTransferModal: Validation form hoạt động
- [ ] BankTransferModal: Upload QR code hoạt động
- [ ] PaymentNotificationModal: Hiển thị đúng thông tin
- [ ] PaymentNotificationModal: Quét QR hoạt động
- [ ] Payment confirmed: Notification gửi cho seller
- [ ] Transaction status: Chuyển thành "completed"
- [ ] Lịch sử giao dịch: Hiển thị đầy đủ

---

## ⚡ Pro Tips

1. **QR Code**: Sinh từ app ngân hàng hoặc dụng cụ tạo QR online
2. **Shipping Fee**: Để trống = 0, hoặc nhập giá trị cụ thể
3. **Account Number**: Nên kiểm tra lại 2 lần trước lưu
4. **Copy Button**: Người mua có thể sao chép số TK bằng nút 📋
5. **SessionStorage**: Dùng để truyền notification data giữa pages

---

## 📞 Debug Tips

Mở browser DevTools (F12) để check:

```javascript
// Check notification trong sessionStorage
window.sessionStorage.getItem('sv_payment_notification')

// Check transaction
const { transactions } = usePosts()
transactions.find(t => t.id === transactionId)

// Check notifications
const { notifications } = useNotifications()
notifications.filter(n => n.type === 'payment_transfer_info')
```

---

## 🎓 Component Props

### BankTransferModal
```jsx
<BankTransferModal
  post={post}
  buyer={user}
  transaction={transaction}
  onConfirm={(bankInfo) => {...}}
  onCancel={() => {...}}
/>
```

### PaymentNotificationModal
```jsx
<PaymentNotificationModal
  notification={notification}
  onConfirmPayment={() => {...}}
  onClose={() => {...}}
/>
```

---

Còn câu hỏi? Xem file `USAGE_GUIDE.md` để chi tiết hơn! 📖
