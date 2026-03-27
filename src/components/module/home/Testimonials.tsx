import { Quote, Star } from "lucide-react";
import Image from "next/image";

const topIdeas = [
  {
    name: "Biodegradable Packaging",
    author: "Alice Johnson",
    votes: 1240,
    quote: "Sustainify helped us find the right partners to scale our mushroom-based packaging globally."
  },
  {
    name: "Solar Cookers for Rural areas",
    author: "Bob Smith",
    votes: 980,
    quote: "The feedback from admins was invaluable for refining our technical blueprint."
  },
  {
    name: "EV Charging Grid Optimization",
    author: "Charlie Davis",
    votes: 850,
    quote: "A professional platform for professional green thinkers. Truly impactful."
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Voices of <span className="text-indigo-600">Impact</span>
          </h2>
          <p className="text-gray-600">
            Discover the stories behind the most voted ideas that are changing the environmental landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topIdeas.map((idea, index) => (
            <div key={index} className="relative p-8 rounded-3xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors">
              <Quote className="absolute top-6 right-8 text-indigo-300 h-10 w-10 opacity-50" />
              <div className="flex gap-1 mb-4">
                 {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#6366f1" color="#6366f1" />)}
              </div>
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                   {idea.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900 leading-none">{idea.name}</h4>
                  <p className="text-xs text-indigo-500 mt-1">by {idea.author} • {idea.votes} Votes</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
