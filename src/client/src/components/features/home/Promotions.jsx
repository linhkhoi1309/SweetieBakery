import { Sparkles, Copy, Check } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

const Promotions = ({ promotions, copiedCode, onClickCopyCode }) => {
  return (
    <section className="bg-[#FFF0D9]/30 py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2 text-[#2D1B1B]">
            Ưu Đãi Đặc Biệt
          </h2>
          <p className="text-muted-foreground text-gray-600">
            Những chương trình khuyến mãi hấp dẫn trong tháng dành riêng cho bạn
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white border-2 border-[#F7B5D5]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="p-6 text-center flex flex-col items-center h-full">
                {/* Icon Circle */}
                <div className="w-16 h-16 bg-[#F7B5D5]/20 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-[#F7B5D5]" />
                </div>

                {/* Title & Desc */}
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {promo.title}
                </h3>
                <p className="text-sm text-gray-500 mb-6 flex-grow">
                  {promo.description}
                </p>

                {/* Badge Code */}
                <div className="mb-4">
                  <Badge
                    variant="outline"
                    className="border-[#F7B5D5] text-[#F7B5D5] px-3 py-1 text-sm"
                  >
                    Mã: <span className="font-bold ml-1">{promo.code}</span>
                  </Badge>
                </div>

                {/* Copy Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-auto border-dashed hover:border-[#F7B5D5] hover:text-[#F7B5D5] hover:cursor-pointer"
                  onClick={() => onClickCopyCode(promo.code)}
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Sao chép mã
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promotions;
