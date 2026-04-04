const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} <span className="text-foreground font-medium">Orbit Studios</span>. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Twitter", "GitHub", "LinkedIn"].map((s) => (
            <a key={s} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
