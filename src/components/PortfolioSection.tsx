import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "NeonPay",
    category: "Fintech SaaS",
    description: "Payment dashboard with real-time analytics and team management.",
    color: "from-primary/20 to-primary/5",
  },
  {
    title: "Verdant Health",
    category: "Healthcare",
    description: "Patient portal with appointment scheduling and telemedicine.",
    color: "from-accent/20 to-accent/5",
  },
  {
    title: "ArcadeVault",
    category: "E-Commerce",
    description: "Retro gaming marketplace with 3D product showcases.",
    color: "from-primary/15 to-accent/10",
  },
  {
    title: "CloudSync",
    category: "Developer Tools",
    description: "Real-time collaboration platform for distributed engineering teams.",
    color: "from-accent/15 to-primary/10",
  },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-24 md:py-32">
      <div className="container px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-sm mb-3 tracking-wider uppercase">Portfolio</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Selected Work</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A curated look at projects we've launched into the digital universe.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              className="group relative rounded-xl border border-border bg-card overflow-hidden cursor-pointer transition-colors hover:border-primary/40"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`h-48 md:h-56 bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                <span className="text-3xl font-bold text-foreground/20 group-hover:text-foreground/30 transition-colors">
                  {project.title}
                </span>
              </div>
              <div className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-primary mb-1">{project.category}</p>
                  <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
