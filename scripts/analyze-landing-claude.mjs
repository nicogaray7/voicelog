#!/usr/bin/env node
/**
 * Sends landing/index.html + landing/styles.css to Anthropic Messages API for a structured review.
 *
 * Usage:
 *   export ANTHROPIC_API_KEY=sk-ant-...
 *   node scripts/analyze-landing-claude.mjs
 *
 * Optional:
 *   ANTHROPIC_MODEL=claude-sonnet-4-20250514 node scripts/analyze-landing-claude.mjs
 *
 * @see https://platform.claude.com/docs/en/api/messages
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const apiKey = process.env.ANTHROPIC_API_KEY;
const model =
  process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

if (!apiKey) {
  console.error(
    "Missing ANTHROPIC_API_KEY. Create a key at https://console.anthropic.com/ then:\n  export ANTHROPIC_API_KEY=sk-ant-...\n  node scripts/analyze-landing-claude.mjs",
  );
  process.exit(1);
}

const html = fs.readFileSync(path.join(root, "landing", "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "landing", "styles.css"), "utf8");

const prompt = `You are a senior product marketer and UX lead reviewing a B2B SaaS waitlist landing page (VoiceLog: voice-to-CRM for field sales).

Analyze the following static assets. Respond in **French**.

Structure your answer with these sections:
1. **Synthèse** (3–5 bullets)
2. **Points forts** (copy, structure, conversion, accessibilité, SEO/meta, i18n EN/ES/FR)
3. **Axes d’amélioration prioritaires** (top 5, actionnables)
4. **Risques / conformité** (privacy, claims chiffrées, attentes utilisateur)
5. **Score approximatif** /10 sur la clarté valeur + friction formulaire (justifie en une phrase)

--- index.html ---
${html.slice(0, 120000)}
--- styles.css ---
${css.slice(0, 80000)}
`;

const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  }),
});

const data = await res.json().catch(() => ({}));

if (!res.ok) {
  console.error("API error", res.status, JSON.stringify(data, null, 2));
  process.exit(1);
}

const text = data.content?.[0]?.text;
if (!text) {
  console.error("Unexpected response:", JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log(text);
