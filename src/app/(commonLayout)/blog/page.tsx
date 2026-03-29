"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Search, Calendar, User, MessageCircle, Heart } from "lucide-react";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  image_placeholder: string;
  likes: number;
  comments: number;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Renewable Energy: Innovations Shaping 2026",
    excerpt: "Explore the latest breakthroughs in solar, wind, and hydroelectric technologies that are revolutionizing how we power our world.",
    category: "Energy",
    author: "Sarah Johnson",
    date: "Mar 15, 2026",
    readTime: "8 min read",
    image: "/blog/renewable-energy.jpg",
    image_placeholder: "bg-yellow-100 dark:bg-yellow-900/20",
    likes: 234,
    comments: 18
  },
  {
    id: "2",
    title: "Zero Waste Living: Practical Steps for Everyday Change",
    excerpt: "Learn actionable strategies to reduce waste in your daily life and contribute to a circular economy without sacrificing convenience.",
    category: "Waste",
    author: "Michael Chen",
    date: "Mar 12, 2026",
    readTime: "6 min read",
    image: "/blog/zero-waste.jpg",
    image_placeholder: "bg-green-100 dark:bg-green-900/20",
    likes: 189,
    comments: 24
  },
  {
    id: "3",
    title: "Urban Gardening: Growing Food in Small Spaces",
    excerpt: "Discover how vertical gardens and hydroponics are enabling city dwellers to grow fresh food sustainably in limited spaces.",
    category: "Food",
    author: "Emma Rodriguez",
    date: "Mar 8, 2026",
    readTime: "7 min read",
    image: "/blog/urban-garden.jpg",
    image_placeholder: "bg-orange-100 dark:bg-orange-900/20",
    likes: 312,
    comments: 35
  },
  {
    id: "4",
    title: "Ocean Conservation: Protecting Our Blue Planet",
    excerpt: "Understanding the critical challenges facing our oceans and what individuals and organizations can do to make a difference.",
    category: "Water",
    author: "Dr. James Wilson",
    date: "Mar 5, 2026",
    readTime: "9 min read",
    image: "/blog/ocean.jpg",
    image_placeholder: "bg-cyan-100 dark:bg-cyan-900/20",
    likes: 425,
    comments: 42
  },
  {
    id: "5",
    title: "Electric Vehicles: The Transportation Revolution",
    excerpt: "A comprehensive guide to the EV market, incentives, infrastructure, and how electrifying transport is accelerating climate action.",
    category: "Transportation",
    author: "Alex Thompson",
    date: "Mar 1, 2026",
    readTime: "10 min read",
    image: "/blog/ev.jpg",
    image_placeholder: "bg-blue-100 dark:bg-blue-900/20",
    likes: 567,
    comments: 52
  },
  {
    id: "6",
    title: "Biodiversity Hotspots: Why We Must Protect Them",
    excerpt: "Explore the world's most biodiverse regions and learn why preserving these ecosystems is vital for planetary health.",
    category: "Biodiversity",
    author: "Lisa Martinez",
    date: "Feb 28, 2026",
    readTime: "8 min read",
    image: "/blog/biodiversity.jpg",
    image_placeholder: "bg-purple-100 dark:bg-purple-900/20",
    likes: 298,
    comments: 28
  }
];

const categories = [
  "All",
  "Energy",
  "Waste",
  "Food",
  "Water",
  "Transportation",
  "Biodiversity",
  "Climate"
];

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Energy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    Waste: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Food: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    Water: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    Transportation: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Biodiversity: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    Climate: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  };
  return colors[category] || "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
};

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 border-emerald-500/50 text-emerald-400">Blog</Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1]">
              Insights & Stories for a <span className="text-emerald-400">Sustainable Future</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Discover expert perspectives, community stories, and practical guides for building a more sustainable world.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="sticky top-20 z-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-6">
        <div className="container mx-auto px-4 md:px-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">No posts found</p>
              <Button asChild variant="outline">
                <Link href="/blog">Clear filters</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className={`h-48 w-full ${post.image_placeholder} overflow-hidden flex items-center justify-center relative`}>
                    <div className="flex items-center justify-center h-full w-full text-slate-400 dark:text-slate-600 font-bold text-lg opacity-50">
                      {post.category} Article
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="space-y-3 mb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <span>{post.readTime}</span>
                      </div>

                      {/* Engagement */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>

                    {/* Read More Link */}
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold group/link"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Stay Updated</h2>
          <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto">
            Get the latest sustainability insights and stories delivered to your inbox weekly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Authors Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Featured Authors</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Learn from leading voices in sustainability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sarah Johnson", title: "Energy Expert", posts: 12 },
              { name: "Michael Chen", title: "Waste Specialist", posts: 9 },
              { name: "Emma Rodriguez", title: "Urban Farmer", posts: 15 },
              { name: "Dr. James Wilson", title: "Ocean Advocate", posts: 18 }
            ].map((author, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {author.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{author.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{author.title}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                  {author.posts} articles
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
