import { z } from "zod";

export const commissionSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  brandName: z.string().min(2, "Please enter a brand or studio name."),
  projectType: z.string().min(2, "Please choose the type of portfolio you need."),
  budget: z.string().min(2, "Please select a budget range."),
  timeline: z.string().min(2, "Please select a timeline."),
  goals: z.string().min(2, "Please describe the project."),
  references: z.string().optional(),
});

export type CommissionFormValues = z.infer<typeof commissionSchema>;

export async function submitCommission(values: CommissionFormValues) {
  const parsed = commissionSchema.parse(values);

  const response = await fetch("/api/commissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsed),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || "We could not send your request right now.");
  }

  return payload as {
    id: string;
    message: string;
    email?: {
      delivered: boolean;
      skipped: boolean;
      reason?: string;
    };
    fallbackMailto?: string;
    detail?: string;
  };
}
