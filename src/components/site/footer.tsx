import Link from "next/link";
import { Dumbbell } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-5 w-5" />
            </span>
            <span className="text-lg">GymPilot<span className="text-primary"> AI</span></span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            We&apos;re building AI-powered gym management for gyms worldwide — and we&apos;re
            designing it around what real gym owners actually need.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground">Features</Link></li>
              <li><Link href="/#mockups" className="hover:text-foreground">Preview</Link></li>
              <li><Link href="/#benefits" className="hover:text-foreground">Benefits</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Get involved</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/survey" className="hover:text-foreground">Take the survey</Link></li>
              <li><Link href="/#beta" className="hover:text-foreground">Join the beta</Link></li>
              <li><Link href="/#faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Internal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              <li><Link href="/admin" className="hover:text-foreground">Admin</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} GymPilot AI. All rights reserved.</p>
          <p>Made for gym owners worldwide 🌍</p>
        </div>
      </div>
    </footer>
  );
}
