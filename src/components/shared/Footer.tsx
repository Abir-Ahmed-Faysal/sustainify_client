import Link from "next/link";
import { 
  Leaf, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Globe,
  X,
  Camera,
  Briefcase
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-slate-900">
          {/* Brand Identity */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                <Leaf className="h-6 w-6 text-emerald-500" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Sustainify
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              EcoSpark Hub: Igniting change for a better tomorrow. Join our community of 
              high-impact innovators sharing sustainable solutions across the globe.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-white transition-all transform hover:-translate-y-1">
                <Globe size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-white transition-all transform hover:-translate-y-1">
                <X size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-white transition-all transform hover:-translate-y-1">
                <Camera size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-white transition-all transform hover:-translate-y-1">
                <Briefcase size={18} />
              </a>
            </div>
          </div>

          {/* Useful Navigation */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Explore Portal</h3>
            <ul className="space-y-4">
              {[
                { label: "Browse Ideas", target: "/ideas" },
                { label: "Our Mission", target: "/about" },
                { label: "Eco Blog", target: "/blog" },
                { label: "Contact Us", target: "/contact" },
                { label: "Join Community", target: "/register" }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.target} className="text-sm hover:text-emerald-400 flex items-center gap-2 transition-colors group">
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-bold" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Categories</h3>
            <ul className="space-y-4">
              {[
                "Energy", "Waste", "Transport", "Water", "Biodiversity"
              ].map((cat) => (
                <li key={cat}>
                  <Link href={`/ideas?category=${cat.toLowerCase()}`} className="text-sm hover:text-emerald-400 flex items-center gap-2 transition-colors group">
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all font-bold" />
                    {cat} Management
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900">
                  <Mail size={16} className="text-emerald-500" />
                </div>
                <span>support@sustainify.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900">
                  <Phone size={16} className="text-emerald-500" />
                </div>
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900">
                  <MapPin size={16} className="text-emerald-500" />
                </div>
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[13px] font-medium">
            &copy; {currentYear} <span className="text-emerald-500">Sustainify</span> (EcoSpark Hub). ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[13px] font-medium">
             <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
