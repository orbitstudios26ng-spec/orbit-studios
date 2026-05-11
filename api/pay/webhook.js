import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const { user_id, credits } = event.data.metadata;

    if (!user_id || !credits) {
      return res.status(400).json({ error: "Missing metadata" });
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user_id)
      .single();

    const currentCredits = existingUser?.credits ?? 0;

    const { error } = await supabase
      .from("users")
      .update({ credits: currentCredits + credits, paid: true })
      .eq("id", user_id);

    if (error) {
      console.error("Failed to add credits:", error);
      return res.status(500).json({ error: "Failed to update credits" });
    }

    console.log(`Added ${credits} credits to user ${user_id}`);
  }

  return res.status(200).json({ received: true });
}
