import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

// --- 1. Sheet Root Component (Khung chính) ---
function Sheet({ ...props }) {
  // Loại bỏ type annotation
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

// --- 2. Sheet Trigger Component (Nút mở Sheet) ---
function SheetTrigger({ ...props }) {
  // Loại bỏ type annotation
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

// --- 3. Sheet Close Component (Nút đóng Sheet) ---
function SheetClose({ ...props }) {
  // Loại bỏ type annotation
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

// --- 4. Sheet Portal Component (Mekanisme hiển thị ngoài DOM chính) ---
function SheetPortal({ ...props }) {
  // Loại bỏ type annotation
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

// --- 5. Sheet Overlay Component (Lớp phủ mờ nền) ---
function SheetOverlay({ className, ...props }) {
  // Loại bỏ type annotation
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // Styles: Fade in/out, cố định, Z-index 50, nền đen mờ
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

// --- 6. Sheet Content Component (Phần nội dung chính của Panel) ---
// Note: 'side' được coi là prop JS thông thường
function SheetContent({ className, children, side = "right", ...props }) {
  const sideClasses = {
    right:
      "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    left: "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    top: "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
    bottom:
      "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          // Base styles: Vị trí cố định, Z-index cao, hiệu ứng chuyển đổi chung
          "bg-white data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          sideClasses[side], // Áp dụng classes vị trí
          className
        )}
        {...props}
      >
        <VisuallyHidden.Root>
          <SheetPrimitive.Title>Menu</SheetPrimitive.Title>
        </VisuallyHidden.Root>
        {children}
        {/* Nút Đóng Mặc định (Vị trí góc phải trên) */}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

// --- 7. Sheet Header Component ---
function SheetHeader({ className, ...props }) {
  // Loại bỏ type annotation
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

// --- 8. Sheet Footer Component ---
function SheetFooter({ className, ...props }) {
  // Loại bỏ type annotation
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

// --- 9. Sheet Title Component ---
function SheetTitle({ ...props }) {
  // Loại bỏ type annotation
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", props.className)}
      {...props}
    />
  );
}

// --- 10. Sheet Description Component ---
function SheetDescription({ ...props }) {
  // Loại bỏ type annotation
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", props.className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
