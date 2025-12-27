import * as React from "react";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";
import { cn } from "./utils";

// Quản lý trạng thái mở/đóng thông qua Props
const Dialog = ({ open, onOpenChange, children }) => {
  // Khóa cuộn trang khi Dialog mở
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop/Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity animate-in fade-in duration-300"
        onClick={() => onOpenChange(false)}
      />
      {/* Container của Content */}
      <div className="z-50 w-full max-w-2xl transform transition-all animate-in zoom-in-95 fade-in duration-200">
        {children}
      </div>
    </div>,
    document.body
  );
};

const DialogContent = ({ className, children, onOpenChange, ...props }) => (
  <div
    className={cn(
      "relative bg-white rounded-[2.5rem] p-8 shadow-2xl border border-pink-50 max-h-[90vh] overflow-y-auto custom-scrollbar",
      className
    )}
    {...props}
  >
    {children}
    {/* Nút đóng góc phải */}
    <button
      onClick={() => onOpenChange(false)}
      className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:bg-pink-50 hover:text-[#F7B5D5] transition-all"
    >
      <XIcon className="size-5" />
    </button>
  </div>
);

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col gap-2 text-left mb-6", className)}
    {...props}
  />
);

const DialogTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "text-3xl font-black text-gray-800 tracking-tight",
      className
    )}
    {...props}
  />
);

const DialogDescription = ({ className, ...props }) => (
  <p
    className={cn("text-gray-500 text-sm font-medium", className)}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8",
      className
    )}
    {...props}
  />
);

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
