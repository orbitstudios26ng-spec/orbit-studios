import { useEffect, useState } from "react";
import { Bot, Copy, LoaderCircle, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      setSession(data.session);
      setUser(data.session?.user ?? null);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "email",
      },
    });

    if (error) {
      toast({
        title: "Unable to sign in",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data.url) {
      window.location.href = data.url;
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
  };

  const handleGenerate = async () => {
    if (!session?.access_token) {
      toast({
        title: "Sign in required",
        description: "Please sign in with Google to use the AI builder.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const result = await generateWebsite(prompt, session.access_token);
      setHtml(result.html);
      setModel(result.model);
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
    if (!html) {
      return;
    }

    await navigator.clipboard.writeText(html);
    toast({
      title: "Code copied",
      description: "The generated HTML has been copied to your clipboard.",
    });
  };

  return (
    <SiteLayout>
      <section className="container px-4 py-20 md:py-24">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">AI builder</p>
          <h1 className="text-4xl font-semibold md:text-6xl">Generate a website draft instantly.</h1>
          <p className="text-lg leading-8 text-white/70">
            Use the AI builder to create a polished website draft for your portfolio or studio. Sign in with Google to access AI generation.
          </p>
        </div>
      </section>

      <section className="container px-4 pb-24">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_0.8fr]">
          <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-primary">AI prompt</p>
                <p className="text-sm text-white/70">Describe the website you want the AI to build.</p>
              </div>
              {user ? (
                <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/80">
                  Signed in as {user.email}
                  <button className="ml-3 text-primary underline" type="button" onClick={handleSignOut}>
                    Sign out
                  </button>
                </div>
              ) : (
                <Button type="button" size="sm" className="rounded-full px-6" onClick={handleSignIn}>
                  Sign in with Google
                </Button>
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
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-8 text-sm leading-7 text-white/75">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.35em] text-primary">AI output</p>
              {model ? <p className="text-xs text-white/50">Model: {model}</p> : null}
            </div>
            {html ? (
              <pre className="mt-4 max-h-[60vh] overflow-auto rounded-3xl border border-white/10 bg-slate-950 p-4 text-xs text-white/70">
                {html}
              </pre>
            ) : (
              <div className="mt-4 text-white/70">Your generated website draft will appear here after you click generate.</div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
