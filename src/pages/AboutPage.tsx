import SiteLayout from "@/components/SiteLayout";
import { services, studioSummary } from "@/data/siteContent";

export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="container px-4 py-20 md:py-24">
        <div className="max-w-4xl space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">About</p>
          <h1 className="text-4xl font-semibold md:text-6xl">{studioSummary.tagline}</h1>
          <p className="text-lg leading-8 text-white/70">{studioSummary.mission}</p>
        </div>
      </section>

      <section className="container px-4 pb-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">Studio overview</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              Orbit Studios focuses on portfolio websites for creative professionals and small brands that need a cleaner, more credible online presence. The goal is straightforward: present the work clearly, communicate the service properly, and make inquiries easier to manage.
            </p>
            <p className="mt-4 text-sm leading-8 text-white/65">
              The studio is still in an early stage of growth, so the site is intentionally restrained. It shows the work that is available publicly, explains the service honestly, and keeps the commission process direct.
            </p>
          </div>
          <div className="grid gap-4">
            {services.map((service) => (
              <div key={service.title} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                <p className="text-lg font-semibold">{service.title}</p>
                <p className="mt-2 text-sm leading-7 text-white/65">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
