# 📖 Hướng dẫn sử dụng: Hệ thống thanh toán ngân hàng

## 🎯 Tính năng

Người mua có thể chọn 2 phương thức thanh toán:
1. **Thanh toán sau khi nhận hàng** - Không cần chuyển khoản trước
2. **Thanh toán trước (chuyển khoản)** - Chuyển tiền trước khi nhận hàng

## 📱 Quy trình sử dụng

### Phần I: Người mua gửi yêu cầu mua

#### Step 1: Mở form mua ngay
1. Vào trang chi tiết sản phẩm
2. Nhấn nút **"Mua ngay"**
3. Cửa sổ PurchaseConfirmModal sẽ hiện lên

#### Step 2: Chọn phương thức thanh toán
Tại phần **"Phương thức thanh toán"**:
- ⭕ Thanh toán sau khi nhận hàng
- ⭕ Thanh toán trước (chuyển khoản)

#### Step 3: Điền thông tin
- **Tên** (bắt buộc)
- **Số điện thoại** (bắt buộc)
- **Địa chỉ giao hàng** (bắt buộc)
- **Số lượng** (bắt buộc)
- **Ghi chú thêm** (tùy chọn)

#### Step 4: Gửi yêu cầu
- Nhấn nút **"Gửi yêu cầu mua"**
- Chủ bài đăng sẽ nhận được thông báo

---

### Phần II: Chủ bài đăng duyệt yêu cầu (nếu chọn thanh toán chuyển khoản)

#### Step 1: Vào trang Thông tin người mua
1. Nhấn vào icon **🔔 Thông báo**
2. Chọn thông báo "Yêu cầu mua"
3. Hoặc vào **🔗 Thông tin người mua** từ menu

#### Step 2: Xem yêu cầu chi tiết
Sẽ thấy:
- Avatar và tên người mua
- Trạng thái: "Chờ xét duyệt" hoặc "✓ Đã duyệt"
- Thông tin người mua (tên, SĐT, địa chỉ)
- Thông tin sản phẩm (ảnh, tên, giá)
- Các nút hành động

#### Step 3: Nhấn "✓ Đồng ý mua hàng"

**Nếu người mua chọn: "Thanh toán sau khi nhận hàng"**
- ✅ Yêu cầu được duyệt ngay
- ✅ Người mua nhận thông báo "Yêu cầu được chấp nhận"

**Nếu người mua chọn: "Thanh toán trước (chuyển khoản)"**
- 📋 **BankTransferModal** sẽ hiện lên
- Chủ bài đăng cần nhập:

#### Step 4: Nhập thông tin tài khoản ngân hàng

**Bắt buộc:**
- 🏦 **Ngân hàng** - Ví dụ: VietcomBank, Techcombank, DongA Bank
- 💳 **Số tài khoản** - Ví dụ: 123456789
- 👤 **Tên chủ tài khoản** - Tên đầy đủ trên sổ tiết kiệm

**Tùy chọn:**
- 🚚 **Phí vận chuyển** - Nếu có (nhập 0 nếu miễn phí)
- 🔲 **Hình ảnh QR code** - Upload hình QR để người mua quét (JPG, PNG)

**Thông tin tự động:**
- Giá sản phẩm: Tự động lấy từ bài đăng
- Tổng tiền: Tự động tính = Giá sản phẩm + Phí vận chuyển

#### Step 5: Lưu thông tin
- Nhấn **"Lưu thông tin"**
- Hệ thống sẽ gửi thông báo cho người mua chứa bankTransferInfo

---

### Phần III: Người mua nhận thông báo và thanh toán

#### Step 1: Nhận thông báo
Người mua sẽ nhận thông báo:
> "Người bán đã gửi thông tin tài khoản để bạn chuyển khoản cho [Tên sản phẩm]"

#### Step 2: Mở thông báo
1. Nhấn vào icon **🔔 Thông báo**
2. Tìm thông báo với nội dung ở trên
3. Nhấn vào thông báo
4. **PaymentNotificationModal** sẽ hiện lên

#### Step 3: Xem thông tin tài khoản

Modal sẽ hiển thị:

**📦 Sản phẩm:**
- Tên: [Tên sản phẩm]
- Giá: [Giá]
- Vận chuyển: [Phí]
- **Tổng cộng: [Số tiền] đ** 💰

**💳 Thông tin tài khoản:**
- Ngân hàng: [Tên ngân hàng]
- Số tài khoản: [Số TK] (có nút 📋 sao chép)
- Chủ tài khoản: [Tên]

