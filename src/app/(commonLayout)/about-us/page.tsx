import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Leaf, Users, Lightbulb, Globe, Target, Heart } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <Badge variant="outline" className="mb-6 border-emerald-500/50 text-emerald-400">Our Story</Badge>
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1]">
              Empowering Change Through <span className="text-emerald-400">Collective Ideas</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Sustainify is a community platform dedicated to discovering, sharing, and monetizing innovative sustainability solutions that create real, measurable impact on our planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                <Link href="/ideas">
                  Explore Ideas <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-950/50">
                <Link href="/register">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                We empower sustainability innovators to share their ideas, connect with like-minded changemakers, and monetize their vision for a sustainable future. Every great idea deserves a platform, and every contributor deserves recognition.
              </p>
            </div>

            {/* Vision */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                We envision a world where sustainable solutions are not scarcity, but abundance. Where local communities, global organizations, and individual innovators collaborate to build a regenerative economy that works for people and planet alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              These principles guide everything we do at Sustainify
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg w-fit mb-4">
                <Lightbulb className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Innovation</h3>
              <p className="text-slate-700 dark:text-slate-300">
                We celebrate boldness and creativity. We believe the best solutions come from diverse perspectives and unconventional thinking.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Community</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Collective action is more powerful than individual effort. We foster collaboration, mutual support, and shared learning among all our members.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg w-fit mb-4">
                <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Impact</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Everything we do must contribute to a healthier planet. Measurable, positive environmental impact is at the heart of our mission.
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg w-fit mb-4">
                <Heart className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Inclusivity</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Sustainability is everyone's responsibility. We welcome diverse voices, perspectives, and backgrounds to co-create solutions.
              </p>
            </div>

            {/* Value 5 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg w-fit mb-4">
                <Leaf className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Transparency</h3>
              <p className="text-slate-700 dark:text-slate-300">
                We believe in open dialogue and honest communication. Our processes, decisions, and impact metrics are accessible to everyone.
              </p>
            </div>

            {/* Value 6 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg w-fit mb-4">
                <Lightbulb className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Excellence</h3>
              <p className="text-slate-700 dark:text-slate-300">
                We continuously strive to improve. High-quality standards in platform development and community support drive our culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sustainify Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Why Sustainify?</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">🌍 Make Real Impact</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Share ideas that solve real sustainability challenges. Your innovation could inspire millions and drive global change.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">💰 Monetize Your Vision</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Premium ideas can generate revenue. Turn your sustainability passion into sustainable income while helping others.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">🤝 Connect & Collaborate</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Join a thriving community of changemakers, entrepreneurs, and environmental advocates. Build meaningful partnerships.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">📚 Learn & Grow</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Access resources, mentorship, and best practices from industry experts and community members.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-12 border border-emerald-200 dark:border-emerald-800">
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">5000+</div>
                    <p className="text-slate-600 dark:text-slate-300">Active Community Members</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">1200+</div>
                    <p className="text-slate-600 dark:text-slate-300">Ideas Submitted & Reviewed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">50+</div>
                    <p className="text-slate-600 dark:text-slate-300">Categories Covered</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">100K+</div>
                    <p className="text-slate-600 dark:text-slate-300">Platform Reach</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto">
            Join thousands of changemakers and start sharing your sustainability ideas today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 gap-2">
              <Link href="/register">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/ideas">Browse Ideas</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
