import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { featuredProjects } from "@/data/siteContent";

export default function PortfolioPage() {
  return (
    <SiteLayout>
      <section className="container px-4 py-20 md:py-24">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Portfolio</p>
          <h1 className="text-4xl font-semibold md:text-6xl">Selected public work.</h1>
          <p className="text-lg leading-8 text-white/70">
            This page only lists work that is available to review publicly. The goal is to keep the portfolio accurate and useful rather than padded with placeholder projects.
          </p>
        </div>
      </section>

      <section className="container px-4 pb-24">
        <div className="grid gap-6 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <article key={project.title} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <div className="relative h-80">
                <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-tr ${project.accent}`} />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.22em] text-primary">
                    {project.category}
                  </span>
                  <span className="text-xs text-white/50">{project.status}</span>
                </div>
                <h2 className="text-2xl font-semibold">{project.title}</h2>
                <p className="text-sm leading-7 text-white/65">{project.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button asChild className="rounded-full">
                  {project.external ? (
                    <a href={project.href} target="_blank" rel="noreferrer">
                      {project.linkLabel}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link to={project.href}>
                      {project.linkLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
