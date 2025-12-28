import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-linear-to-br from-[#F7B5D5]/20 via-white to-[#FFF0D9]/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-[#F7B5D5]">
            <Sparkles className="mr-2 h-3 w-3" />
            Chào mừng đến với SweetieBakery
          </Badge>
          <h1
            className="text-5xl md:text-6xl mb-6"
            style={{ color: "#F7B5D5", fontWeight: 700 }}
          >
            Hương Vị Ngọt Ngào
            <br />
            Cho Mỗi Khoảnh Khắc
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Những chiếc bánh thủ công được làm với tình yêu và nguyên liệu tươi
            ngon nhất. Đặt hàng ngay để trải nghiệm!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#F7B5D5] hover:bg-[#F7B5D5]/90 hover:cursor-pointer"
              onClick={() => navigate("/products")}
            >
              Đặt hàng ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/about")}
              className="hover:cursor-pointer hover:bg-gray-100"
            >
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
