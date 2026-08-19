#!/usr/bin/env node

const slug = process.argv[2];
const expectedTitle = process.argv[3];
const baseUrl = (process.env.DAILY_ARTICLE_BASE_URL || "https://automatemejay.com").replace(/\/$/, "");
if (!slug || !expectedTitle) throw new Error("Usage: verify-daily-article.mjs <slug> <title>");

const deadline = Date.now() + 15 * 60 * 1_000;
const articleUrl = `${baseUrl}/blog/${slug}`;
const sitemapUrl = `${baseUrl}/sitemap.xml`;

while (Date.now() < deadline) {
  try {
    const [articleResponse, sitemapResponse] = await Promise.all([
      fetch(articleUrl, { redirect: "follow", signal: AbortSignal.timeout(15_000) }),
      fetch(sitemapUrl, { redirect: "follow", signal: AbortSignal.timeout(15_000) }),
    ]);
    const [html, sitemap] = await Promise.all([articleResponse.text(), sitemapResponse.text()]);
    const titleOk = html.includes(expectedTitle.replaceAll("&", "&amp;")) || html.includes(expectedTitle);
    const canonicalOk = html.includes(`href="${articleUrl}"`);
    const sitemapOk = sitemap.includes(articleUrl);
    if (articleResponse.ok && sitemapResponse.ok && titleOk && canonicalOk && sitemapOk) {
      console.log(JSON.stringify({ message: "Live article verified", articleUrl, status: articleResponse.status }));
      process.exit(0);
    }
    console.log(JSON.stringify({ message: "Waiting for Render deployment", articleStatus: articleResponse.status, sitemapStatus: sitemapResponse.status }));
  } catch {
    console.log(JSON.stringify({ message: "Waiting for Render deployment after a transient verification error" }));
  }
  await new Promise((resolve) => setTimeout(resolve, 20_000));
}

throw new Error(`Timed out waiting for ${articleUrl}`);
