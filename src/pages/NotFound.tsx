import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SiteLayout from "@/components/SiteLayout";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <SiteLayout>
      <section className="container flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">404</p>
        <h1 className="mt-4 text-5xl font-semibold">That page does not exist.</h1>
        <p className="mt-4 max-w-xl text-sm leading-8 text-white/65">
          Try heading back to the portfolio index or the commission page.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/portfolio" className="rounded-full border border-white/10 px-6 py-3 text-sm text-white/80">
            View portfolios
          </Link>
          <Link to="/commission" className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">
            Start a commission
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
