// src/data/mockUsers.js
export const mockUsers = [
    {
      id: 'u1',
      name: 'Hoài An',
      email: 'hoaian.dev@gmail.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=68' // cô gái tóc ngắn dễ thương
    },
    {
      id: 'u2',
      name: 'Nguyễn Văn B',
      email: 'student@edu.vn',
      password: '123456',
      avatar: 'https://i.pravatar.cc/150?img=12' // chàng trai cười
    },
    {
      id: 'u3',
      name: 'Trần Thị C',
      email: 'tranthi.c@gmail.com',
      password: 'abc',
      avatar: 'https://i.pravatar.cc/150?img=47' // nữ sinh đeo kính
    },
    {
      id: 'u4',
      name: 'Lê Minh Dũng',
      email: 'dungle@gmail.com',
      password: 'dung2002',
      avatar: 'https://i.pravatar.cc/150?img=25' // nam sinh năng động
    },
    {
      id: 'u5',
      name: 'Phạm Thảo Nhi',
      email: 'thaonhi@gmail.com',
      password: 'nhi123',
      avatar: 'https://i.pravatar.cc/150?img=56' // cô gái tóc dài
    },
    {
      id: 'u6',
      name: 'Vũ Quang Huy',
      email: 'huyvu@edu.vn',
      password: 'huy321',
      avatar: 'https://i.pravatar.cc/150?img=30' // nam sinh áo xanh
    },
    {
      id: 'u7',
      name: 'Đặng Ngọc Mai',
      email: 'ngocmai@edu.vn',
      password: 'mai2003',
      avatar: 'https://i.pravatar.cc/150?img=65' // cô gái cười xinh
    },
    {
      id: 'u8',
      name: 'Trương Gia Bảo',
      email: 'giabao@edu.vn',
      password: 'bao123',
      avatar: 'https://i.pravatar.cc/150?img=10' // nam sinh thân thiện
    },
    {
      id: 'u9',
      name: 'Nguyễn Phương Linh',
      email: 'linhnguyen@edu.vn',
      password: 'linhlinh',
      avatar: 'https://i.pravatar.cc/150?img=71' // nữ dễ thương
    },
    {
      id: 'u10',
      name: 'Huỳnh Tấn Khoa',
      email: 'khoahuynh@edu.vn',
      password: 'khoa2002',
      avatar: 'https://i.pravatar.cc/150?img=36' // chàng trai hiền lành
    }
  ];
  
  
  // (Tùy chọn) Bạn có thể thêm một hàm kiểm tra logic đăng nhập tại đây
  export function checkLogin(email, password) {
    // Tìm người dùng có email khớp
    const user = mockUsers.find(u => u.email === email);
    
    // Nếu tìm thấy, kiểm tra mật khẩu
    if (user && user.password === password) {
      // Đăng nhập thành công, trả về dữ liệu người dùng (trừ mật khẩu)
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    // Đăng nhập thất bại
    return null;
  }