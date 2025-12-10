import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuth = async (req, res, next) => {
  let token;

  // 1. Kiểm tra header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token từ chuỗi "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // 2. GIẢI MÃ TOKEN
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // 3. Tìm user từ ID trong token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Token hợp lệ nhưng User không tồn tại' });
      }

      // 4. Cho phép đi tiếp
      next(); 
      
    } catch (error) {
      console.error(error);
      // Dùng return để dừng hàm ngay lập tức
      return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  } else {
    // Trường hợp không có token trong header
    return res.status(401).json({ success: false, message: 'Không có Token, vui lòng đăng nhập' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Truy cập bị từ chối! Bạn không phải Admin' });
  }
};