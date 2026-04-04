import { motion } from "framer-motion";
import { Code2, Bot, Palette, Rocket, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Code2,
    title: "Custom Development",
    description: "Hand-crafted websites built by our expert team, tailored to your vision.",
    features: ["Pixel-perfect design", "Responsive & accessible", "Performance optimized"],
  },
  {
    icon: Bot,
    title: "AI-Powered Build",
    description: "Describe your dream site and our AI generates it in minutes.",
    features: ["Instant prototyping", "Smart layout engine", "Iterative refinement"],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Strategic design systems that elevate brand identity and user experience.",
    features: ["Brand strategy", "Design systems", "User research"],
  },
  {
    icon: Rocket,
    title: "Launch & Scale",
    description: "Deployment, hosting, analytics, and ongoing support to keep you in orbit.",
    features: ["CI/CD pipelines", "SEO optimization", "24/7 monitoring"],
  },
];

const pricing = [
  {
    name: "Starter",
    price: "$1,500",
    period: "one-time",
    description: "Perfect for landing pages and small business sites.",
    features: ["Up to 5 pages", "Mobile responsive", "Contact form", "1 revision round"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$4,500",
    period: "one-time",
    description: "For growing businesses that need a full web presence.",
    features: ["Up to 15 pages", "CMS integration", "Custom animations", "3 revision rounds", "SEO setup"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "quote",
    description: "Complex applications and platforms, built to scale.",
    features: ["Unlimited pages", "Custom backend", "API integrations", "Dedicated support", "SLA guarantee"],
    highlight: false,
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent pointer-events-none" />

      <div className="container px-4 relative z-10">
        {/* Services */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-primary font-mono text-sm mb-3 tracking-wider uppercase">Services</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What We Do</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From concept to launch — and beyond.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-32">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full bg-card/50 backdrop-blur border-border hover:border-primary/30 transition-colors">
                <CardHeader>
                  <service.icon className="w-8 h-8 text-primary mb-3" />
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-secondary-foreground">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pricing */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-primary font-mono text-sm mb-3 tracking-wider uppercase">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            No hidden fees. Pick a plan, or get a custom quote.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricing.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`h-full flex flex-col ${
                  plan.highlight
                    ? "border-primary glow-primary bg-card"
                    : "bg-card/50 border-border"
                }`}
              >
                <CardHeader>
                  <p className="text-xs font-mono text-primary uppercase tracking-wider">{plan.name}</p>
                  <CardTitle className="text-3xl font-bold mt-2">
                    {plan.price}
                    {plan.period !== "quote" && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">/ {plan.period}</span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.price === "Custom" ? "Get a Quote" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
