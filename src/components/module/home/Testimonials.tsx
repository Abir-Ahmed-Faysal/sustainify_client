import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Biodegradable Packaging",
    author: "Alice Johnson",
    votes: 1240,
    quote: "Sustainify helped us find the right partners to scale our mushroom-based packaging globally. The platform's community engaged with our idea and provided invaluable feedback.",
    role: "Founder & CEO"
  },
  {
    name: "Solar Cookers for Rural areas",
    author: "Bob Smith",
    votes: 980,
    quote: "The feedback from admins and community members was invaluable for refining our technical blueprint. It accelerated our development timeline significantly.",
    role: "Environmental Engineer"
  },
  {
    name: "EV Charging Grid Optimization",
    author: "Charlie Davis",
    votes: 850,
    quote: "A professional platform for professional green thinkers. The connections I made through Sustainify have been truly impactful for our venture.",
    role: "Tech Innovator"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Voices of <span className="text-emerald-600 dark:text-emerald-400">Impact</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Hear from innovators whose ideas are making a real difference through Sustainify
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:border-emerald-500 dark:hover:border-emerald-500"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 text-emerald-300 dark:text-emerald-700 w-8 h-8 opacity-40" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill="#10b981" color="#10b981" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed text-base">
                "{item.quote}"
              </p>

              {/* Author Info */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {item.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                      {item.author}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {item.role} • {item.votes} votes
                    </p>
                  </div>
                </div>
              </div>

              {/* Idea Badge */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  Idea: {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
