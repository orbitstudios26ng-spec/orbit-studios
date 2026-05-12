import { useEffect, useState } from "react";
import { Bot, Copy, Download, LoaderCircle, Sparkles, Zap } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateWebsite } from "@/lib/aiBuilder";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const starterPrompts = [
  "Create a black and gold fashion portfolio landing page with a hero section, featured work cards, pricing, and a contact section.",
  "Build a minimal architecture studio website with a strong grid layout, project gallery, studio profile, and inquiry form.",
  "Generate a premium photography portfolio homepage with large images, service packages, testimonials, and a booking section.",
];

export default function AiBuilderPage() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(starterPrompts[0]);
  const [html, setHtml] = useState("");
  const [model, setModel] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [freeUses, setFreeUses] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) fetchUserData(data.session.user.id);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("credits, free_uses")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setCredits(data.credits ?? 0);
      setFreeUses(data.free_uses ?? 0);
    }
  };

  const handleSignIn = async () => {
    if (!userEmail.trim()) {
      toast({
        title: "Email required",
        description: "Enter your email address to receive a sign-in link.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSigningIn(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: userEmail,
      });

      if (error) {
        toast({
          title: "Unable to send sign-in email",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Check your inbox",
        description: "We sent a sign-in link to your email.",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSession(null);
    setUser(null);
    setHtml("");
    setModel("");
    setCredits(null);
    setFreeUses(null);
  };

  const handleBuyCredits = async () => {
    if (!session?.access_token) return;

    try {
      setIsBuying(true);
      const res = await fetch("/api/pay/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ credits: 10 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment initiation failed");
      }

      window.location.href = data.authorization_url;
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Could not initiate payment.",
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  const handleGenerate = async () => {
    if (!session?.access_token) {
      toast({
        title: "Sign in required",
        description: "Please sign in with your email to use the AI builder.",
        variant: "destructive",
      });
      return;
    }

    const FREE_LIMIT = 3;
    if ((freeUses ?? 0) >= FREE_LIMIT && (credits ?? 0) <= 0) {
      toast({
        title: "No credits remaining",
        description: "You've used your free generations. Buy credits to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const result = await generateWebsite(prompt, session.access_token);
      setHtml(result.html);
      setModel(result.model);

      if (user) fetchUserData(user.id);

      toast({
        title: "Website generated",
        description: `Draft generated with ${result.model}.`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Unable to generate website markup.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!html) return;
    await navigator.clipboard.writeText(html);
    toast({
      title: "Code copied",
      description: "The generated HTML has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orbit-website.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const FREE_LIMIT = 3;
  const freeLeft = Math.max(0, FREE_LIMIT - (freeUses ?? 0));

  return (
    <SiteLayout>
      <section className="container px-4 py-20 md:py-24">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">AI builder</p>
          <h1 className="text-4xl font-semibold md:text-6xl">Generate a website draft instantly.</h1>
          <p className="text-lg leading-8 text-white/70">
            Use the AI builder to create a polished website draft for your portfolio or studio. Sign in with your email to access AI generation.
          </p>
        </div>
      </section>

      <section className="container px-4 pb-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-primary">AI prompt</p>
                <p className="text-sm text-white/70">Describe the website you want the AI to build.</p>
              </div>

              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/80">
                    {user.email}
                    <button className="ml-3 text-primary underline" type="button" onClick={handleSignOut}>
                      Sign out
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm">
                    <span className="text-white/60">
                      {(freeUses ?? 0) < FREE_LIMIT
                        ? `${freeLeft} free generation${freeLeft !== 1 ? "s" : ""} left`
                        : `${credits ?? 0} credit${(credits ?? 0) !== 1 ? "s" : ""}`}
                    </span>
                    <button
                      type="button"
                      onClick={handleBuyCredits}
                      disabled={isBuying}
                      className="flex items-center gap-1 text-primary underline"
                    >
                      {isBuying ? <LoaderCircle className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                      Buy credits
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Input
                    type="email"
                    value={userEmail}
                    onChange={(event) => setUserEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="min-w-[240px] border-white/10 bg-black/20"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-full px-6"
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                  >
                    {isSigningIn ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                    Email sign-in
                  </Button>
                </div>
              )}
            </div>

            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={8}
              className="border-white/10 bg-black/20"
            />

            <div className="flex flex-wrap gap-3">
              {starterPrompts.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPrompt(item)}
                  className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                size="lg"
                className="rounded-full px-7"
                onClick={handleGenerate}
                disabled={isGenerating || prompt.trim().length < 10}
              >
                {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                Generate website
              </Button>
              <Button type="button" size="lg" className="rounded-full px-7" onClick={handleCopy} disabled={!html}>
                <Copy className="h-4 w-4" />
                Copy HTML
              </Button>
              <Button type="button" size="lg" className="rounded-full px-7" onClick={handleDownload} disabled={!html}>
                <Download className="h-4 w-4" />
                Download HTML
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-8 text-sm leading-7 text-white/75">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.35em] text-primary">AI output</p>
              {model ? <p className="text-xs text-white/50">Model: {model}</p> : null}
            </div>
            {html ? (
              <div className="mt-4 flex flex-col gap-3">
                <div className="relative w-full overflow-hidden rounded-3xl border border-white/10" style={{ height: "75vh" }}>
                  <iframe
                    srcDoc={html}
                    className="absolute inset-0 h-full w-full"
                    sandbox="allow-scripts"
                    title="Generated website preview"
                  />
                </div>
                <pre className="max-h-[20vh] overflow-auto rounded-3xl border border-white/10 bg-slate-950 p-4 text-xs text-white/70">
                  {html}
                </pre>
              </div>
            ) : (
              <div className="mt-4 text-white/70">Your generated website draft will appear here after you click generate.</div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
