#!/usr/bin/env node

import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ARTICLE_SCHEMA,
  DEFAULT_MODELS,
  buildPrompt,
  extractExistingPosts,
  insertArticle,
  listPortfolioImages,
  readBlogSource,
  validateArticle,
  verifySourceUrls,
  writeBlogSource,
} from "./daily-article-lib.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run") || process.env.DAILY_ARTICLE_DRY_RUN === "true";
const outputPath = process.env.DAILY_ARTICLE_OUTPUT || path.join(repoRoot, "work", "daily-article-candidate.json");
const date = process.env.DAILY_ARTICLE_DATE || new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

function safeLog(message, metadata = {}) {
  console.log(JSON.stringify({ message, ...metadata }));
}

function fail(message) {
  throw new Error(message);
}

async function openRouterError(response) {
  try {
    const payload = await response.clone().json();
    const code = typeof payload?.error?.code === "string" ? payload.error.code : "unknown";
    const message = typeof payload?.error?.message === "string" ? payload.error.message : "No provider detail";
    return `${code}: ${message.replace(/[\r\n]+/g, " ").slice(0, 500)}`;
  } catch {
    return "unparseable provider response";
  }
}

async function requestArticle(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) fail("OPENROUTER_API_KEY is not configured");

  const configured = process.env.OPENROUTER_MODELS?.split(",").map((model) => model.trim()).filter(Boolean);
  const models = configured?.length ? configured : DEFAULT_MODELS;
  const sharedBody = {
    messages: [
      {
        role: "system",
        content: "You are the editorial engine for AutomateMeJay. Research before writing. Follow the JSON schema exactly and cite only primary authoritative sources you actually inspected.",
      },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "automatemejay_daily_article", strict: true, schema: ARTICLE_SCHEMA },
    },
    plugins: [
      { id: "web", engine: "exa", max_results: 5 },
      { id: "response-healing" },
    ],
    provider: {
      require_parameters: true,
      data_collection: "deny",
      allow_fallbacks: true,
    },
    temperature: 0.35,
    max_tokens: 12_000,
  };

  let response;
  let lastError = "No model was attempted";
  modelLoop: for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://automatemejay.com",
          "X-Title": "AutomateMeJay Daily Article",
        },
        body: JSON.stringify({ model, ...sharedBody }),
        signal: AbortSignal.timeout(12 * 60 * 1_000),
      });
      if (response.ok) break modelLoop;
      lastError = `status ${response.status}: ${await openRouterError(response)}`;
      if (attempt === 1 && [429, 502, 503].includes(response.status)) {
        const retryAfter = Math.min(Number(response.headers.get("retry-after")) || 10, 30);
        safeLog("OpenRouter request will retry", { model, status: response.status, retryAfterSeconds: retryAfter });
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1_000));
        continue;
      }
      safeLog("OpenRouter model fallback", { model, status: response.status });
      break;
    }
  }
  if (!response?.ok) fail(`OpenRouter request failed for every configured model: ${lastError}`);

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) fail("OpenRouter returned no article content");
  let article;
  try {
    article = JSON.parse(content);
    article.sections = article.sections?.map(({ bullets, ...section }) => (
      bullets?.length ? { ...section, bullets } : section
    ));
  } catch {
    fail("OpenRouter returned invalid JSON");
  }
  return {
    article,
    model: payload.model ?? "unknown",
    usage: {
      promptTokens: payload.usage?.prompt_tokens ?? null,
      completionTokens: payload.usage?.completion_tokens ?? null,
      cost: payload.usage?.cost ?? null,
      webSearchRequests: payload.usage?.server_tool_use?.web_search_requests ?? null,
    },
  };
}

const blogSource = await readBlogSource(repoRoot);
const existingPosts = extractExistingPosts(blogSource);
if (existingPosts.some((post) => post.published === date)) {
  safeLog("A post already exists for this date; no action taken", { date });
  process.exit(0);
}

const images = await listPortfolioImages(repoRoot);
const prompt = buildPrompt({ date, existingPosts, images });
const { article, model, usage } = await requestArticle(prompt);
const { words } = validateArticle(article, { date, existingPosts, images });
await verifySourceUrls(article.sources);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ article, model, usage }, null, 2)}\n`, { mode: 0o600 });
if (!dryRun) await writeBlogSource(repoRoot, insertArticle(blogSource, article));

if (process.env.GITHUB_OUTPUT) {
  const safeModel = String(model).replace(/[\r\n]/g, " ");
  await appendFile(process.env.GITHUB_OUTPUT, `slug=${article.slug}\ntitle=${article.title}\nmodel=${safeModel}\nwords=${words}\ndry_run=${dryRun}\n`);
}
safeLog("Daily article candidate passed deterministic validation", {
  date,
  dryRun,
  slug: article.slug,
  title: article.title,
  model,
  words,
  usage,
});
