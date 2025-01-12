import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-between text-center md:text-left">
          <div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} J&S Group, LLC. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-muted-foreground">
              Transforming resumes with AI
            </span>
          </div>
          <div>
            <Link
              href="/license"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              License Information
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}