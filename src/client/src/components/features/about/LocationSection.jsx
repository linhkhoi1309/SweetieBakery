import { Clock, Mail, MapPin, Phone } from "lucide-react";

const LocationSection = () => {
  return (
    <section className="bg-[#FFF0D9]/30 py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-3">Ghé Thăm Chúng Tôi</h2>
          <p className="text-muted-foreground">
            Tìm cửa hàng SweetieBakery gần bạn nhất
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* --- LEFT COLUMN: MAIN STORE CARD --- */}
          {/* Card Logic: bg-card (white), rounded-xl, border */}
          <div className="bg-white text-gray-950 flex flex-col rounded-xl border shadow-sm overflow-hidden">
            {/* Card Content Logic: p-0 (được override từ code cũ) */}
            <div className="flex flex-col h-full">
              {/* 1. Map Placeholder Area */}
              <div className="aspect-video bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto text-[#F7B5D5] mb-4" />
                  <p className="text-gray-500 font-medium">
                    Bản đồ Google Maps
                  </p>
                </div>
              </div>

              {/* 2. Main Store Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Cửa Hàng Chính</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-[#F7B5D5] mr-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        227 đường Nguyễn Văn Cừ, Phường Chợ Quán
                      </p>
                      <p className="text-sm text-gray-500">
                        TP. Hồ Chí Minh, Việt Nam
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-[#F7B5D5] mr-3 shrink-0" />
                    <p className="text-sm text-gray-700">(028) 1234 5678</p>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-[#F7B5D5] mr-3 shrink-0" />
                    <p className="text-sm text-gray-700">
                      hello@sweetiebakery.com
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-[#F7B5D5] mr-3 mt-0.5 shrink-0" />
                    <div className="text-sm text-gray-700">
                      <p>Thứ 2 - Thứ 6: 7:00 - 21:00</p>
                      <p>Thứ 7 - CN: 8:00 - 22:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: OTHER LOCATIONS LIST --- */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Chi Nhánh Khác</h3>

            {/* Branch 1 */}
            <div className="bg-white text-gray-950 rounded-xl border shadow-sm">
              <div className="p-4">
                <h4 className="font-semibold mb-2">Chi nhánh Linh Trung</h4>
                <p className="text-sm text-gray-500 mb-2">
                  Khu đô thị Đại học Quốc gia Thành phố Hồ Chí Minh, Phường Đông
                  Hoà, Thành phố Hồ Chí Minh
                </p>
                <p className="text-sm text-[#F7B5D5] font-medium">
                  📞 (028) 8765 4321
                </p>
              </div>
            </div>

            {/* View All Button */}
            <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#F7B5D5] text-white hover:bg-[#F7B5D5]/90">
              Xem Tất Cả Cửa Hàng
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
