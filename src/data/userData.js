// src/data/userData.js
// NGUỒN DỮ LIỆU CHÍNH: Hợp nhất từ datalogin.js và mockAuthor.js

export const mockUsers = [
    {
      // --- Thông tin Đăng nhập (từ datalogin.js) ---
      id: 'u1',
      name: 'Hoài An',
      email: 'hoaian@edu.vn',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=68',
      // --- Thông tin Profile (từ mockAuthor.js) ---
      phone: '0912345678',
      bio: "Sinh viên năm 3 - Đại học Bách Khoa Hà Nội",
      location: "Hai Bà Trưng, Hà Nội",
      joinedDate: "3 tháng trước",
      responseTime: { rate: 75, label: "Thỉnh thoảng" }, // Sửa đổi cho nhất quán
      followers: 226,
      following: 0,
      rating: 5.0,
      totalReviews: 1,
      verified: true,
      verifiedPlatforms: ["facebook", "email", "apple"],
    },
    {
      // --- Đăng nhập ---
      id: 'u2',
      name: 'Nguyễn Văn B',
      email: 'student@edu.vn',
      password: '123456',
      avatar: 'https://i.pravatar.cc/150?img=12',
      // --- Profile ---
      phone: '0987654321',
      bio: "Yêu thích đọc sách và chia sẻ kiến thức",
      location: "Đống Đa, Hà Nội",
      joinedDate: "6 tháng trước",
      responseTime: { rate: 95, label: "Phản hồi nhanh" },
      followers: 234,
      following: 112,
      rating: 4.9,
      totalReviews: 45,
      verified: true,
      verifiedPlatforms: ["facebook", "email"],
    },
    {
      // --- Đăng nhập ---
      id: 'u3',
      name: 'Trần Thị C',
      email: 'tranthi@edu.vn',
      password: 'abc',
      avatar: 'https://i.pravatar.cc/150?img=47',
      // --- Profile ---
      phone: '0905123456',
      bio: "Chuyên bán đồ công nghệ, laptop",
      location: "Quận 9, TP. Thủ Đức",
      joinedDate: "1 năm trước",
      responseTime: { rate: 99, label: "Trong vài phút" },
      followers: 512,
      following: 25,
      rating: 4.8,
      totalReviews: 32,
      verified: true,
      verifiedPlatforms: ["email"],
    },
    {
      // --- Đăng nhập ---
      id: 'u4',
      name: 'Lê Minh Dũng',
      email: 'dungle@edu.vn',
      password: 'dung2002',
      avatar: 'https://i.pravatar.cc/150?img=25',
      // --- Profile ---
      phone: '0935654789',
      bio: "Mình pass đồ không dùng nữa, giá rẻ",
      location: "Linh Trung, TP. Thủ Đức",
      joinedDate: "2 tháng trước",
      responseTime: { rate: 90, label: "Phản hồi nhanh" },
      followers: 78,
      following: 5,
      rating: 4.7,
      totalReviews: 10,
      verified: false,
      verifiedPlatforms: ["facebook"],
    },
    {
      // --- Đăng nhập ---
      id: 'u5',
      name: 'Phạm Thảo Nhi',
      email: 'thaonhi@edu.vn',
      password: 'nhi123',
      avatar: 'https://i.pravatar.cc/150?img=56',
      // --- Profile ---
      phone: '0978123987',
      bio: "Săn sale và pass lại",
      location: "Gò Vấp, TP.HCM",
      joinedDate: "8 tháng trước",
      responseTime: { rate: 70, label: "Phản hồi chậm" },
      followers: 102,
      following: 30,
      rating: 4.9,
      totalReviews: 22,
      verified: true,
      verifiedPlatforms: ["email"],
    },
    {
      // --- Đăng nhập ---
      id: 'u6',
      name: 'Vũ Quang Huy',
      email: 'huyvu@edu.vn',
      password: 'huy321',
      avatar: 'https://i.pravatar.cc/150?img=30',
      // --- Profile ---
      phone: '0909456123',
      bio: "Pass đồ cho gọn nhà",
      location: "Quận 9, TP. Thủ Đức",
      joinedDate: "4 tháng trước",
      responseTime: { rate: 92, label: "Phản hồi nhanh" },
      followers: 45,
      following: 3,
      rating: 5.0,
      totalReviews: 8,
      verified: true,
      verifiedPlatforms: ["facebook", "email"],
    },
    {
      // --- Đăng nhập ---
      id: 'u7',
      name: 'Đặng Ngọc Mai',
      email: 'ngocmai@edu.vn',
      password: 'mai2003',
      avatar: 'https://i.pravatar.cc/150?img=65',
      // --- Profile ---
      phone: '0966789456',
      bio: "Chuyên đồ điện tử 2nd",
      location: "Bình Thạnh, TP.HCM",
      joinedDate: "1 tháng trước",
      responseTime: { rate: 99, label: "Trong vài phút" },
      followers: 88,
      following: 12,
      rating: 4.6,
      totalReviews: 15,
      verified: true,
      verifiedPlatforms: ["email"],
    },
    {
      // --- Đăng nhập ---
      id: 'u8',
      name: 'Trương Gia Bảo',
      email: 'giabao@edu.vn',
      password: 'bao123',
      avatar: 'https://i.pravatar.cc/150?img=10',
      // --- Profile ---
      phone: '0922334455',
      bio: "Thanh lý đồ dùng gia đình",
      location: "Quận 10, TP.HCM",
      joinedDate: "10 tháng trước",
      responseTime: { rate: 90, label: "Phản hồi nhanh" },
      followers: 130,
      following: 10,
      rating: 4.8,
      totalReviews: 19,
      verified: true,
      verifiedPlatforms: ["facebook"],
    },
    {
      // --- Đăng nhập ---
      id: 'u9',
      name: 'Nguyễn Phương Linh',
      email: 'linhnguyen@edu.vn',
      password: 'linhlinh',
      avatar: 'https://i.pravatar.cc/150?img=71',
      // --- Profile ---
      phone: '0955667788',
      bio: "Đồ nội thất, decor phòng",
      location: "Linh Trung, TP. Thủ Đức",
      joinedDate: "5 tháng trước",
      responseTime: { rate: 70, label: "Phản hồi chậm" },
      followers: 66,
      following: 8,
      rating: 4.7,
      totalReviews: 7,
      verified: false,
      verifiedPlatforms: [],
    },
    {
      // --- Đăng nhập ---
      id: 'u10',
      name: 'Huỳnh Tấn Khoa',
      email: 'khoahuynh@edu.vn',
      password: 'khoa2002',
      avatar: 'https://i.pravatar.cc/150?img=36',
      // --- Profile ---
      phone: '0988990011',
      bio: "Sinh viên ĐHQG, pass lại đồ dùng học tập",
      location: "KTX Khu B, ĐHQG",
      joinedDate: "11 tháng trước",
      responseTime: { rate: 90, label: "Phản hồi nhanh" },
      followers: 95,
      following: 22,
      rating: 5.0,
      totalReviews: 20,
      verified: true,
      verifiedPlatforms: ["email"],
    },
    {
      // --- Tài khoản Admin ---
      id: 'admin1',
      name: 'Admin',
      email: 'admin@chosinhvien.com',
      password: 'admin123',
      avatar: 'https://i.pravatar.cc/150?img=1',
      // --- Profile ---
      phone: '0123456789',
      bio: "Quản trị viên hệ thống",
      location: "Hà Nội",
      joinedDate: "1 năm trước",
      responseTime: { rate: 100, label: "Luôn phản hồi" },
      followers: 0,
      following: 0,
      rating: 5.0,
      totalReviews: 0,
      verified: true,
      verifiedPlatforms: ["email"],
      role: 'admin', // Đánh dấu đây là tài khoản admin
    },
  ];
  // Lưu/đọc users vào localStorage để hỗ trợ persist khi đăng ký
  const STORAGE_KEY_USERS = 'sv_users_v1';

  function loadUsersFromStorage() {
    if (typeof window === 'undefined') return mockUsers;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_USERS);
      if (!raw) return mockUsers;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length ? parsed : mockUsers;
    } catch (e) {
      console.error('Failed to load users from localStorage', e);
      return mockUsers;
    }
  }

  function saveUsersToStorage(users) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  }

  export function getUsers() {
    return loadUsersFromStorage();
  }

  // Kiểm tra đăng nhập: trả về user (không có password) nếu khớp
  export function checkLogin(email, password) {
    const users = loadUsersFromStorage();
    const user = users.find(u => u.email === email);
    if (user && user.password === password) {
      const { password: _pwd, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  // Kiểm tra email sinh viên: mặc định yêu cầu đuôi '.edu.vn'
  export function isStudentEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1].toLowerCase();
    return domain.endsWith('.edu.vn');
  }

  // Thêm user mới và lưu vào localStorage (trả về user không có password)
  export function addUser({ name, email, password, avatar = null, role = 'user', phone = '', location = '', bio = '' } = {}) {
    if (!email || !password || !name) {
      throw new Error('Name, email và password là bắt buộc');
    }

    if (!isStudentEmail(email)) {
      throw new Error('Email phải là email sinh viên (đuôi .edu.vn)');
    }

    const users = loadUsersFromStorage();
    const exists = users.find(u => u.email === email);
    if (exists) {
      throw new Error('Email này đã được đăng ký');
    }

    const id = 'u' + Date.now();
    const nowIso = new Date().toISOString();
    const newUser = {
      id,
      name,
      email,
      password,
      avatar: avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      phone: phone || '',
      bio: bio || '',
      location: location || '',
      // Lưu timestamp khi join để có thể hiển thị 'x phút trước' chính xác
      joinedAt: nowIso,
      responseTime: { rate: 0, label: 'Mới tham gia' },
      followers: 0,
      following: 0,
      rating: 5.0,
      totalReviews: 0,
      verified: false,
      verifiedPlatforms: [],
      role,
    };

    const newList = [newUser, ...users];
    saveUsersToStorage(newList);

    const { password: _pwd, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Cập nhật user (theo id) với các trường mới, trả về user không có password
  export function updateUser(userId, updates = {}) {
    if (!userId) throw new Error('userId là bắt buộc');
    const users = loadUsersFromStorage();
    const idx = users.findIndex((u) => String(u.id) === String(userId));
    if (idx === -1) throw new Error('Người dùng không tồn tại');

    const merged = { ...users[idx], ...updates };
    users[idx] = merged;
    saveUsersToStorage(users);

    const { password: _pwd, ...userWithoutPassword } = merged;
    return userWithoutPassword;
  }