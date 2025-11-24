<div align="center">
  <h1>SweetieBakery E-commerce System</h1>
  <small>
    <strong>Developed by:</strong> L2N2 Tech
  </small> <br />
  <sub>November 25, 2025</sub>
</div>

## 🧁 Project Overview

**SweetieBakery** là một hệ thống thương mại điện tử chuyên biệt được xây dựng để cung cấp trải nghiệm mua sắm trực tuyến mượt mà và trực quan cho các sản phẩm bánh ngọt và đồ tráng miệng. Hệ thống được phát triển dựa trên **MERN Stack** (MongoDB, Express.js, React.js, Node.js), đảm bảo tính hiện đại, tốc độ và khả năng mở rộng linh hoạt.

Dự án bao gồm hai phân hệ chính: **Client Web App** phục vụ nhu cầu mua sắm của khách hàng và **Admin Dashboard** giúp quản trị viên quản lý toàn diện hệ thống, từ sản phẩm, đơn hàng đến người dùng.

## 🚀 Key Features

Dự án được xây dựng để đáp ứng các yêu cầu nghiệp vụ cốt lõi sau:

### 🍰 Dành cho Khách hàng (User)

- **Duyệt & Tìm kiếm Thông minh:** Tìm kiếm sản phẩm theo từ khóa, lọc theo danh mục và sắp xếp giá cả. (FR-U.1)
- **Quản lý Giỏ hàng Real-time:** Thêm, sửa, xóa sản phẩm trong giỏ hàng tức thì mà không cần tải lại trang. (FR-U.2)
- **Quy trình Đặt hàng (Checkout):** Xác nhận đơn hàng, áp dụng mã giảm giá và nhập thông tin giao hàng. (FR-U.3)
- **Theo dõi Đơn hàng:** Xem lịch sử mua hàng và theo dõi trạng thái xử lý của đơn hàng. (FR-U.4)
- **Đánh giá & Phản hồi:** Gửi đánh giá sao và bình luận cho các sản phẩm đã mua. (FR-U.5)

### ⚙️ Dành cho Quản trị viên (Admin)

- **Quản lý Sản phẩm (CRUD):** Thêm mới, cập nhật thông tin, hình ảnh và quản lý kho hàng. (FR-A.1)
- **Quản lý Đơn hàng:** Tiếp nhận đơn mới, cập nhật trạng thái (Processing → Completed) và xử lý hủy đơn. (FR-A.2)
- **Dashboard Thống kê:** Xem báo cáo doanh thu, KPI và biểu đồ tăng trưởng trực quan. (FR-A.6)
- **Quản lý Người dùng & Phân quyền:** Kiểm soát tài khoản người dùng và phân quyền truy cập hệ thống. (FR-A.3, FR-S.3)

## 🧩 Tech Stack

- **Programming Language:** JavaScript (ES6+)
- **Frontend:** React.js, React Router, Tailwind CSS (hoặc CSS Modules)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (sử dụng Mongoose ODM)
- **Architecture:** Client-Server (RESTful API)
- **Authentication:** JWT (JSON Web Tokens)

## 🏗️ System Architecture & Folder Structure

Dự án được tổ chức theo kiến trúc **Monorepo** (hoặc tách biệt tùy setup) với hai thư mục chính nằm trong `src`: `client` (Frontend) và `server` (Backend).

### 📂 Cấu trúc Tổng quan

