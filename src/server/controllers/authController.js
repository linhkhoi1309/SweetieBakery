import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập email và mật khẩu" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    // --- THÊM: Kiểm tra đã xác thực email chưa ---
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng xác thực email trước khi đăng nhập.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin để biết thêm chi tiết.",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "30d" }
    );

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
}

export async function register(req, res) {
  try {
    const { name, email, password, username, phone } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc Username đã được sử dụng",
      });
    }

    // 1. Tạo token xác thực (ngẫu nhiên 32 bytes chuyển sang hex)
    //const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 2. Tạo User mới (isEmailVerified = false)
    const user = await User.create({
      name,
      email,
      username,
      password,
      phone,
      role: "user",
      isEmailVerified: false,
      emailVerificationToken: verificationCode,
      // Token hết hạn sau 24 giờ
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    const message = `
            <div style="font-family: sans-serif; text-align: center;">
                <h1>Xác thực tài khoản Sweetie Bakery</h1>
                <p>Cảm ơn bạn đã đăng ký. Mã xác thực của bạn là:</p>
                <h2 style="color: #F88379; font-size: 32px; letter-spacing: 5px;">${verificationCode}</h2>
                <p>Mã này sẽ hết hạn sau 24 giờ.</p>
            </div>
        `;

    // 4. Gửi email
    try {
      await sendEmail({
        email: user.email,
        subject: "Sweetie Bakery - Xác thực tài khoản",
        message: message,
      });

      // 5. Trả về kết quả
      res.status(201).json({
        success: true,
        message:
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
      });
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: "Không thể gửi email xác thực. Vui lòng thử lại.",
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
}

// Endpoint: POST /auth/verify-email
export async function verifyEmail(req, res) {
  try {
    const { token } = req.body; // Token gửi từ Frontend

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu mã xác thực." });
    }

    // 1. Tìm user có token này và chưa hết hạn
    // Normalize token: trim whitespace và convert sang string
    const normalizedToken = String(token).trim();

    const user = await User.findOne({
      emailVerificationToken: normalizedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Mã xác thực không hợp lệ hoặc đã hết hạn.",
      });
    }

    // 2. Kích hoạt tài khoản
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined; // Xóa token
    user.emailVerificationExpires = undefined;
    await user.save();

    // 3. Tự động đăng nhập luôn sau khi verify
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "30d" }
    );

    res.status(200).json({
      success: true,
      message: "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.",
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Verify error:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
}

export async function getMe(req, res) {
  try {
    // Middleware xác thực (authMiddleware) sẽ giải mã token
    // và gán thông tin user vào req.user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Tài khoản đã bị vô hiệu hóa" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
}
