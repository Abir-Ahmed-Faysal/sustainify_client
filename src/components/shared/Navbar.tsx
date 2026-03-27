"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Ideas", href: "/ideas" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "About Us", href: "/about-us" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1">
              <Leaf className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
                Sustainify
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-600",
                  pathname === link.href ? "text-emerald-600 font-bold" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/register">Join Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-white p-4 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-base font-medium transition-colors hover:text-emerald-600",
                  pathname === link.href ? "text-emerald-600 font-bold" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/register">Join Now</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
