import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // 1. Kiểm tra input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
        }

        // 2. Tìm user
        const user = await User.findOne({ email }).select('+password');

        // 3. Kiểm tra User tồn tại và Mật khẩu khớp
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }

        // 4. Tạo JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        // 5. Trả về kết quả
        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
}

export async function register(req, res) {
    try {
        const { name, email, password, username, phone } = req.body;

        // 1. Kiểm tra xem Email hoặc Username đã tồn tại chưa
        const userExists = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email hoặc Username đã được sử dụng' 
            });
        }

        // 2. Tạo User mới
        const user = await User.create({
            name,
            email,
            username,
            password,
            phone,
            role: 'user', // Mặc định là user thường
            isActive: true,
            isEmailVerified: true // Set luôn là true để không cần xác thực
        });

        // 3. Tạo Token ngay lập tức
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '30d' }
        );

        // 4. Trả về kết quả
        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                username: user.username
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
}
export function verifyEmail(req, res)
{
    
}