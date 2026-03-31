import HeroSection from "@/components/module/home/HeroSection";
import FeaturedIdeas from "@/components/module/home/FeaturedIdeas";
import Testimonials from "@/components/module/home/Testimonials";
import Newsletter from "@/components/module/home/Newsletter";
import { prefetchIdeas } from "@/services/idea.service";
import { prefetchCategories } from "@/services/category.service";
import { IIdea } from "@/types/idea.types";
import { ICategory } from "@/types/category.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Zap, Users, Award, TrendingUp, Lock, Share2, BarChart3, Heart } from "lucide-react";

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
  
  // Try exact match first
  if (emojiMap[categoryName]) return emojiMap[categoryName];
  
  // Try case-insensitive match or partial match
  const lowerName = categoryName.toLowerCase();
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (key.toLowerCase() === lowerName || lowerName.includes(key.toLowerCase())) {
      return emoji;
    }
  }
  
  // Default emoji
  return "🌱";
};

export default async function Home() {
  let featuredIdeas: IIdea[] = [];
  let categories: ICategory[] = [];
  let isLoading = false;

  try {
    // Fetch featured/approved ideas sorted by votes - top 6 for homepage
    const response = await prefetchIdeas({
      limit: 6,
    });
    
    if (response) {
      featuredIdeas = (response.data || [])
        .filter((idea) => idea.status === "APPROVED")
        .sort((a, b) => {
          const aScore = (a.totalUpVotes || 0) - (a.totalDownVotes || 0);
          const bScore = (b.totalUpVotes || 0) - (b.totalDownVotes || 0);
          return bScore - aScore;
        })
        .slice(0, 6);
    }
  } catch (error) {
    console.error("Error fetching featured ideas:", error);
  }

  try {
    // Fetch categories from API
    const categoriesResponse = await prefetchCategories();
    if (categoriesResponse.data) {
      categories = categoriesResponse.data;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback to empty array if fetch fails
  }

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      
      {/* Stats Section */}
      <section className="py-16 bg-linear-to-r from-emerald-600 via-emerald-700 to-teal-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="text-5xl font-bold mb-2">5,000+</div>
              <p className="text-emerald-100 text-lg">Active Members</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl font-bold mb-2">1,200+</div>
              <p className="text-emerald-100 text-lg">Ideas Shared</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl font-bold mb-2">50+</div>
              <p className="text-emerald-100 text-lg">Categories</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl font-bold mb-2">$2M+</div>
              <p className="text-emerald-100 text-lg">Value Created</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedIdeas ideas={featuredIdeas} isLoading={isLoading} />

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Sustainify?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything you need to share, discover, and monetize sustainable innovations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg w-fit mb-4">
                <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Instant Publishing</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Share your sustainability ideas instantly with a global audience of changemakers and investors.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Community Voting</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Get real feedback from the community. Ideas with highest votes get featured and visibility boost.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg w-fit mb-4">
                <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Monetize Ideas</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Turn premium ideas into revenue. Set your price and earn from subscribers who value your work.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg w-fit mb-4">
                <Share2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Easy Sharing</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Share ideas across social media platforms. Built-in sharing features amplify your reach.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg w-fit mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Analytics Insights</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Track views, votes, and engagement with detailed analytics and performance metrics.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg w-fit mb-4">
                <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Recognition</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Get badges, certificates, and recognition for top-voted and impactful ideas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Get started in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "1", title: "Sign Up", description: "Create your free account in seconds", icon: "👤", bgColor: "from-blue-50 to-cyan-50", borderColor: "border-blue-200", numberColor: "text-blue-600", darkFrom: "dark:from-blue-900/20", darkTo: "dark:to-cyan-900/20", darkBorder: "dark:border-blue-700" },
              { number: "2", title: "Share Idea", description: "Post your sustainability innovation", icon: "💡", bgColor: "from-emerald-50 to-green-50", borderColor: "border-emerald-200", numberColor: "text-emerald-600", darkFrom: "dark:from-emerald-900/20", darkTo: "dark:to-green-900/20", darkBorder: "dark:border-emerald-700" },
              { number: "3", title: "Get Feedback", description: "Receive votes and comments from community", icon: "💬", bgColor: "from-purple-50 to-pink-50", borderColor: "border-purple-200", numberColor: "text-purple-600", darkFrom: "dark:from-purple-900/20", darkTo: "dark:to-pink-900/20", darkBorder: "dark:border-purple-700" },
              { number: "4", title: "Monetize", description: "Release premium version or earn rewards", icon: "🏆", bgColor: "from-amber-50 to-orange-50", borderColor: "border-amber-200", numberColor: "text-amber-600", darkFrom: "dark:from-amber-900/20", darkTo: "dark:to-orange-900/20", darkBorder: "dark:border-amber-700" }
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                <div className={`bg-linear-to-br ${step.bgColor} ${step.darkFrom} ${step.darkTo} rounded-2xl p-8 border ${step.borderColor} ${step.darkBorder} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                  {/* Step Number Badge */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${step.numberColor} bg-white dark:bg-slate-800 rounded-full font-bold text-lg mb-4 border-2 ${step.borderColor} ${step.darkBorder}`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="text-4xl mb-4">{step.icon}</div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>

                {/* Connecting Arrow */}
                {idx < 3 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-6 h-1 bg-linear-to-r from-blue-400 via-emerald-400 to-purple-400 dark:from-blue-600 dark:via-emerald-600 dark:to-purple-600" />
                    <ArrowRight className="w-5 h-5 text-emerald-500 dark:text-emerald-400 -ml-2" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Step Indicators */}
          <div className="lg:hidden flex justify-center items-center gap-2 mt-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 dark:bg-emerald-400 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold">
                  {num}
                </div>
                {num < 4 && <div className="w-8 h-1 bg-emerald-300 dark:bg-emerald-600 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideas Categories Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Explore Categories</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Sustainability solutions across diverse sectors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/ideas?category=${encodeURIComponent(category.name)}`}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group h-full flex flex-col items-center justify-center min-h-35"
                >
                  <div className="text-4xl mb-3">
                    {getCategoryEmoji(category.name)}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-sm line-clamp-2">
                    {category.name}
                  </h3>
                </Link>
              ))
            ) : (
              // Fallback if no categories
              ["Energy", "Waste", "Water", "Food", "Transportation", "Biodiversity"].map((category, idx) => (
                <Link
                  key={idx}
                  href={`/ideas?category=${encodeURIComponent(category)}`}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group h-full flex flex-col items-center justify-center min-h-35"
                >
                  <div className="text-4xl mb-3">
                    {getCategoryEmoji(category)}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-sm">
                    {category}
                  </h3>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Link href="/ideas">
                Explore All Ideas <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Environmental Impact Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Real Environmental Impact</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Track the measurable difference our community is making
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-emerald-200 dark:border-slate-700">
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">245K</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">CO₂ Reduced</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Estimated tonnes of CO₂ saved through implemented ideas</p>
            </div>
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-blue-200 dark:border-slate-700">
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">12M</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Water Saved</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Litres of water conserved through community projects</p>
            </div>
            <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-green-200 dark:border-slate-700">
              <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-4">8.5K</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Trees Planted</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Through reforestation initiatives supported by our members</p>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-purple-200 dark:border-slate-700">
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-4">320K</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Waste Diverted</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Kilograms of waste redirected from landfills</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Credibility Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Trusted by Leaders</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Partnered with organizations working towards a sustainable future
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { name: "EcoTech Alliance", icon: "🌍" },
              { name: "Global Innovators", icon: "💡" },
              { name: "Sustainability Fund", icon: "💚" },
              { name: "Green Ventures", icon: "🌱" }
            ].map((partner, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{partner.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{partner.name}</h3>
              </div>
            ))}
          </div>

          {/* Credibility Badges */}
          <div className="mt-16 bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">ISO Certified</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Meeting international standards for environmental impact</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Industry Award Winner</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Recognized as top sustainability platform 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">B Corp Certified</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Committed to stakeholder interests and sustainability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
