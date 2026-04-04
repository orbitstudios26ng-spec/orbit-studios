import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const dataDir = path.join(rootDir, "data");
const dataFile = path.join(dataDir, "commissions.json");

loadEnvFile(path.join(rootDir, ".env"));

const port = Number(process.env.PORT || 8787);
const resendApiKey = process.env.RESEND_API_KEY || "";
const notificationEmail = process.env.COMMISSION_NOTIFICATION_EMAIL || "Orbitstudios26.ng@gmail.com";
const senderEmail = process.env.RESEND_FROM_EMAIL || "Orbit Studios <onboarding@resend.dev>";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function json(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function validateCommission(payload) {
  const requiredFields = ["fullName", "email", "brandName", "projectType", "budget", "timeline", "goals"];

  for (const field of requiredFields) {
    if (typeof payload[field] !== "string" || payload[field].trim().length < 2) {
      return `${field} is required.`;
    }
  }

  if (!payload.email.includes("@")) {
    return "A valid email address is required.";
  }

  if (payload.goals.trim().length < 2) {
    return "Project details are required.";
  }

  if (payload.references && typeof payload.references !== "string") {
    return "Reference links must be text.";
  }

  return null;
}

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, "[]", "utf8");
  }
}

async function saveCommission(payload) {
  await ensureStore();

  const current = JSON.parse(await fs.readFile(dataFile, "utf8"));
  const entry = {
    id: `ORB-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    ...payload,
  };

  current.unshift(entry);
  await fs.writeFile(dataFile, JSON.stringify(current, null, 2), "utf8");

  return entry;
}

function buildEmailHtml(entry) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2>New Orbit Studios commission request</h2>
      <p><strong>Reference ID:</strong> ${entry.id}</p>
      <p><strong>Submitted:</strong> ${entry.createdAt}</p>
      <hr />
      <p><strong>Full name:</strong> ${entry.fullName}</p>
      <p><strong>Email:</strong> ${entry.email}</p>
      <p><strong>Brand or studio:</strong> ${entry.brandName}</p>
      <p><strong>Project type:</strong> ${entry.projectType}</p>
      <p><strong>Budget:</strong> ${entry.budget}</p>
      <p><strong>Timeline:</strong> ${entry.timeline}</p>
      <p><strong>Goals:</strong><br />${entry.goals.replace(/\n/g, "<br />")}</p>
      <p><strong>References:</strong><br />${(entry.references || "None provided").replace(/\n/g, "<br />")}</p>
    </div>
  `;
}

function buildEmailText(entry) {
  return [
    "New Orbit Studios commission request",
    `Reference ID: ${entry.id}`,
    `Submitted: ${entry.createdAt}`,
    `Full name: ${entry.fullName}`,
    `Email: ${entry.email}`,
    `Brand or studio: ${entry.brandName}`,
    `Project type: ${entry.projectType}`,
    `Budget: ${entry.budget}`,
    `Timeline: ${entry.timeline}`,
    `Goals: ${entry.goals}`,
    `References: ${entry.references || "None provided"}`,
  ].join("\n");
}

function buildFallbackMailto(entry) {
  const subject = `Commission Request ${entry.id} - ${entry.fullName}`;
  return `mailto:${notificationEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildEmailText(entry))}`;
}

async function sendNotificationEmail(entry) {
  if (!resendApiKey) {
    return {
      delivered: false,
      skipped: true,
      reason: "Automatic email delivery is not configured yet.",
      fallbackMailto: buildFallbackMailto(entry),
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: senderEmail,
      to: [notificationEmail],
      reply_to: entry.email,
      subject: `New Orbit Studios commission from ${entry.fullName}`,
      html: buildEmailHtml(entry),
      text: buildEmailText(entry),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Email delivery failed: ${detail}`);
  }

  return {
    delivered: true,
    skipped: false,
    fallbackMailto: "",
  };
}

async function serveStatic(requestPath, response) {
  const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.join(distDir, normalizedPath);

  try {
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      return serveStatic(path.join(normalizedPath, "index.html"), response);
    }

    const extension = path.extname(filePath);
    const contentTypes = {
      ".html": "text/html; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
    };
    const body = await fs.readFile(filePath);

    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
    });
    response.end(body);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/api/health") {
    return json(response, 200, { status: "ok", service: "orbit-studios-api" });
  }

  if (request.method === "POST" && url.pathname === "/api/commissions") {
    try {
      const buffers = [];
      for await (const chunk of request) {
        buffers.push(chunk);
      }

      const raw = Buffer.concat(buffers).toString("utf8");
      const payload = JSON.parse(raw || "{}");
      const validationError = validateCommission(payload);

      if (validationError) {
        return json(response, 400, { error: validationError });
      }

      const entry = await saveCommission(payload);
      const emailResult = await sendNotificationEmail(entry).catch((error) => ({
        delivered: false,
        skipped: false,
        reason: error instanceof Error ? error.message : "Unknown email error",
        fallbackMailto: buildFallbackMailto(entry),
      }));

      return json(response, emailResult.delivered ? 201 : 202, {
        id: entry.id,
        message: emailResult.delivered
          ? "Commission request emailed successfully."
          : "Commission request saved successfully.",
        email: emailResult,
        fallbackMailto: emailResult.fallbackMailto,
      });
    } catch (error) {
      return json(response, 500, {
        error: "Unable to process this commission request.",
        detail: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  const fileServed = await serveStatic(url.pathname, response);
  if (fileServed) {
    return;
  }

  const fallbackServed = await serveStatic("/index.html", response);
  if (fallbackServed) {
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
});

server.listen(port, () => {
  console.log(`Orbit Studios server running at http://localhost:${port}`);
});
