"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Menu 
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md border shadow-sm"
        onClick={() => setIsOpenMobile(true)}
      >
        <Menu size={20} />
      </button>

      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "bg-white border-r transition-all duration-300 ease-in-out h-screen z-50",
          "fixed md:sticky top-0",
          isCollapsed ? "w-16" : "w-64",
          isOpenMobile ? "left-0" : "-left-64 md:left-0"
        )}
      >
        {/* Header / Toggle Button Desktop */}
        <div className="flex items-center justify-between p-4 border-b h-16">
          {!isCollapsed && <span className="font-bold text-xl">Sustainify</span>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1 hover:bg-gray-100 rounded"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          
          {/* Close for Mobile */}
          <button
            onClick={() => setIsOpenMobile(false)}
            className="md:hidden p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors",
                isCollapsed ? "justify-center" : "space-x-3"
              )}
            >
              <item.icon size={20} className="text-gray-500" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
