import HeroSection from "@/components/module/home/HeroSection";
import FeaturedIdeas from "@/components/module/home/FeaturedIdeas";
import Testimonials from "@/components/module/home/Testimonials";
import Newsletter from "@/components/module/home/Newsletter";
import RecommendationsSection from "@/components/module/home/RecommendationsSection";
import FAQSection from "@/components/module/home/FAQSection";
import CTASection from "@/components/module/home/CTASection";
import { getPublicIdeas } from "@/services/idea.service";
import { prefetchCategories } from "@/services/category.service";
import { getStats } from "@/services/stats.service";
import { IIdea } from "@/types/idea.types";
import { ICategory } from "@/types/category.types";
import { DashboardStats, IMemberStats } from "@/types/stats.types";
import Link from "next/link";
import { Zap, Users, Lock } from "lucide-react";

// Revalidate home page every 1 hour (3600s)
export const revalidate = 3600;

// Function to get emoji for category names
const getCategoryEmoji = (categoryName: string): string => {
  const emojiMap: Record<string, string> = {
    Energy: "⚡",
    Waste: "♻️",
    Water: "💧",
    Food: "🌾",
    Transportation: "🚗",
    Biodiversity: "🌿",
    Climate: "🌍",
    Agriculture: "🚜",
    Renewable: "☀️",
    Conservation: "🦁",
    Urban: "🏙️",
    Ocean: "🌊",
  };
  
  if (emojiMap[categoryName]) return emojiMap[categoryName];
  const lowerName = categoryName.toLowerCase();
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (key.toLowerCase() === lowerName || lowerName.includes(key.toLowerCase())) {
      return emoji;
    }
  }
  return "🌱";
};

export default async function Home() {
  let featuredIdeas: IIdea[] = [];
  let topVotedIdeas: IIdea[] = []; // These are actually sorted by positiveRatio as required
  let categories: ICategory[] = [];
  let stats: (DashboardStats | IMemberStats | null) = null;

  try {
    // 🌍 Fetch Top 6 Approved ideas for the main featured section
    const featuredResponse = await getPublicIdeas({
      limit: 6,
      sortBy: "totalUpVotes",
      sortOrder: "desc",
    });
    
    if (featuredResponse.success) {
      featuredIdeas = featuredResponse.data || [];
    }

    // 🏆 Top Voted Ideas for Testimonials 
    // They are fetched using positiveRatio as the primary quality metric
    const topVotedResponse = await getPublicIdeas({
      limit: 3,
      sortBy: "totalUpVotes",
      sortOrder: "desc",
    });

    if (topVotedResponse.success) {
      topVotedIdeas = topVotedResponse.data || [];
    }
  } catch (error) {
    console.error("Error fetching homepage ideas:", error);
  }

  try {
    const categoriesResponse = await prefetchCategories();
    if (categoriesResponse.data) {
      categories = categoriesResponse.data;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  try {
    // Fetch real stats data
    const statsResponse = await getStats();
    if (statsResponse.success && statsResponse.data) {
      stats = statsResponse.data;
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
  }

  return (
    <div className="flex flex-col w-full">
      <HeroSection categories={categories} />
      
      {/* Stats Section */}
      <section className="py-16 bg-linear-to-r from-emerald-600 via-emerald-700 to-teal-800">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                {stats && 'totalUsers' in stats ? stats.totalUsers?.toLocaleString() : "5,000"}+
              </div>
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest opacity-80">Impactful Members</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                {stats && 'totalIdeas' in stats ? stats.totalIdeas?.toLocaleString() : "1,200"}+
              </div>
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest opacity-80">Shared Solutions</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                {categories.length || "50"}+
              </div>
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest opacity-80">Global Sectors</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                {stats && 'approvalRate' in stats ? Math.round((Number(stats.approvalRate) || 80) * 100) / 100 : "80"}%
              </div>
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest opacity-80">Positive Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedIdeas ideas={featuredIdeas} isLoading={false} />

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-950 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">Empowering Your Sustainability <span className="text-emerald-600">Journey</span></h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
               Everything you need to publish, curate, and scale your environmental impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group p-10 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-all duration-300">
              <Zap className="w-12 h-12 text-emerald-500 mb-8" />
              <h3 className="text-2xl font-bold mb-4">Instant Global Outreach</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Share your sustainability concepts instantly with a global network of changemakers and potential investors waiting to connect.</p>
            </div>
            <div className="group p-10 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300">
              <Users className="w-12 h-12 text-blue-500 mb-8" />
              <h3 className="text-2xl font-bold mb-4">Trusted Verification</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Leverage the power of community verification. Ideas with high accuracy and positive ratios are automatically featured.</p>
            </div>
            <div className="group p-10 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-purple-500/50 transition-all duration-300">
              <Lock className="w-12 h-12 text-purple-500 mb-8" />
              <h3 className="text-2xl font-bold mb-4">Strategic Monetization</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Securely monetize your premium solutions. Set your value and receive support from members who truly believe in your mission.</p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials ideas={topVotedIdeas} />

      {/* Categories Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Sectors of Action</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Discover projects targeted towards specific environmental challenges.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 12).map((cat) => (
              <Link
                key={cat.id}
                href={`/ideas?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-emerald-500 transition-all hover:scale-105 duration-300 shadow-sm"
              >
                <span className="text-4xl mb-4 transition-all">{getCategoryEmoji(cat.name)}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RecommendationsSection />

      <CTASection />

      <FAQSection />

      <Newsletter />
    </div>
  );
}
