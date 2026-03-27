import Link from "next/link";
import { Leaf, MessageCircle, Share2, Camera, Globe, Code } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-1">
              <Leaf className="h-6 w-6 text-emerald-400" />
              <span className="text-xl font-bold text-white">
                Sustainify
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Empowering communities with sustainable ideas for a greener tomorrow. 
              Join the EcoSpark Hub and make an impact today.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-emerald-400 transition-colors">
                <MessageCircle size={20} />
              </Link>
              <Link href="#" className="hover:text-emerald-400 transition-colors">
                <Share2 size={20} />
              </Link>
              <Link href="#" className="hover:text-emerald-400 transition-colors">
                <Camera size={20} />
              </Link>
              <Link href="#" className="hover:text-emerald-400 transition-colors">
                <Globe size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ideas" className="hover:text-emerald-400 transition-colors">Browse Ideas</Link></li>
              <li><Link href="/about-us" className="hover:text-emerald-400 transition-colors">Our Mission</Link></li>
              <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Eco Blog</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/register" className="hover:text-emerald-400 transition-colors">Join Community</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ideas?category=energy" className="hover:text-emerald-400 transition-colors">Renewable Energy</Link></li>
              <li><Link href="/ideas?category=transport" className="hover:text-emerald-400 transition-colors">Transportation</Link></li>
              <li><Link href="/ideas?category=waste" className="hover:text-emerald-400 transition-colors">Waste Management</Link></li>
              <li><Link href="/ideas?category=water" className="hover:text-emerald-400 transition-colors">Water Conservation</Link></li>
              <li><Link href="/ideas?category=biodiversity" className="hover:text-emerald-400 transition-colors">Biodiversity</Link></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: support@sustainify.com</li>
              <li>Phone: +880 1234 567890</li>
              <li>Address: Dhaka, Bangladesh</li>
              <li className="pt-4 space-y-2">
                <p className="font-semibold text-white">Legal</p>
                <div className="flex gap-4">
                   <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                   <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Use</Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Sustainify (EcoSpark Hub). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
