import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Send } from "lucide-react";
import { commissionSchema, submitCommission, type CommissionFormValues } from "@/lib/commission";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const budgetOptions = ["NGN 4,000 - 12,000", "NGN 12,000 - 20,000", "NGN 25,000 - 40,000", "Custom scope"];
const timelineOptions = ["1-2 weeks", "3-4 weeks", "1-2 months", "Flexible"];
const projectTypes = [
  "Fashion portfolio",
  "Photography portfolio",
  "Creative studio website",
  "Architecture portfolio",
  "Personal brand portfolio",
];

function buildFallbackMailto(values: CommissionFormValues) {
  const lines = [
    "New commission request",
    `Full name: ${values.fullName}`,
    `Email: ${values.email}`,
    `Brand or studio: ${values.brandName}`,
    `Project type: ${values.projectType}`,
    `Budget: ${values.budget}`,
    `Timeline: ${values.timeline}`,
    `Goals: ${values.goals}`,
    `References: ${values.references || "None provided"}`,
  ];

  return `mailto:Orbitstudios26.ng@gmail.com?subject=${encodeURIComponent(`Commission Request - ${values.fullName}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

export default function CommissionForm() {
  const { toast } = useToast();
  const [lastReference, setLastReference] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      fullName: "",
      email: "",
      brandName: "",
      projectType: "",
      budget: "",
      timeline: "",
      goals: "",
      references: "",
    },
  });

  const onSubmit = async (values: CommissionFormValues) => {
    try {
      const result = await submitCommission(values);
      setLastReference(result.id);
      if (result.email?.delivered) {
        toast({
          title: "Commission request sent",
          description: "Your brief was emailed to Orbit Studios successfully.",
        });
      } else {
        window.location.href = result.fallbackMailto || buildFallbackMailto(values);
        toast({
          title: "Commission saved",
          description: "Your brief was saved. An email draft has been opened as a fallback so you can send it directly.",
        });
      }
      reset();
    } catch (error) {
      window.location.href = buildFallbackMailto(values);
      toast({
        title: "Direct email fallback opened",
        description:
          error instanceof Error
            ? `${error.message} A fallback email draft has been opened so you can still send the brief.`
            : "The automatic submission failed. A fallback email draft has been opened so you can still send the brief.",
      });
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur xl:p-8">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name" error={errors.fullName?.message}>
            <Input {...register("fullName")} className="border-white/10 bg-black/20" />
          </Field>
          <Field label="Email address" error={errors.email?.message}>
            <Input {...register("email")} type="email" className="border-white/10 bg-black/20" />
          </Field>
          <Field label="Brand or studio name" error={errors.brandName?.message}>
            <Input {...register("brandName")} className="border-white/10 bg-black/20" />
          </Field>
          <Field label="Portfolio type" error={errors.projectType?.message}>
            <select
              {...register("projectType")}
              className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
            >
              <option value="">Select one</option>
              {projectTypes.map((option) => (
                <option key={option} value={option} className="bg-slate-950">
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Budget range" error={errors.budget?.message}>
            <select
              {...register("budget")}
              className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
            >
              <option value="">Select one</option>
              {budgetOptions.map((option) => (
                <option key={option} value={option} className="bg-slate-950">
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Preferred timeline" error={errors.timeline?.message}>
            <select
              {...register("timeline")}
              className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
            >
              <option value="">Select one</option>
              {timelineOptions.map((option) => (
                <option key={option} value={option} className="bg-slate-950">
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Project goals" error={errors.goals?.message}>
          <Textarea
            {...register("goals")}
            rows={7}
            className="resize-none border-white/10 bg-black/20"
            placeholder="Describe the project, what you need, and any important context."
          />
        </Field>

        <Field label="Reference links" error={errors.references?.message}>
          <Textarea
            {...register("references")}
            rows={3}
            className="resize-none border-white/10 bg-black/20"
            placeholder="Paste links to references, moodboards, or existing portfolios you want us to note."
          />
        </Field>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/65">
            {lastReference
              ? `Latest request ID: ${lastReference}`
              : "If automatic email is unavailable, a ready-to-send email draft will open instead."}
          </div>
          <Button type="submit" size="lg" className="rounded-full px-7" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send commission brief
          </Button>
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="text-white/85">{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
