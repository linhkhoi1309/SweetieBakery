import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "./utils";

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-3", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Base: Hình tròn, viền hồng nhạt
        "aspect-square size-5 shrink-0 rounded-full border-2 border-pink-200 shadow-sm transition-all outline-none",
        // Focus & Interactive
        "focus-visible:ring-2 focus-visible:ring-[#F7B5D5] focus-visible:ring-offset-2",
        // State: Khi được chọn (checked)
        "data-[state=checked]:border-[#F7B5D5] data-[state=checked]:bg-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {/* Dấu chấm tròn bên trong màu hồng đậm */}
        <Circle className="size-2.5 fill-[#F7B5D5] text-[#F7B5D5]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
