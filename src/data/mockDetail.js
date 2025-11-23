import { mockPosts, mockCommentsByPostId as commentsData } from './mock';
import { mockUsers } from './userData';

// --- 1. Tạo danh sách tác giả (User Pool) ---
// const mockUsers = [
//   { id: 'u1', name: 'Trần Văn An', avatar: 'https://i.pravatar.cc/150?img=1', phone: '0912345678' },
//   { id: 'u2', name: 'Nguyễn Thị Bình', avatar: 'https://i.pravatar.cc/150?img=2', phone: '0987654321' },
//   { id: 'u3', name: 'Lê Minh Cường', avatar: 'https://i.pravatar.cc/150?img=3', phone: '0905123456' },
//   { id: 'u4', name: 'Phạm Hồng Duyên', avatar: 'https://i.pravatar.cc/150?img=4', phone: '0935654789' },
//   { id: 'u5', name: 'Võ Tiến Đạt', avatar: 'https://i.pravatar.cc/150?img=5', phone: '0978123987' },
//   { id: 'u6', name: 'Hoàng Thị Giang', avatar: 'https://i.pravatar.cc/150?img=6', phone: '0909456123' },
//   { id: 'u7', name: 'Bùi Đức Huy', avatar: 'https://i.pravatar.cc/150?img=7', phone: '0966789456' },
//   { id: 'u8', name: 'Đặng Thu Hằng', avatar: 'https://i.pravatar.cc/150?img=8', phone: '0922334455' },
//   { id: 'u9', name: 'Trịnh Quốc Khánh', avatar: 'https://i.pravatar.cc/150?img=9', phone: '0955667788' },
//   { id: 'u10', name: 'Ngô Thanh Lam', avatar: 'https://i.pravatar.cc/150?img=10', phone: '0988990011' },
// ];

