import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const featuredItems = [
  {
    title: "Urban Vertical Gardens",
    category: "Food",
    description: "Transforming city rooftops into high-yield organic vegetable gardens using hydroponics.",
    votes: 842,
    image: "/vertical-garden.jpg",
    isPaid: true
  },
  {
    title: "Solar-Powered Water Station",
    category: "Energy",
    description: "Providing clean drinking water to remote villages using solar distillation tech.",
    votes: 756,
    image: "/solar-water.jpg",
    isPaid: false
  },
  {
    title: "Community Plastic Recycling",
    category: "Waste",
    description: "A local initiative to turn ocean plastic into durable building materials.",
    votes: 621,
    image: "/plastic-recycling.jpg",
    isPaid: false
  }
];

export default function FeaturedIdeas() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Sustainability <span className="text-emerald-600">Ideas</span>
            </h2>
            <p className="text-gray-600">
              Explore the most innovative and impactful ideas submitted by our community members recently.
            </p>
          </div>
          <Button variant="outline" asChild className="group border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            <Link href="/ideas" className="flex items-center gap-2">
              View All Ideas <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
              {/* Image Placeholder */}
              <div className="relative h-48 w-full bg-emerald-100 overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                   <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                     {item.category}
                   </span>
                </div>
                {item.isPaid && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm italic">
                      Paid
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-center h-full text-emerald-300 font-bold text-xl italic opacity-50">
                  {item.title} Image
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-1 text-emerald-600">
                     <Star size={18} fill="currentColor" />
                     <span className="text-sm font-bold">{item.votes} Votes</span>
                  </div>
                  <Button size="sm" asChild variant="ghost" className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
                    <Link href={`/ideas/${index}`}>View Idea</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
