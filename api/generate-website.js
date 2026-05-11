const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function normalizeGeneratedHtml(content) {
  if (!content || typeof content !== "string") {
    return "";
  }

  const trimmed = content.trim();
  if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
    return trimmed.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/, "").replace(/^~~~(?:html)?\s*/i, "").replace(/\s*~~~$/, "").trim();
  }

  return trimmed;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured." });
  }

  let body;
  try {
    body = req.body;
  } catch (error) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (prompt.length < 10) {
    return res.status(400).json({ error: "Please enter a more detailed prompt." });
  }

  try {
    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a professional web developer assistant. Return exactly one complete HTML document with embedded CSS and optional minimal JavaScript. Do not include markdown fences, commentary, or explanations. The result should be responsive, polished, and ready for iframe preview.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const payload = await openAiResponse.json();
    if (!openAiResponse.ok) {
      return res.status(openAiResponse.status).json({ error: payload.error?.message || "OpenAI request failed." });
    }

    const html = normalizeGeneratedHtml(payload?.choices?.[0]?.message?.content || "");
    if (!html) {
      return res.status(500).json({ error: "OpenAI returned empty website markup." });
    }

    return res.status(200).json({ html, model: OPENAI_MODEL });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Unable to generate website markup." });
  }
}