// --- 2. Tạo dữ liệu chi tiết cho TỪNG bài đăng ---
// ✅ ĐÃ CẬP NHẬT MẢNG `images` VỚI NHIỀU ẢNH HƠN
const detailedData = {
    1: {
      authorId: 'u1',
      price: '250.000đ',
      address: 'KTX Khu A, ĐHQG',
      createdAt: '2 giờ trước',
      description: `Mình mới mua bàn mới nên pass lại bàn này.
  - Kích thước: 80x50x75cm
  - Chất liệu: Gỗ ép công nghiệp
  - Tình trạng: Mới 90%, không lung lay, mặt bàn có vài vết xước dăm không đáng kể.`,
      images: [
        'https://picsum.photos/seed/desk/400/300',
        'https://picsum.photos/seed/desk-2/400/300',
        'https://picsum.photos/seed/desk-3/400/300',
        'https://picsum.photos/seed/desk-4/400/300'
      ]
    },
    2: {
      authorId: 'u2',
      price: '50.000đ',
      address: 'Thư viện Trung tâm, ĐHQG',
      createdAt: '5 giờ trước',
      description: `Giáo trình Toán cao cấp 1 (Giải tích 1) của NXB ĐHQG.
  - Sách đã bọc bìa plastic.
  - Bên trong sạch sẽ, không ghi chú, không highlight.`,
      images: [
        'https://picsum.photos/seed/book/400/300',
        'https://picsum.photos/seed/book-2/400/300',
        'https://picsum.photos/seed/book-3/400/300'
      ]
    },
    3: {
      authorId: 'u3',
      price: '5.500.000đ',
      address: 'Quận 9, TP. Thủ Đức',
      createdAt: '1 ngày trước',
      description: `Cần lên đời nên pass lại laptop Dell Inspiron.
  - Cấu hình: Core i5 Gen 8, RAM 8GB, SSD 256GB.
  - Màn hình 15.6 inch Full HD.
  - Tình trạng: Ngoại hình 95%, pin còn tốt (dùng VP 3-4h).`,
      images: [
        'https://picsum.photos/seed/laptop/400/300',
        'https://picsum.photos/seed/laptop-2/400/300',
        'https://picsum.photos/seed/laptop-3/400/300'
      ]
    },
    4: {
      authorId: 'u4',
      price: '700.000đ',
      address: 'Linh Trung, TP. Thủ Đức',
      createdAt: '30 phút trước',
      description: `Xe đạp mini Nhật bãi, màu xanh.
  - Xe đi êm, nhẹ, không có tiếng kêu.
  - Mới thay lốp sau.
  - Có giỏ xe và yên sau.`,
      images: [
        'https://picsum.photos/seed/bike/400/300',
        'https://picsum.photos/seed/bike-2/400/300',
        'https://picsum.photos/seed/bike-3/400/300'
      ]
    },
    5: {
      authorId: 'u1',
      price: '400.000đ',
      address: 'KTX Khu B, ĐHQG',
      createdAt: '8 giờ trước',
      description: `Ghế xoay văn phòng lưới, chân inox.
  - Mua tại nội thất ABC 3 tháng trước, giá mới 800k.
  - Tình trạng: Mới 98%, lưới không rách, ben nâng hạ hoạt động tốt.`,
      images: [
        'https://picsum.photos/seed/chair/400/300',
        'https://picsum.photos/seed/chair-2/400/300',
        'https://picsum.photos/seed/chair-3/400/300'
      ]
    },
    6: {
      authorId: 'u5',
      price: '1.200.000đ',
      address: 'Gò Vấp, TP.HCM',
      createdAt: '2 ngày trước',
      description: `Tai nghe Sony WH-CH710N, màu đen.
  - Hàng chính hãng mua tại CellphoneS.
  - Tính năng chống ồn chủ động (ANC) dùng tốt.
  - Pin cực trâu, nghe cả tuần mới sạc.`,
      images: [
        'https://picsum.photos/seed/headphone/400/300',
        'https://picsum.photos/seed/headphone-2/400/300',
        'https://picsum.photos/seed/headphone-3/400/300'
      ]
    },
    7: {
      authorId: 'u6',
      price: '350.000đ',
      address: 'Quận 9, TP. Thủ Đức',
      createdAt: '1 giờ trước',
      description: `Áo khoác phao Uniqlo nam, màu rêu.
  - Size M (cho người 60-70kg).
  - Áo siêu nhẹ, giữ nhiệt tốt, có thể gấp gọn.`,
      images: [
        'https://picsum.photos/seed/jacket/400/300',
        'https://picsum.photos/seed/jacket-2/400/300',
        'https://picsum.photos/seed/jacket-3/400/300',
      ]
    },
    8: {
      authorId: 'u2',
      price: '150.000đ',
      address: 'KTX Khu A, ĐHQG',
      createdAt: '10 giờ trước',
      description: `Tủ sách mini 3 tầng, gỗ ép.
  - Kích thước: Cao 90cm, Rộng 50cm.
  - Dễ lắp ráp, gọn nhẹ.`,
      images: [
        'https://picsum.photos/seed/bookshelf/400/300',
        'https://picsum.photos/seed/bookshelf-2/400/300'
      ]
    },
    9: {
      authorId: 'u7',
      price: '3.800.000đ',
      address: 'Bình Thạnh, TP.HCM',
      createdAt: '3 giờ trước',
      description: `iPhone X 64GB màu trắng (Silver).
  - Bản quốc tế LL/A.
  - Tình trạng pin: 85% (zin theo máy).
  - Máy zin 100%, chưa qua sửa chữa.`,
      images: [
        'https://picsum.photos/seed/iphone/400/300',
        'https://picsum.photos/seed/iphone-2/400/300',
        'https://picsum.photos/seed/iphone-3/400/300'
      ]
    },
    10: {
      authorId: 'u8',
      price: '600.000đ',
      address: 'Quận 10, TP.HCM',
      createdAt: '1 ngày trước',
      description: `Giày Adidas Alphabounce, size 40 (fit 40.5).
  - Màu trắng, còn mới 85%.
  - Đế còn tốt, chưa mòn nhiều.`,
      images: [
        'https://picsum.photos/seed/shoes/400/300',
        'https://picsum.photos/seed/shoes-2/400/300',
        'https://picsum.photos/seed/shoes-3/400/300',
      ]
    },
  11: {
    authorId: 'u9',
    price: '200.000đ',
    address: 'Linh Trung, TP. Thủ Đức',
    createdAt: '4 giờ trước',
    description: `Cặp laptop da (PU), màu nâu.
  - Chống nước tốt.
  - Đựng vừa máy 15.6 inch.
  - Tình trạng: Mới 100%, được tặng không dùng đến.`,
    images: [
      'https://picsum.photos/seed/bag/400/300',
      'https://picsum.photos/seed/bag-2/400/300'
    ]
  },
  12: {
    authorId: 'u10',
    price: '30.000đ',
    address: 'KTX Khu B, ĐHQG',
    createdAt: '12 giờ trước',
    description: `Sách Kinh tế vi mô (NXB Kinh Tế).
  - Sách có highlight một số chương đầu.
  - Phù hợp cho các bạn sinh viên năm 1-2.`,
    images: [
      'https://picsum.photos/seed/economics/400/300',
      'https://picsum.photos/seed/economics-2/400/300',
      'https://picsum.photos/seed/economics-3/400/300',
    ]
  },
  13: {
    authorId: 'u3',
    price: '180.000đ',
    address: 'Quận 9, TP. Thủ Đức',
    createdAt: '1 ngày trước',
    description: `Chuột không dây Logitech M331 Silent.
  - Chuột silent, click không gây tiếng ồn.
  - Mượt, pin trâu (1 cục pin AA dùng cả năm).`,
    images: [
      'https://picsum.photos/seed/mouse/400/300',
      'https://picsum.photos/seed/mouse-2/400/300'
    ]
  },
  14: {
    authorId: 'u5',
    price: '450.000đ',
    address: 'Gò Vấp, TP.HCM',
    createdAt: '6 giờ trước',
    description: `Máy tính Casio FX-580VN X.
  - Máy tính quốc dân cho sinh viên kỹ thuật.
  - Tình trạng: Mới 99%, còn hộp, sách HDSD.`,
    images: [
      'https://picsum.photos/seed/casio/400/300',
      'https://picsum.photos/seed/casio-2/400/300'
    ]
  },
  15: {
    authorId: 'u7',
    price: '2.800.000đ',
    address: 'Bình Thạnh, TP.HCM',
    createdAt: '3 ngày trước',
    description: `Xe đạp thể thao Giant ATX 660, màu đen cam.
  - Khung nhôm size S, bánh 26 inch.
  - Bộ đề Shimano 21 tốc độ.
  - Đã thay lốp Kenda.`,
    images: [
      'https://picsum.photos/seed/giantbike/400/300',
      'https://picsum.photos/seed/giantbike-2/400/300',
      'https://picsum.photos/seed/giantbike-3/400/300',
      'https://picsum.photos/seed/giantbike-4/400/300',
    ]
  },
  16: {
    authorId: 'u6',
    price: '500.000đ',
    address: 'Quận 9, TP. Thủ Đức',
    createdAt: '1 ngày trước',
    description: `Máy xay sinh tố Philips HR2118, 600W.
  - Cối thủy tinh, 5 tốc độ.
  - Lưỡi dao inox sắc, xay đá bi tốt.
  - Đầy đủ 3 cối (cối lớn, cối xay thịt, cối xay khô).`,
    images: [
      'https://picsum.photos/seed/blender/400/300',
      'https://picsum.photos/seed/blender-2/400/300'
    ]
  },
  17: {
    authorId: 'u8',
    price: '300.000đ',
    address: 'Quận 10, TP.HCM',
    createdAt: '10 giờ trước',
    description: `Nồi cơm điện Sharp 1.8L (model KS-18TJV).
  - Lòng nồi chống dính.
  - Nấu cơm ngon, giữ ấm tốt.
  - Tình trạng: Còn dùng tốt, ngoại hình 85%.`,
    images: [
      'https://picsum.photos/seed/ricecooker/400/300',
      'https://picsum.photos/seed/ricecooker-2/400/300'
    ]
  },
  18: {
    authorId: 'u10',
    price: '700.000đ',
    address: 'KTX Khu B, ĐHQG',
    createdAt: '2 ngày trước',
    description: `Đàn guitar classic, gỗ thông.
  - Âm thanh ấm, vang.
  - Action thấp, dễ bấm, phù hợp cho người mới học.
  - Tặng kèm bao da 3 lớp và capo.`,
    images: [
      'https://picsum.photos/seed/guitar/400/300',
      'https://picsum.photos/seed/guitar-2/400/300',
      'https://picsum.photos/seed/guitar-3/400/300',
    ]
  },
  19: {
    authorId: 'u9',
    price: '2.200.000đ',
    address: 'Linh Trung, TP. Thủ Đức',
    createdAt: '5 ngày trước',
    description: `Thanh lý bộ sofa phòng khách (sofa + bàn trà).
  - Kích thước sofa: 1m8 x 0.8m.
  - Chất liệu: Vải nỉ màu xám, dễ vệ sinh.
  - Bàn trà gỗ, mặt kính.`,
    images: [
      'https://picsum.photos/seed/sofa/400/300',
      'https://picsum.photos/seed/sofa-2/400/300',
      'https://picsum.photos/seed/sofa-3/400/300'
    ]
  },
  20: {
    authorId: 'u4',
    price: '1.500.000đ',
    address: 'Linh Trung, TP. Thủ Đức',
    createdAt: '1 ngày trước',
    description: `Bàn làm việc gỗ sồi, chân sắt (kiểu chữ U).
  - Kích thước: 120x60cm.
  - Mặt bàn gỗ sồi thật, rất nặng và chắc chắn.
  - Có 2 ngăn kéo.`,
    images: [
      'https://picsum.photos/seed/office/400/300',
      'https://picsum.photos/seed/office-2/400/300'
    ]
  },
  21: {
    authorId: 'u1',
    price: '120.000đ',
    address: 'KTX Khu A, ĐHQG',
    createdAt: '3 giờ trước',
    description: `Đèn bàn học chống cận Rạng Đông.
  - Ánh sáng LED vàng, 3 chế độ sáng (chạm cảm ứng).
  - Thân đèn uốn dẻo.`,
    images: [
      'https://picsum.photos/seed/ledlamp/400/300',
      'https://picsum.photos/seed/ledlamp-2/400/300',
    ]
  },
  22: {
    authorId: 'u8',
    price: '800.000đ',
    address: 'Quận 10, TP.HCM',
    createdAt: '2 ngày trước',
    description: `Vợt cầu lông Yonex Astrox 88D (bản fake 1:1).
  - Carbon siêu nhẹ, nặng 4U.
  - Vợt thiên công, đập cầu tốt.
  - Đã căng cước BG66 Ultimax (10.5kg).`,
    images: [
      'https://picsum.photos/seed/badminton/400/300',
      'https://picsum.photos/seed/badminton-2/400/300',
      'https://picsum.photos/seed/badminton-3/400/300',
    ]
  },
  23: {
    authorId: 'u6',
    price: '200.000đ',
    address: 'Quận 9, TP. Thủ Đức',
    createdAt: '1 ngày trước',
    description: `Bình giữ nhiệt Lock&Lock 500ml, màu đen nhám.
  - Chất liệu inox 304.
  - Giữ nóng/lạnh 12 tiếng.
  - Tình trạng: Mới 100%, full box (được tặng không dùng).`,
    images: [
      'https://picsum.photos/seed/bottle/400/300',
      'https://picsum.photos/seed/bottle-2/400/300',
    ]
  },
  24: {
    authorId: 'u2',
    price: '250.000đ',
    address: 'KTX Khu A, ĐHQG',
    createdAt: '15 giờ trước',
    description: `Bộ 3 tranh treo tường canvas, phong cảnh Bắc Âu.
  - Kích thước mỗi tranh: 40x60cm.
  - Khung gỗ thông.`,
    images: [
      'https://picsum.photos/seed/canvas/400/300',
      'https://picsum.photos/seed/canvas-2/400/300',
      'https://picsum.photos/seed/canvas-3/400/300'
    ]
  },
  25: {
    authorId: 'u4',
    price: '150.000đ',
    address: 'Linh Trung, TP. Thủ Đức',
    createdAt: '1 ngày trước',
    description: `Máy sấy tóc Panasonic EH-ND65, công suất 1800W.
  - Sấy khô nhanh, 3 chế độ sấy (có sấy mát).
  - Tình trạng: Dùng tốt, không lỗi.`,
    images: [
      'https://picsum.photos/seed/hairdryer/400/300',
      'https://picsum.photos/seed/hairdryer-2/400/300',
    ]
  },
  26: {
    authorId: 'u7',
    price: '180.000đ',
    address: 'Bình Thạnh, TP.HCM',
    createdAt: '7 giờ trước',
    description: `Áo thun local brand (Dirty Coins), màu đen.
  - Size L (form oversize).
  - Chất vải cotton dày dặn, hình in sau lưng.`,
    images: [
      'https://picsum.photos/seed/tshirt/400/300',
      'https://picsum.photos/seed/tshirt-2/400/300',
      'https://picsum.photos/seed/tshirt-3/400/300',
    ]
  },
  27: {
    authorId: 'u10',
    price: '600.000đ',
    address: 'KTX Khu B, ĐHQG',
    createdAt: '1 ngày trước',
    description: `Tai nghe True Wireless Samsung Galaxy Buds 2.
  - Mới 95%, đầy đủ hộp và cáp sạc.
  - Âm thanh sống động, pin 5h + hộp sạc 20h.`,
    images: [
      'https://picsum.photos/seed/earbuds/400/300',
      'https://picsum.photos/seed/earbuds-2/400/300',
      'https://picsum.photos/seed/earbuds-3/400/300',
    ]
  },
  28: {
    authorId: 'u1',
    price: '400.000đ',
    address: 'KTX Khu A, ĐHQG',
    createdAt: '2 giờ trước',
    description: `Đèn ngủ LED cảm ứng, nhiều màu, hình quả cầu.
  - Điều chỉnh 7 màu, chạm bật tắt.
  - Tình trạng: Mới 99%.`,
    images: [
      'https://picsum.photos/seed/nightlamp/400/300',
      'https://picsum.photos/seed/nightlamp-2/400/300',
    ]
  },
  29: {
    authorId: 'u3',
    price: '350.000đ',
    address: 'Quận 9, TP. Thủ Đức',
    createdAt: '3 ngày trước',
    description: `Balo đi học/mang laptop, màu xám.
  - Ngăn chính rộng, ngăn laptop 15.6 inch.
  - Ngăn phụ tiện dụng, nhiều ngăn nhỏ.`,
    images: [
      'https://picsum.photos/seed/backpack/400/300',
      'https://picsum.photos/seed/backpack-2/400/300',
      'https://picsum.photos/seed/backpack-3/400/300',
    ]
  },
  30: {
    authorId: 'u5',
    price: '150.000đ',
    address: 'Gò Vấp, TP.HCM',
    createdAt: '5 giờ trước',
    description: `Giày Sneaker Nike Air Max, size 40.
  - Màu trắng, đi vài lần, còn mới 90%.
  - Đế êm, êm chân, form đẹp.`,
    images: [
      'https://picsum.photos/seed/nike/400/300',
      'https://picsum.photos/seed/nike-2/400/300',
      'https://picsum.photos/seed/nike-3/400/300',
    ]
  },
  31: {
    authorId: 'u1', 
    price: '150.000đ', 
    address: 'KTX Khu A, ĐHQG', 
    createdAt: '1 ngày trước', 
    description: `Bộ dao nhà bếp 6 món, thép không gỉ, mới 95%.
    - Dùng rất tốt, sắc bén.
    - Pass lại do được tặng bộ mới.`,
    images: [
      'https://picsum.photos/seed/knife/400/300',
      'https://picsum.photos/seed/knife-2/400/300',
    ]
  },
  32: {
    authorId: 'u4',
    price: '420.000đ',
    address: 'Quận 5, TP.HCM',
    createdAt: '3 giờ trước',
    description: `Loa bluetooth JBL bass mạnh, pin sử dụng đến 10 giờ.
    - Âm thanh lớn, rõ, bass chắc.
    - Kết nối Bluetooth ổn định.`,
    images: [
      'https://picsum.photos/seed/speaker/400/300',
      'https://picsum.photos/seed/speaker2/400/300',
      'https://picsum.photos/seed/speaker3/400/300',
    ]
  },
  33: {
    authorId: 'u2',
    price: '45.000đ',
    address: 'Quận 7, TP.HCM',
    createdAt: '5 giờ trước',
    description: `Sách Kỹ thuật lập trình C, tặng kèm bookmark.
    - Sách không ghi chú, không rách.
    - Giấy đẹp, dễ đọc.`,
    images: [
      'https://picsum.photos/seed/cbook/400/300',
      'https://picsum.photos/seed/cbook2/400/300'
    ]
  },
  34: {
    authorId: 'u1',
    price: '2.500.000đ',
    address: 'Quận 10, TP.HCM',
    createdAt: '2 ngày trước',
    description: `Máy chạy bộ điện, tải trọng 100kg, gấp gọn. Máy còn mới 90%, chạy êm. Pass lại do chuyển nhà.`,
    images: [
      'https://picsum.photos/seed/treadmill/400/300',
      'https://picsum.photos/seed/treadmill-2/400/300',
      'https://picsum.photos/seed/treadmill-3/400/300',
    ]
  },
  35: {
    authorId: 'u2',
    price: '300.000đ',
    address: 'KTX Khu A, ĐHQG',
    createdAt: '1 giờ trước',
    description: `Bộ ấm chén gốm Bát Tràng, men xanh cổ, hàng xịn. Được tặng không dùng đến. Mới 100% full box.`,
    images: [
      'https://picsum.photos/seed/tea/400/300',
      'https://picsum.photos/seed/tea-2/400/300',
    ]
  },
  36: {
    authorId: 'u3',
    price: '50.000đ',
    address: 'Linh Trung, TP. Thủ Đức',
    createdAt: '4 giờ trước',
    description: `Túi Tote vải canvas, mới 100%, màu kem. Vải dày dặn, đựng vừa laptop 14 inch.`,
    images: [
      'https://picsum.photos/seed/tote/400/300',
      'https://picsum.photos/seed/tote-2/400/300',
    ]
  },
  37: {
    authorId: 'u4',
    price: '220.000đ',
    address: 'Quận 9, TP. Thủ Đức',
    createdAt: '1 ngày trước',
    description: `Áo hoodie Unisex, Freesize, màu xám. Chất nỉ bông dày, còn mới 95%.`,
    images: [
      'https://picsum.photos/seed/hoodie/400/300',
      'https://picsum.photos/seed/hoodie-2/400/300',
    ]
  },
  38: {
    authorId: 'u5',
    price: '180.000đ',
    address: 'Gò Vấp, TP.HCM',
    createdAt: '6 giờ trước',
    description: `Bộ Lego mini, 500 mảnh ghép. Mới 100%, pass lại do mua trùng.`,
    images: [
      'https://picsum.photos/seed/lego/400/300',
      'https://picsum.photos/seed/lego-2/400/300',
      'https://picsum.photos/seed/lego-3/400/300',
    ]
  },
  39: {
    authorId: 'u6',
    price: '800.000đ',
    address: 'Bình Thạnh, TP.HCM',
    createdAt: '3 ngày trước',
    description: `Bàn phím cơ AKKO, Switch Brown, gõ sướng. Còn mới 98%, full box.`,
    images: [
      'https://picsum.photos/seed/keyboard/400/300',
      'https://picsum.photos/seed/keyboard-2/400/300',
    ]
  },
  40: {
    authorId: 'u7',
    price: '1.600.000đ',
    address: 'KTX Khu B, ĐHQG',
    createdAt: '1 ngày trước',
    description: `Ghế gaming E-Dra, êm, ngả 180 độ. Còn mới 95%, không trầy xước, da không bong.`,
    images: [
      'https://picsum.photos/seed/gamingchair/400/300',
      'https://picsum.photos/seed/gamingchair-2/400/300',
      'https://picsum.photos/seed/gamingchair-3/400/300',
    ]
  },
  41: {
    authorId: 'u8',
    price: '250.000đ',
    address: 'Quận 10, TP.HCM',
    createdAt: '5 giờ trước',
    description: `Tủ nhựa mini 3 tầng, nhỏ gọn, dễ vệ sinh. Dùng đựng quần áo, còn mới.`,
    images: [
      'https://picsum.photos/seed/plasticdrawer/400/300',
      'https://picsum.photos/seed/plasticdrawer-2/400/300',
    ]
  },
  42: {
    authorId: 'u9',
    price: '120.000đ',
    address: 'Thư viện Trung tâm, ĐHQG',
    createdAt: '2 ngày trước',
    description: `Sách IELTS Cambridge 17, không ghi chép, giấy đẹp. Sách photo nhưng chất lượng in nét.`,
    images: [
      'https://picsum.photos/seed/ielts/400/300',
      'https://picsum.photos/seed/ielts-2/400/300',
    ]
  },
  43: {
    authorId: 'u10',
    price: '40.000đ',
    address: 'KTX Khu A, ĐHQG',
    createdAt: '3 giờ trước',
    description: `Điều khiển máy lạnh đa năng. Dùng được nhiều hãng. Còn mới 100%, mua về nhưng máy lạnh có remote rồi.`,
    images: [
      'https://picsum.photos/seed/remote/400/300'
    ]
  },
  44: {
    authorId: 'u1',
    price: '9.500.000đ',
    address: 'Quận 9, TP. Thủ Đức',
    createdAt: '1 ngày trước',
    description: `Máy ảnh Canon M50, lens kit, quay đẹp. Full box, còn bảo hành 3 tháng. Tặng kèm thẻ nhớ 32GB.`,
    images: [
      'https://picsum.photos/seed/camera/400/300',
      'https://picsum.photos/seed/camera-2/400/300',
      'https://picsum.photos/seed/camera-3/400/300',
    ]
  },
  45: {
    authorId: 'u2',
    price: '300.000đ',
    address: 'Linh Trung, TP. Thủ Đức',
    createdAt: '7 giờ trước',
    description: `Xe scooter trẻ em, gập gọn, bánh phát sáng. Bé nhà mình chán nên pass lại.`,
    images: [
      'https://picsum.photos/seed/scooter/400/300',
      'https://picsum.photos/seed/scooter-2/400/300',
    ]
  },
  46: {
    authorId: 'u3',
    price: '180.000đ',
    address: 'KTX Khu B, ĐHQG',
    createdAt: '1 ngày trước',
    description: `Thảm yoga êm, dày 10mm, chống trượt. Mua về tập được 2 buổi. Mới 99%.`,
    images: [
      'https://picsum.photos/seed/yoga/400/300',
      'https://picsum.photos/seed/yoga-2/400/300',
    ]
  },
  47: {
    authorId: 'u4',
    price: '100.000đ',
    address: 'KTX Khu A, ĐHQG',
    createdAt: '2 giờ trước',
    description: `Quạt tích điện mini, 3 tốc độ, pin 4000mAh. Dùng tốt, mát.`,
    images: [
      'https://picsum.photos/seed/fan/400/300',
      'https://picsum.photos/seed/fan-2/400/300',
    ]
  },
  48: {
    authorId: 'u5',
    price: '70.000đ',
    address: 'Gò Vấp, TP.HCM',
    createdAt: '1 ngày trước',
    description: `Bình nước thể thao 1L, có vạch đo. Chất liệu nhựa an toàn, không BPA.`,
    images: [
      'https://picsum.photos/seed/sportbottle/400/300'
    ]
  },
  49: {
    authorId: 'u6',
    price: '120.000đ',
    address: 'Quận 9, TP. Thủ Đức',
    createdAt: '9 giờ trước',
    description: `Tranh anime treo tường, in canvas đẹp. Kích thước 40x60, pass lại do chuyển phòng.`,
    images: [
      'https://picsum.photos/seed/anime/400/300',
      'https://picsum.photos/seed/anime-2/400/300',
      'https://picsum.photos/seed/anime-3/400/300',
    ]
  },
  50: {
    authorId: 'u7',
    price: '700.000đ',
    address: 'Bình Thạnh, TP.HCM',
    createdAt: '3 ngày trước',
    description: `Balo laptop Samsonite, chống sốc, nhiều ngăn. Hàng chính hãng, mới 90%, dây kéo mượt.`,
    images: [
      'https://picsum.photos/seed/samsonite/400/300',
      'https://picsum.photos/seed/samsonite-2/400/300'
    ]
  },
  51: {
    authorId: 'u8',
    price: '1.800.000đ',
    address: 'Quận 10, TP.HCM',
    createdAt: '1 ngày trước',
    description: `Màn hình 24 inch LG, Full HD, tần số 75Hz. Còn mới 98%, không điểm chết.`,
    images: [
      'https://picsum.photos/seed/monitor/400/300',
      'https://picsum.photos/seed/monitor-2/400/300',
    ]
  },
  52: {
    authorId: 'u9',
    price: '250.000đ',
    address: 'Linh Trung, TP. Thủ Đức',
    createdAt: '2 ngày trước',
    description: `Quần jean nam, co giãn, size 31. Mặc 2-3 lần, còn mới, form slim fit.`,
    images: [
      'https://picsum.photos/seed/jeans/400/300',
      'https://picsum.photos/seed/jeans-2/400/300',
    ]
  },
  53: {
    authorId: 'u10',
    price: '30.000đ',
    address: 'KTX Khu A, ĐHQG',
    createdAt: '4 giờ trước',
    description: `Tập vở 200 trang (5 cuốn), giấy dày, dòng kẻ đứng. Mua dư không dùng tới.`,
    images: [
      'https://picsum.photos/seed/notebook/400/300'
    ]
  },
  54: {
    authorId: 'u1',
    price: '800.000đ',
    address: 'Quận 9, TP. Thủ Đức',
    createdAt: '1 ngày trước',
    description: `Ổ cứng di động 1TB, chuẩn USB 3.0. Hãng Seagate, còn mới, dùng tốt.`,
    images: [
      'https://picsum.photos/seed/hdd/400/300',
      'https://picsum.photos/seed/hdd-2/400/300',
    ]
  },
  55: {
    authorId: 'u2',
    price: '450.000đ',
    address: 'KTX Khu B, ĐHQG',
    createdAt: '10 giờ trước',
    description: `Máy pha cà phê mini, dùng pod hoặc bột. Pha nhanh, tiện lợi cho sinh viên.`,
    images: [
      'https://picsum.photos/seed/coffeemaker/400/300',
      'https://picsum.photos/seed/coffeemaker-2/400/300',
    ]
  },
  56: {
    authorId: 'u3',
    price: '90.000đ',
    address: 'Linh Trung, TP. Thủ Đức',
    createdAt: '1 ngày trước',
    description: `Đèn ngủ để bàn, ánh sáng vàng ấm. Thiết kế vintage, dùng decor phòng.`,
    images: [
      'https://picsum.photos/seed/nightlamp/400/300',
      'https://picsum.photos/seed/nightlamp-2/400/300',
    ]
  },
  57: {
    authorId: 'u4',
    price: '1.200.000đ',
    address: 'Quận 9, TP. Thủ Đức',
    createdAt: '3 ngày trước',
    description: `Loa soundbar Samsung, âm thanh sống động. Nghe nhạc xem phim đều hay.`,
    images: [
      'https://picsum.photos/seed/soundbar/400/300',
      'https://picsum.photos/seed/soundbar-2/400/300',
    ]
  },
  58: {
    authorId: 'u5',
    price: '230.000đ',
    address: 'Gò Vấp, TP.HCM',
    createdAt: '1 ngày trước',
    description: `Chuột vertical ergonomic, giảm đau cổ tay. Dùng cho ai làm việc máy tính nhiều. Mới 99%.`,
    images: [
      'https://picsum.photos/seed/verticalmouse/400/300',
      'https://picsum.photos/seed/verticalmouse-2/400/300',
    ]
  },
  59: {
    authorId: 'u6',
    price: '350.000đ',
    address: 'KTX Khu A, ĐHQG',
    createdAt: '2 ngày trước',
    description: `Bộ chăn ga gối cotton, mềm mịn, size queen. Màu xám, mới 90%.`,
    images: [
      'https://picsum.photos/seed/bedset/400/300',
      'https://picsum.photos/seed/bedset-2/400/300',
      'https://picsum.photos/seed/bedset-3/400/300',
    ]
  },
  60: {
    authorId: 'u7',
    price: '180.000đ',
    address: 'Bình Thạnh, TP.HCM',
    createdAt: '3 giờ trước',
    description: `Nón lưỡi trai Nike, chính hãng, màu đen. Mua tại store, đội 2 lần còn mới 99%.`,
    images: [
      'https://picsum.photos/seed/hat/400/300',
      'https://picsum.photos/seed/hat-2/400/300',
    ]
  },
};
  

