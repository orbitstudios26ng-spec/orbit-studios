export async function generateWebsite(prompt: string, accessToken?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch("/api/generate", {
    method: "POST",
    headers,
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
