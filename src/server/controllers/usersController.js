import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// GET /users/profile (Private: User)
export async function getUserProfile(req, res) {
  try {
    // req.user đã được middleware isAuth gán kèm -password
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Tài khoản đã bị khóa" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get profile error:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
}

// PUT /users/profile (Private: User)
export async function updateUserProfile(req, res) {
  try {
    const allowedFields = ["name", "phone", "address", "avatar", "age"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Không có dữ liệu để cập nhật" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
}

// PUT /users/change-password (Private: User)
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Kiểm tra đầu vào
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      });
    }

    // 2. Tìm người dùng (lấy cả trường password để so sánh)
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // 3. Kiểm tra mật khẩu hiện tại có khớp không
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Mật khẩu hiện tại không chính xác" });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Change password error:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
}

// GET /users (Private: Admin) - có phân trang
export async function getAllUsers(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
}

// POST /users/deactivate/:id (Private: Admin) - vô hiệu hóa tài khoản
export async function deactivateUserAccount(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "UserId không hợp lệ" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }
    user.isActive = false;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Đã vô hiệu hóa tài khoản", user });
  } catch (error) {
    console.error("Deactivate user error:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
}

// DELETE /users/:id (Private: Admin) - xóa hẳn tài khoản
export async function deleteUserById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "UserId không hợp lệ" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    await user.deleteOne();

    res.status(200).json({ success: true, message: "Đã xóa tài khoản", user });
  } catch (error) {
    console.error("Delete user error:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
}
