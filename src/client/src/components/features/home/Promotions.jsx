import { Sparkles, Copy, Check, ChevronRight, Ticket } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

const Promotions = ({ promotions, copiedCode, onClickCopyCode }) => {
  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="bg-[#FFF0D9]/30 py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8 max-w-6xl mx-auto">
          <div>
            <h2 className="text-3xl font-black text-[#2D1B1B] italic flex items-center gap-2">
              <Sparkles className="text-[#F7B5D5]" /> Ưu Đãi Đặc Biệt
            </h2>
            <p className="text-gray-600 font-medium">
              Lướt sang phải để xem thêm mã giảm giá bạn nhé!
            </p>
          </div>
          <div className="hidden md:block text-sm font-bold text-[#F7B5D5] animate-pulse">
            Vuốt để xem thêm →
          </div>
        </div>

        {/* Horizontal Slider Container */}
        <div className="relative group">
          <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 no-scrollbar snap-x snap-mandatory scroll-smooth">
            {promotions.map((promo) => (
              <div
                key={promo._id}
                className="min-w-[300px] md:min-w-[350px] bg-white border-2 border-[#F7B5D5]/20 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col snap-center hover:-translate-y-2"
              >
                <div className="p-8 text-center flex flex-col items-center h-full relative">
                  {/* Decor Circle */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FFF0D9] rounded-full opacity-50 blur-xl"></div>

                  <div className="w-16 h-16 bg-[#F7B5D5]/20 rounded-2xl flex items-center justify-center mb-4">
                    <Ticket className="text-[#F7B5D5] w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-black text-gray-800 mb-2 uppercase tracking-tight">
                    {promo.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-6 flex-grow font-medium">
                    {promo.discountType === "percent"
                      ? `Giảm ${
                          promo.discountValue
                        }% (Tối đa ${promo.maxDiscountAmount?.toLocaleString()}đ)`
                      : `Giảm trực tiếp ${promo.discountValue.toLocaleString()}đ`}
                    <br />
                    <span className="text-[10px] text-pink-300 italic font-bold uppercase">
                      Đơn từ {promo.minOrderValue?.toLocaleString()}đ
                    </span>
                  </p>

                  <div className="w-full space-y-3">
                    <div className="bg-gray-50 rounded-xl py-2 px-4 border border-dashed border-[#F7B5D5]/50 relative">
                      <span className="text-xs font-black text-gray-400 absolute -top-2 left-4 bg-white px-2">
                        VOUCHER CODE
                      </span>
                      <span className="text-lg font-black text-[#F7B5D5] tracking-widest uppercase">
                        {promo.code}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className={`w-full h-11 rounded-xl font-bold transition-all active:scale-95 ${
                        copiedCode === promo.code
                          ? "bg-green-500 text-white"
                          : "bg-[#F7B5D5] text-white hover:bg-[#f39cb4]"
                      }`}
                      onClick={() => onClickCopyCode(promo.code)}
                    >
                      {copiedCode === promo.code ? (
                        <>
                          <Check className="h-4 w-4 mr-2" /> Đã lưu mã
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" /> Sao chép mã ngay
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nút chỉ dẫn (Optional) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white/80 to-transparent w-20 h-full pointer-events-none group-hover:opacity-0 transition-opacity"></div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Promotions;
