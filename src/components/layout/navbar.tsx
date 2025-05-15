"use client";

import React from 'react';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { Home, Newspaper, Search, User, Info } from 'lucide-react';

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "News",
    link: "/news",
    icon: <Newspaper className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Trending",
    link: "/trending",
    icon: <Search className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "About",
    link: "/about",
    icon: <Info className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Account",
    link: "/account",
    icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
];

export default function Navbar() {
  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}