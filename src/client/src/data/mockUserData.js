// Dữ liệu người dùng mẫu (Database giả)
export const MOCK_USERS = [
  {
    _id: "user_01",
    email: "test@gmail.com",
    password: "123", // Trong thực tế password phải hash, nhưng mock thì để plain text cho dễ test
    name: "Người dùng Test",
    role: "user",
    avatar: "https://i.pravatar.cc/150?u=test",
    isVerified: true,
  },
  {
    _id: "admin_01",
    email: "admin@gmail.com",
    password: "123",
    name: "Admin Vip",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?u=admin",
    isVerified: true,
  },
];

// Token giả định sẽ trả về
export const MOCK_TOKEN = "mock_jwt_token_123456789";
