import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  // 1. clsx(inputs): Hợp nhất các class dựa trên điều kiện (logic JavaScript)
  //    Ví dụ: clsx('p-4', isVisible && 'block') -> 'p-4 block'
  // 2. twMerge(...): Loại bỏ các class bị trùng lặp/xung đột của Tailwind
  //    Ví dụ: twMerge('p-4', 'p-2') -> 'p-2' (Chỉ giữ lại class cuối cùng)
  return twMerge(clsx(inputs));
}
