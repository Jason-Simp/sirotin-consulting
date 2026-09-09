import PDFDocument from "pdfkit";

export type InvoiceDocument = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  periodLabel: string;
  clientName: string;
  sellerName: string;
  sellerAddressLines: string[];
  serviceDescription: string;
  amountCents: number;
  currency: string;
  paymentInstructions: string;
};

const ink = "#07111d";
const muted = "#64748b";
const cyan = "#0891b2";
const line = "#d9e2ec";

export function formatMoney(amountCents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amountCents / 100);
}

export function createInvoicePdf(invoice: InvoiceDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ size: "LETTER", margins: { top: 54, right: 54, bottom: 54, left: 54 }, info: { Title: `Invoice ${invoice.invoiceNumber}`, Author: invoice.sellerName } });
    const chunks: Buffer[] = [];
    document.on("data", (chunk: Buffer) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    document.fillColor(cyan).font("Helvetica-Bold").fontSize(10).text("AUTOMATEMEJAY", { characterSpacing: 1.4 });
    document.moveDown(0.4).fillColor(ink).fontSize(34).text("Invoice", { continued: false });
    document.font("Helvetica").fontSize(10).fillColor(muted).text(invoice.invoiceNumber, 390, 62, { width: 168, align: "right" });
    document.fillColor(ink).font("Helvetica-Bold").fontSize(12).text(invoice.sellerName, 390, 86, { width: 168, align: "right" });
    document.font("Helvetica").fontSize(9).fillColor(muted).text(invoice.sellerAddressLines.join("\n"), 390, 104, { width: 168, align: "right", lineGap: 2 });

    document.moveTo(54, 150).lineTo(558, 150).strokeColor(line).lineWidth(1).stroke();
    document.font("Helvetica-Bold").fontSize(9).fillColor(cyan).text("BILL TO", 54, 174);
    document.font("Helvetica-Bold").fontSize(15).fillColor(ink).text(invoice.clientName, 54, 191);

    const detailsX = 350;
    document.font("Helvetica-Bold").fontSize(9).fillColor(muted).text("ISSUED", detailsX, 174);
    document.fillColor(ink).font("Helvetica").fontSize(10).text(invoice.issueDate, detailsX, 191);
    document.font("Helvetica-Bold").fontSize(9).fillColor(muted).text("DUE", 454, 174);
    document.fillColor(ink).font("Helvetica-Bold").fontSize(10).text(invoice.dueDate, 454, 191);

    const tableTop = 252;
    document.rect(54, tableTop, 504, 32).fill("#07111d");
    document.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9).text("DESCRIPTION", 68, tableTop + 11);
    document.text("AMOUNT", 454, tableTop + 11, { width: 90, align: "right" });
    document.rect(54, tableTop + 32, 504, 68).fill("#f6f9fc").strokeColor(line).stroke();
    document.fillColor(ink).font("Helvetica-Bold").fontSize(11).text(invoice.serviceDescription, 68, tableTop + 48, { width: 330 });
    document.fillColor(muted).font("Helvetica").fontSize(9).text(invoice.periodLabel, 68, tableTop + 68, { width: 330 });
    document.fillColor(ink).font("Helvetica-Bold").fontSize(11).text(formatMoney(invoice.amountCents, invoice.currency), 454, tableTop + 51, { width: 90, align: "right" });

    document.font("Helvetica-Bold").fontSize(10).fillColor(muted).text("TOTAL DUE", 350, tableTop + 124);
    document.fillColor(ink).fontSize(22).text(formatMoney(invoice.amountCents, invoice.currency), 420, tableTop + 117, { width: 138, align: "right" });

    document.moveTo(54, 456).lineTo(558, 456).strokeColor(line).stroke();
    document.fillColor(cyan).font("Helvetica-Bold").fontSize(9).text("PAYMENT", 54, 480);
    document.fillColor(ink).font("Helvetica").fontSize(10).text(invoice.paymentInstructions, 54, 499, { width: 504, lineGap: 4 });

    document.fillColor(muted).fontSize(8.5).text("Thank you. Questions about this invoice can be sent to hello@automatemejay.com.", 54, 690, { width: 504, align: "center" });
    document.end();
  });
}
