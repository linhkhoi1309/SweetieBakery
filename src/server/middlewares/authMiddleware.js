import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuth = async (req, res, next) => {
  let token;

  // Kiểm tra token trong header
  if (
    req.headers.authorization && req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'somethingsecret');

      //Tìm user trong DB
      req.user = await User.findById(decoded.id || decoded._id).select('-password');

      if (!req.user) {
        return res.status(401).send({ message: 'Token hợp lệ nhưng User không tồn tại' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).send({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  }

  if (!token) {
    res.status(401).send({ message: 'Không có Token, vui lòng đăng nhập' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send({ message: 'Token không hợp lệ cho Admin' });
  }
};