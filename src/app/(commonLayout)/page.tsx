import HeroSection from "@/components/module/home/HeroSection";
import FeaturedIdeas from "@/components/module/home/FeaturedIdeas";
import Testimonials from "@/components/module/home/Testimonials";
import Newsletter from "@/components/module/home/Newsletter";
import { getIdeas } from "@/services/idea.service";
import { IIdea } from "@/types/idea.types";

export default async function Home() {
  let featuredIdeas: IIdea[] = [];
  let isLoading = false;

  try {
    // Fetch featured/approved ideas sorted by votes
    const response = await getIdeas({
      limit: 3,
      searchTerm: "",
    });
    
    if (response.data) {
      featuredIdeas = response.data
        .filter((idea) => idea.isFeatured || idea.status === "APPROVED")
        .sort((a, b) => (b.totalUpVotes - b.totalDownVotes) - (a.totalUpVotes - a.totalDownVotes))
        .slice(0, 3);
    }
  } catch (error) {
    console.error("Error fetching featured ideas:", error);
  }

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturedIdeas ideas={featuredIdeas} isLoading={isLoading} />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
