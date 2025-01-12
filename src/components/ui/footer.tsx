import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-between text-center md:text-left">
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
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-medium">Legal</h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/license"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                License Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}