import SiteLayout from "@/components/SiteLayout";
import CommissionForm from "@/components/CommissionForm";
import { pricingGroups } from "@/data/siteContent";

function getPricingItemLayout(title: string) {
  if (title === "Website Services") {
    return "grid gap-4 md:grid-cols-2 xl:grid-cols-3";
  }

  if (title === "Advanced Features" || title === "Hosting and Deployment") {
    return "flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory";
  }

  return "flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory";
}

function getPricingCardWidth(title: string) {
  if (title === "Website Services") {
    return "";
  }

  if (title === "Advanced Features" || title === "Hosting and Deployment") {
    return "min-w-[280px] md:min-w-[320px]";
  }

  return "min-w-[260px] md:min-w-[300px]";
}

export default function CommissionPage() {
  return (
    <SiteLayout>
      <section className="container grid gap-10 px-4 py-20 md:py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Commission form</p>
          <h1 className="text-4xl font-semibold md:text-6xl">Send a project brief</h1>
          <p className="text-sm leading-8 text-white/70">
            Use this form to share the project scope, budget, timeline, and any references that will help clarify the work.
          </p>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm leading-8 text-white/65">
            <p className="font-semibold text-white">Submission process</p>
            <p>1. The form is validated in the browser.</p>
            <p>2. The request is submitted directly to Formspree for email delivery.</p>
            <p>3. Formspree sends the submission to Orbit Studios' email inbox.</p>
            <p>4. If automatic delivery fails, a fallback email draft opens with the saved request details.</p>
          </div>
        </div>

        <CommissionForm />
      </section>

      <section className="container px-4 pb-24">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Service rates</p>
          <h2 className="text-3xl font-semibold md:text-5xl">Pricing guide for commissions.</h2>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {pricingGroups.map((group) => {
            const isCompactPair = group.title === "Maintenance" || group.title === "Design Services";
            return (
              <section
                key={group.title}
                className={`rounded-[2rem] border border-white/10 bg-white/5 p-6 ${
                  isCompactPair ? "xl:col-span-1" : "xl:col-span-2"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.32em] text-primary">{group.title}</p>
                <div className={`mt-5 ${getPricingItemLayout(group.title)}`}>
                  {group.items.map((item) => (
                    <article
                      key={item.name}
                      className={`h-full snap-start rounded-[1.5rem] border border-white/10 bg-black/20 p-5 ${getPricingCardWidth(group.title)}`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
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
    </SiteLayout>
  );
}
