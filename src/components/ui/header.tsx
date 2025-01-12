'use client';

import Link from 'next/link';
import { UserCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block">Resume Refiner</span>
            <span className="px-2 py-1 text-xs bg-muted rounded-full">Demo</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="https://resume-refiner.vercel.app"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              target="_blank"
            >
              Live App
            </Link>
            <Link
              href="https://github.com/BioInfo/resume-refiner"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              target="_blank"
            >
              GitHub
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <UserCircle className="h-6 w-6" />
          <span className="text-sm">Demo User</span>
        </div>
      </div>
    </header>
  );
}