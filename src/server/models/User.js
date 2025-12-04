import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: {
    type: String,
    required: [true, 'Vui lòng nhập username'],
    unique: true, 
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Không trả về password khi query bình thường (Security)
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
    enum: ['user', 'admin'],
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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);