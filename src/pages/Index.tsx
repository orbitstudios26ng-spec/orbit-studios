import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { featuredProjects, pricingGroups, processSteps, services, studioSummary } from "@/data/siteContent";

function getPricingItemLayout(title: string) {
  if (title === "Website Services") {
    return "grid gap-4 sm:grid-cols-2 xl:grid-cols-3";
  }
  return "grid gap-4 sm:flex sm:overflow-x-auto sm:pb-2 sm:snap-x sm:snap-mandatory";
}

function getPricingCardWidth(title: string) {
  if (title === "Website Services") return "";
  return "sm:min-w-[280px] lg:min-w-[320px]";
}

export default function HomePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,173,76,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(120,88,26,0.16),transparent_32%)]" />
        <div className="container relative grid gap-10 px-4 py-14 md:grid-cols-[1.2fr_0.8fr] md:py-28">
          <div className="space-y-7">
            <div className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-primary">
              Orbit Studios
            </div>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl md:text-7xl">
                Portfolio websites built with clarity, restraint, and purpose.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                {studioSummary.mission}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8 text-base">
                <Link to="/commission">
                  Start a commission
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-white/15 bg-white/5 px-8 text-base">
                <Link to="/about">About the studio</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              {["Professional visual direction", "Straightforward inquiry flow", "Live delivery to studio email"].map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Process card — hidden on small screens */}
          <div className="hidden md:block rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Process</p>
            <div className="mt-6 space-y-5">
              {processSteps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30 text-sm text-white/80">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-7 text-white/70">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="container px-4 py-16">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Selected work</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl md:text-5xl">Public projects currently available to review.</h2>
          </div>
          <Button asChild variant="ghost" className="hidden rounded-full text-white/70 md:inline-flex">
            <Link to="/portfolio">View portfolio</Link>
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <article
              key={project.title}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-xl shadow-black/20"
            >
              <div className="relative h-56 overflow-hidden sm:h-72">
                <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className={`absolute inset-0 bg-gradient-to-tr ${project.accent}`} />
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">{project.category}</p>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">{project.status}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold sm:text-2xl">{project.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">{project.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-black/30 px-3 py-1 text-xs text-white/60">{tag}</span>
                  ))}
                </div>
                <Button asChild variant="outline" className="rounded-full border-white/15 bg-transparent">
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
        <div className="mt-6 md:hidden">
          <Button asChild variant="outline" className="w-full rounded-full border-white/15">
            <Link to="/portfolio">View portfolio</Link>
          </Button>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-white/10 bg-black/20">
        <div className="container grid gap-4 px-4 py-16 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <div key={service.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-lg font-semibold">{service.title}</p>
              <p className="mt-3 text-sm leading-7 text-white/65">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container px-4 py-16">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Pricing</p>
          <h2 className="text-2xl font-semibold sm:text-3xl md:text-5xl">Current service rates.</h2>
          <p className="text-base leading-8 text-white/70 sm:text-lg">
            These prices reflect the services currently being offered. Final quotes depend on scope, content, and the level of interactivity required.
          </p>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          {pricingGroups.map((group) => {
            const isCompactPair = group.title === "Maintenance" || group.title === "Design Services";
            return (
              <section
                key={group.title}
                className={`rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6 ${isCompactPair ? "xl:col-span-1" : "xl:col-span-2"}`}
              >
                <p className="text-xs uppercase tracking-[0.32em] text-primary">{group.title}</p>
                <div className={`mt-5 ${getPricingItemLayout(group.title)}`}>
                  {group.items.map((item) => (
                    <article
                      key={item.name}
                      className={`h-full snap-start rounded-[1.5rem] border border-white/10 bg-black/20 p-5 ${getPricingCardWidth(group.title)}`}
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm font-semibold text-primary">{item.price}</p>
                      </div>
                      <div className="mt-3 space-y-2 text-sm leading-7 text-white/70">
                        {item.details.map((detail) => (
                          <p key={detail}>{detail}</p>
                        ))}
                        {item.note ? <p className="text-white/55">{item.note}</p> : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {/* Approach */}
      <section className="container px-4 pb-20 pt-16">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-primary">Approach</p>
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-5xl">A smaller body of work, presented honestly.</h2>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm leading-8 text-white/70">
            <p>
              Orbit Studios is still growing. This site reflects that directly by showing the public work that is available now instead of filling the page with placeholder portfolios, exaggerated claims, or manufactured testimonials.
            </p>
            <p className="mt-4">
              Additional client work can be shared privately where appropriate, but the public site stays focused, accurate, and professional.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
