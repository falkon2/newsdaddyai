"use client";

import React from 'react';
import Navbar from './navbar';
import { Geist, Geist_Mono } from "next/font/google";
import ScrollToTopButton from '../ui/scroll-to-top-button';
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isNewsPage = pathname === '/news';
  
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-[family-name:var(--font-geist-sans)] bg-background text-foreground`}>
      <Navbar />
      <main className={isNewsPage ? "" : "container mx-auto pt-24 pb-16 px-4 md:px-6"}>
        {children}
      </main>
      <footer className={`border-t py-6 md:py-8 ${isNewsPage ? "hidden" : ""}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Integrity News. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
      <ScrollToTopButton showAtHeight={400} className="lg:right-8 lg:bottom-8" />
    </div>
  );
}
