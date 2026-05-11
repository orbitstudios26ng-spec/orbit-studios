import { createClient } from "@supabase/supabase-js";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FREE_LIMIT = 5;

if (!OPENROUTER_API_KEY) {
  throw new Error("Missing OPENROUTER_API_KEY in environment variables.");
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function parseBearerToken(header) {
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = parseBearerToken(req.headers.authorization || "");
  if (!token) {
    return res.status(401).json({ error: "Missing authorization token." });
  }

  const body = await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  }).catch(() => null);

  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt || prompt.length < 10) {
    return res.status(400).json({ error: "Please enter a more detailed prompt." });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ error: "Unable to verify user session." });
  }

  const user = userData.user;
  const userId = user.id;

  const { data: existingUser, error: existingUserError } = await supabase
    .from("users")
    .select("id, free_uses, paid")
    .eq("id", userId)
    .maybeSingle();

  if (existingUserError) {
    return res.status(500).json({ error: "Unable to load user usage state." });
  }

  let usageRecord = existingUser;
  if (!usageRecord) {
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({ id: userId, email: user.email, free_uses: 0, paid: false })
      .single();

    if (createError) {
      return res.status(500).json({ error: "Unable to create user record." });
    }

    usageRecord = newUser;
  }

  if (!usageRecord.paid && usageRecord.free_uses >= FREE_LIMIT) {
    return res.status(403).json({ error: "Free usage limit reached. Upgrade to continue." });
  }

  const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-5",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1200,
      temperature: 0.7,
    }),
  });

  const openRouterPayload = await openRouterResponse.json().catch(() => null);
  if (!openRouterResponse.ok) {
    return res.status(openRouterResponse.status).json({ error: openRouterPayload?.error || "OpenRouter request failed." });
  }

  if (!usageRecord.paid) {
    await supabase
      .from("users")
      .update({ free_uses: usageRecord.free_uses + 1 })
      .eq("id", userId);
  }

  return res.status(200).json({
    ...openRouterPayload,
    usage: {
      free_uses: usageRecord.free_uses + (usageRecord.paid ? 0 : 1),
      paid: usageRecord.paid,
      limit: FREE_LIMIT,
    },
  });
}
