import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Vui lòng nhập username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username phải có ít nhất 3 ký tự'],
    maxlength: [20, 'Username không được quá 20 ký tự'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username chỉ được chứa chữ cái, số và dấu gạch dưới'],
  },
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên người dùng'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Email không hợp lệ',
    ],
  },
  age: {
    type: Number,
    min: [0, 'Tuổi không được nhỏ hơn 0'],
    max: [120, 'Tuổi không được lớn hơn 120'],
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['guest', 'user', 'admin'],
    default: 'user',
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/default-avatar.png',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // --- PASSWORD RESET FIELDS ---
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // --- EMAIL VERIFICATION FIELDS ---
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,

}, { timestamps: true });

// --- Middleware & Methods ---

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. Phương thức kiểm tra mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;