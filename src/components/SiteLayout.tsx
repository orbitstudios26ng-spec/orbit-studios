import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { studioSummary } from "@/data/siteContent";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/commission", label: "Commission" },
];

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={studioSummary.logoImage}
              alt={studioSummary.name}
              className="h-11 w-11 rounded-2xl border border-white/10 object-cover"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">Orbit Studios</p>
              <p className="text-sm text-white/70">Professional portfolio websites</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm transition-colors ${
                    isActive ? "text-white" : "text-white/65 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button asChild className="rounded-full px-6">
              <Link to="/commission">
                Start a commission
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-white/10 bg-background/95 md:hidden">
            <div className="container flex flex-col gap-4 px-4 py-5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="text-sm text-white/80"
                >
                  {item.label}
                </NavLink>
              ))}
              <Button asChild className="w-full rounded-full">
                <Link to="/commission" onClick={() => setOpen(false)}>
                  Start a commission
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-black/20">
        <div className="container grid gap-8 px-4 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="max-w-md space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Orbit Studios</p>
            <h2 className="text-2xl font-semibold">Clear presentation for serious client work.</h2>
            <p className="text-sm leading-6 text-white/65">{studioSummary.mission}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Navigate</p>
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="block text-sm text-white/65 transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-3 text-sm text-white/65">
            <p className="font-semibold text-white">Contact</p>
            <p>{studioSummary.email}</p>
            <p>{studioSummary.location}</p>
            <p className="pt-4 text-xs text-white/45">
              Copyright {new Date().getFullYear()} Orbit Studios. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
