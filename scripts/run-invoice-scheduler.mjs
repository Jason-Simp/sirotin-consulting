const siteUrl = process.env.INVOICE_SITE_URL ?? "https://automatemejay.com";
const secret = process.env.INVOICE_CRON_SECRET;

if (!secret || secret.length < 32) throw new Error("INVOICE_CRON_SECRET is missing or too short.");

const response = await fetch(`${siteUrl}/api/internal/invoices/run`, {
  method: "POST",
  headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
  body: "{}",
});
const body = await response.text();
if (!response.ok) throw new Error(`Invoice scheduler returned ${response.status}: ${body.slice(0, 300)}`);
console.log(body);
