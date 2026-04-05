export async function generateWebsite(prompt: string) {
  const response = await fetch("/api/generate-website", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || "Unable to generate website markup.");
  }

  return payload as {
    html: string;
    model: string;
  };
}
