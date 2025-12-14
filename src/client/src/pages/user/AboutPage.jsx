import { Link } from "react-router-dom";

import AboutHeroSection from "../../components/features/about/AboutHeroSection";
import StorySection from "../../components/features/about/StorySection";
import CoreValuesSection from "../../components/features/about/CoreValuesSection.jsx";
import TeamSection from "../../components/features/about/TeamSection.jsx";
import LocationSection from "../../components/features/about/LocationSection.jsx";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <AboutHeroSection />
      {/* Story Section */}
      <StorySection />
      {/* Values Section */}
      <CoreValuesSection />
      {/* Team Section */}
      <TeamSection />
      {/* Location Section */}
      <LocationSection />

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl mb-4">Sẵn Sàng Thưởng Thức?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Đặt hàng ngay để trải nghiệm hương vị tuyệt vời từ SweetieBakery
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#F7B5D5] text-white hover:bg-[#F7B5D5]/90"
          >
            Đặt Hàng Ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
