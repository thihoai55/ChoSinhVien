// Re-export tiện lợi các hàm quản lý người dùng từ `userData.js`
import { getUsers, checkLogin, addUser, isStudentEmail } from './userData';

export { getUsers, checkLogin, addUser, isStudentEmail };

// Lưu một biến mockUsers để tương thích với code cũ nếu cần
export const mockUsers = typeof window === 'undefined' ? [] : getUsers();