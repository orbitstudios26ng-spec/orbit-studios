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

/**
 * Submit commission via backend API (saves to JSON and sends email)
 */
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

/**
 * Submit commission via Formspree as alternative method
 */
export async function submitToFormspree(values: CommissionFormValues) {
  const formspreeId = import.meta.env.VITE_FORMSPREE_ID || "xaqvagae";
  
  const formData = new FormData();
  formData.append("fullName", values.fullName);
  formData.append("email", values.email);
  formData.append("brandName", values.brandName);
  formData.append("projectType", values.projectType);
  formData.append("budget", values.budget);
  formData.append("timeline", values.timeline);
  formData.append("goals", values.goals);
  if (values.references) {
    formData.append("references", values.references);
  }

  formData.append("_replyto", values.email);
  formData.append("_subject", "Orbit Studios commission request");

  const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.ok === false) {
    const message = payload?.error?.message || payload?.errors?.[0]?.message || "Failed to submit form to email service.";
    throw new Error(message);
  }

  return {
    id: `FORM-${Date.now()}`,
    message: "Commission request sent successfully!",
  };
}
