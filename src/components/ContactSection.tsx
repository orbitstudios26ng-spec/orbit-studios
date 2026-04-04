import { motion } from "framer-motion";
import { Send, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-mono text-sm mb-3 tracking-wider uppercase">Contact</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Let's Build Something</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Ready to launch? Tell us about your project and we'll make it happen.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-5 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {/* Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Email us</p>
                  <p className="text-sm text-muted-foreground">hello@orbitstudios.dev</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <MessageSquare className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Live chat</p>
                  <p className="text-sm text-muted-foreground">Available Mon–Fri, 9–5 EST</p>
                </div>
              </div>
              <div className="mt-8 p-4 rounded-xl border border-border bg-card/50">
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-mono">→</span> Average response time: <span className="text-foreground font-medium">under 2 hours</span>
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-card/50 border-border"
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-card/50 border-border"
                />
              </div>
              <Textarea
                placeholder="Tell us about your project..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="bg-card/50 border-border resize-none"
              />
              <Button type="submit" size="lg" className="w-full glow-primary group">
                Send Message
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