**🔲 Mã QR** (nếu có):
- Nhấn **"Hiển thị mã QR"** để xem

**📋 Hướng dẫn thanh toán:**
1. Mở ứng dụng ngân hàng (VCB, TPBank, v.v.)
2. Chọn chuyển tiền hoặc quét mã QR
3. Nhập số tài khoản hoặc quét mã
4. Nhập số tiền: **[Số tiền] đ**
5. Xác nhận thanh toán

#### Step 4: Xác nhận thanh toán
1. Sau khi đã chuyển khoản, nhấn **"✓ Đã thanh toán"** trong modal
2. Modal sẽ chuyển sang trạng thái "Thanh toán thành công" ✓
3. Hệ thống gửi thông báo cho người bán:
   > "[Tên người mua] đã thanh toán cho [Tên sản phẩm]"

---

## 🔔 Các loại thông báo

### 1. Thông báo cho người bán
| Loại | Nội dung | Khi nào |
|------|---------|--------|
| `purchase` | "[Tên người mua] muốn mua bài đăng của bạn: [Tên sản phẩm]" | Người mua gửi yêu cầu |
| `payment_completed` | "[Tên người mua] đã thanh toán cho [Tên sản phẩm]" | Người mua xác nhận đã chuyển khoản |

### 2. Thông báo cho người mua
| Loại | Nội dung | Khi nào |
|------|---------|--------|
| `purchase_approved` | "Yêu cầu mua của bạn cho [Tên sản phẩm] đã được chủ bài đăng chấp nhận" | Chủ bài đăng duyệt yêu cầu |
| `payment_transfer_info` | "Người bán đã gửi thông tin tài khoản để bạn chuyển khoản cho [Tên sản phẩm]" | Chủ bài đăng lưu bank info |
| `purchase_cancelled` | "Yêu cầu mua hàng của bạn cho [Tên sản phẩm] đã bị hủy" | Có yêu cầu khác được duyệt trước |

---

## 💾 Dữ liệu trong Transaction

Mỗi giao dịch mua hàng lưu thông tin:

```
{
  id: "txn_123456789",
  postId: "post_123",
  buyerId: "user_456",
  sellerId: "user_789",
  buyerInfo: {
    name: "Nguyễn Văn A",
    phone: "0912345678",
    address: "123 Đường ABC",
    quantity: 1,
    note: "Muốn giao buổi sáng",
    paymentMethod: "bank_transfer"  // 'cash_on_delivery' hoặc 'bank_transfer'
  },
  bankTransferInfo: {
    accountNumber: "123456789",
    bankName: "VietcomBank",
    accountHolder: "Nguyễn Văn B",
    shippingFee: "30000",
    qrImageData: "data:image/png;base64,..." // Ảnh QR base64
  },
  status: "completed",  // 'pending', 'approved', 'completed', 'cancelled'
  timestamp: "2024-12-09T10:30:00Z",
  completedAt: "2024-12-09T11:00:00Z"
}
```

---

## ⚠️ Lưu ý

1. **Số tài khoản sẽ được hiển thị công khai** cho người mua khi họ nhấn vào thông báo
2. **Ảnh QR code nên là ảnh có chất lượng cao** để người mua có thể quét được
3. **Phí vận chuyển sẽ được cộng vào tổng tiền** cần thanh toán
4. **Không thể sửa thông tin** sau khi lưu, chỉ có thể duyệt yêu cầu khác
5. **Khi chủ bài đăng duyệt một yêu cầu**, các yêu cầu mua khác sẽ tự động bị hủy

---

## 🐛 Troubleshooting

### Vấn đề: Không nhìn thấy BankTransferModal khi duyệt

**Nguyên nhân:** Người mua không chọn phương thức "Thanh toán trước (chuyển khoản)"

**Giải pháp:** Kiểm tra lại `paymentMethod` của yêu cầu trong transaction

### Vấn đề: Không nhìn thấy PaymentNotificationModal

**Nguyên nhân:** 
- Chưa click vào thông báo từ dropdown
- Hoặc không có bankTransferInfo được lưu

**Giải pháp:** 
- Đảm bảo chủ bài đăng đã lưu thông tin tài khoản
- Click vào thông báo có type `payment_transfer_info`

### Vấn đề: Hình ảnh QR không hiển thị

**Nguyên nhân:** Upload file không phải hình ảnh

**Giải pháp:** Chọn file có định dạng JPG, PNG hoặc GIF

---

## 📞 Hỗ trợ

Nếu có vấn đề, liên hệ quản trị viên hoặc check console log để xem chi tiết lỗi.
