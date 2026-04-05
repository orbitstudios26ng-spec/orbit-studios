import { useState } from "react";
import { Bot, Copy, LoaderCircle, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateWebsite } from "@/lib/aiBuilder";
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

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const result = await generateWebsite(prompt);
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
      description: "Generated HTML has been copied to your clipboard.",
    });
  };

  return (
    <SiteLayout>
      <section className="container px-4 py-20 md:py-24">
        <div className="max-w-4xl space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">AI builder</p>
          <h1 className="text-4xl font-semibold md:text-6xl">Generate a website draft from a prompt.</h1>
          <p className="text-lg leading-8 text-white/70">
            This tool uses the OpenAI Responses API to turn a short brief into a complete HTML document that you can preview immediately and refine further.
          </p>
        </div>
      </section>

      <section className="container grid gap-8 px-4 pb-24 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-primary" />
              <p className="text-lg font-semibold">Prompt</p>
            </div>

            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={12}
              className="mt-5 resize-none border-white/10 bg-black/20"
              placeholder="Describe the kind of website you want the AI to generate."
            />

            <div className="mt-5 flex flex-wrap gap-3">
              {starterPrompts.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPrompt(item)}
                  className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-left text-xs text-white/75 transition hover:border-primary/40 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleGenerate} disabled={isGenerating || prompt.trim().length < 10} className="rounded-full px-6">
                {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate website
              </Button>
              <Button variant="outline" onClick={handleCopy} disabled={!html} className="rounded-full border-white/15 bg-transparent px-6">
                <Copy className="h-4 w-4" />
                Copy HTML
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm leading-8 text-white/65">
            <p className="font-semibold text-white">How it works</p>
            <p>1. Write a prompt describing the website you want.</p>
            <p>2. The server sends that prompt to OpenAI using the Responses API.</p>
            <p>3. The generated HTML is returned to this page for preview and copying.</p>
            <p>4. Add `OPENAI_API_KEY` to your environment before using this feature.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">Preview</p>
                <p className="text-sm text-white/60">{model ? `Model: ${model}` : "No draft generated yet."}</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
              {html ? (
                <iframe
                  title="AI website preview"
                  className="h-[560px] w-full bg-white"
                  sandbox="allow-scripts"
                  srcDoc={html}
                />
              ) : (
                <div className="flex h-[560px] items-center justify-center px-6 text-center text-sm text-white/55">
                  Generated website previews will appear here.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-lg font-semibold">Generated HTML</p>
            <pre className="mt-5 max-h-[420px] overflow-auto rounded-[1.5rem] border border-white/10 bg-black/30 p-5 text-xs leading-6 text-white/75">
              <code>{html || "Generated HTML will appear here."}</code>
            </pre>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