// --- 3. Xuất mockPostDetails (Đã map dữ liệu chi tiết) ---
export const mockPostDetails = mockPosts.map((post) => {
  // Lấy dữ liệu chi tiết và tác giả tương ứng
  const detail = detailedData[post.id];
  
  if (!detail) {
    console.warn(`Không tìm thấy chi tiết cho post ID: ${post.id}`);
    return {
      ...post,
      author: 'Người dùng ẩn',
      authorId: 'unknown',
      authorAvatar: 'https://i.pravatar.cc/150?img=0',
      authorPhone: 'N/A',
      price: 'N/A',
      address: 'N/A',
      createdAt: 'N/A',
      description: post.content,
      images: [post.image],
      comments: 0,
      likedBy: [],
      savedBy: [],
    };
  }

  const author = mockUsers.find(u => u.id === detail.authorId);
  const commentsList = commentsData[post.id] || [];
  const finalAuthor = author || mockUsers[0]; 

  return {
    ...post,
    author: finalAuthor.name,
    authorId: finalAuthor.id,
    authorAvatar: finalAuthor.avatar,
    authorPhone: finalAuthor.phone,
    price: detail.price,
    address: detail.address, 
    createdAt: detail.createdAt,
    description: detail.description, 
    images: detail.images, // ✅ Dùng mảng ảnh chi tiết (đã có nhiều ảnh)
    comments: commentsList.length, 
    likedBy: [], 
    savedBy: [], 
  };
});


// --- 4. Xuất mockCommentsByPostId (Giữ nguyên từ file gốc) ---
mockPosts.forEach((p) => {
  const id = String(p.id);
  if (!commentsData[id]) commentsData[id] = [];
});

export const mockCommentsByPostId = commentsData;