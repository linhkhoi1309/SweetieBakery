"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar"; // Đã loại bỏ version number (@1.1.3)

import { cn } from "./utils"; // Hàm tiện ích hợp nhất class

/**
 * Avatar Root Component (Khung sườn)
 * Component chính quản lý kích thước và hình dạng (size-10, rounded-full)
 */
function Avatar({ className, ...props }) {
  // Loại bỏ annotation TypeScript: : React.ComponentProps<typeof AvatarPrimitive.Root>
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        // Base classes: 10x10, co giãn, hình tròn, ẩn overflow
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

/**
 * Avatar Image Component
 * Component hiển thị hình ảnh thực tế
 */
function AvatarImage({ className, ...props }) {
  // Loại bỏ annotation TypeScript
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

/**
 * Avatar Fallback Component
 * Component hiển thị khi hình ảnh không tải được (thường là chữ cái đầu tên)
 */
function AvatarFallback({ className, ...props }) {
  // Loại bỏ annotation TypeScript
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        // Base classes: màu nền, căn giữa, chiếm trọn kích thước
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

// Export các thành phần để sử dụng bên ngoài
export { Avatar, AvatarImage, AvatarFallback };
