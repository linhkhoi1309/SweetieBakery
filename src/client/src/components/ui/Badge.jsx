import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "./utils";

// Định nghĩa các biến thể (variants) và styles mặc định của Badge
const badgeVariants = cva(
  // Base styles: Căn giữa, bo góc, có border, padding, font size, etc.
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Component Badge
 * Dùng để hiển thị các nhãn/tag nhỏ.
 */
function Badge({ className, variant, asChild = false, ...props }) {
  // Logic asChild: Nếu asChild là true, component sẽ được render dưới dạng Slot
  // (Cho phép Badge kế thừa thuộc tính của component con được truyền vào)
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      // Hợp nhất (merge) các class: base, variant, và custom class
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

// Export các thành phần để sử dụng bên ngoài
export { Badge, badgeVariants };