```text
SweetieBakery/
├── docs/               # Tài liệu dự án (SRS, Design, Test Plans)
├── pa/                 # Phân tích & Thiết kế (UML Diagrams, Wireframes)
├── src/                # Mã nguồn chính
│   ├── client/         # React Application
│   └── server/         # Node.js Application
└── package.json        # Root scripts (nếu có)
src/client/
├── public/
├── src/
│   ├── assets/         # Tài nguyên tĩnh (Images, Logos, Icons)
│   ├── components/     # UI Components tái sử dụng
│   │   ├── auth/       # Login/Register Forms
│   │   ├── common/     # Header, Footer, Buttons
│   │   └── admin/      # Sidebar, Charts
│   ├── context/        # Global State (AuthContext, CartContext)
│   ├── layouts/        # Layout Wrappers (AuthLayout, MainLayout, AdminLayout)
│   ├── pages/          # Các trang màn hình chính
│   │   ├── auth/       # Login, Register, VerifyEmail
│   │   ├── public/     # Home, ProductList, Cart
│   │   └── admin/      # Dashboard, ProductManage
│   ├── services/       # API Calls (Axios instance)
│   ├── App.jsx         # Routing Configuration
│   └── index.js        # Entry Point
└── package.json
src/server/
├── config/             # Cấu hình hệ thống (DB Connect, Multer)
├── controllers/        # Logic xử lý Request/Response
│   ├── authController.js
│   ├── productController.js
│   └── orderController.js
├── models/             # Mongoose Schemas (Database Structure)
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/             # Định nghĩa API Endpoints
│   ├── authRoutes.js
│   └── apiRoutes.js
├── middlewares/        # Authentication & Error Handling
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── utils/              # Helper Functions (SendEmail, HashPassword)
├── .env                # Biến môi trường (Sensitive Data)
└── server.js           # Server Entry Point
```

## 🎯 Project Goals

- **Xây dựng Hệ thống E-commerce Toàn diện:** Phát triển một nền tảng thương mại điện tử hoàn chỉnh từ Frontend đến Backend sử dụng 100% JavaScript (MERN Stack).
- **Đảm bảo An toàn & Bảo mật:** Triển khai các biện pháp bảo mật thiết yếu như mã hóa mật khẩu (Hashing), xác thực qua JWT (JSON Web Tokens) và bảo vệ các API quan trọng.
- **Tối ưu hóa Trải nghiệm Người dùng (UX):** Thiết kế giao diện hiện đại, thân thiện, tương thích trên nhiều thiết bị và đảm bảo tốc độ tải trang nhanh.
- **Quản lý Dữ liệu Hiệu quả:** Thiết kế cơ sở dữ liệu NoSQL (MongoDB) tối ưu cho việc truy xuất, lưu trữ sản phẩm và đơn hàng với quy mô lớn.
- **Khả năng Mở rộng (Scalability):** Xây dựng kiến trúc module hóa, dễ dàng bảo trì và mở rộng thêm tính năng (như tích hợp thanh toán online) trong tương lai.

## ⚙️ Setup & Installation

Làm theo các bước hướng dẫn chi tiết dưới đây để cài đặt và khởi chạy dự án **SweetieBakery** trên máy tính cá nhân của bạn.

### 🧱 Prerequisites

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã được cài đặt các công cụ sau:

- **Node.js** (Phiên bản LTS 18+ được khuyến nghị)
- **npm** (trình quản lý gói đi kèm Node.js) hoặc **yarn**
- **MongoDB** (Bạn có thể cài đặt MongoDB Community Server chạy local hoặc tạo tài khoản MongoDB Atlas miễn phí)
- **Git** (Để clone dự án)
- **Trình soạn thảo code** (VS Code, WebStorm,...)

## 🗄️ Environment Configuration (Cập nhật sau)

## 🏗️ Project Setup

Cấu trúc dự án được chia làm 2 phần: server (Backend) và client (Frontend). Bạn cần cài đặt và chạy chúng trên 2 cửa sổ Terminal riêng biệt.

**1. Clone the repository:**

```bash
git clone https://github.com/linhkhoi1309/SweetieBakery.git
cd SweetieBakery
```

**2. Install Dependencies (Cài đặt thư viện):**

```bash
cd src
npm run build
```

**3. Run the Application (Khởi chạy):**

Terminal 1: Khởi chạy Server (Backend)

```bash
cd src/server
npm run start
```

Terminal 2: Khởi chạy Client (Frontend)

```bash
cd src/client
npm run dev
```
