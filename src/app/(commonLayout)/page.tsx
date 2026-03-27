import HeroSection from "@/components/module/home/HeroSection";
import FeaturedIdeas from "@/components/module/home/FeaturedIdeas";
import Testimonials from "@/components/module/home/Testimonials";
import Newsletter from "@/components/module/home/Newsletter";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturedIdeas />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
