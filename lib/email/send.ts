import { Resend } from "resend";
import type { OrderRow, OrderItemRow } from "@/lib/orders/types";
import { ORDER_STATUS_LABELS } from "@/lib/orders/types";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || "VIP Raiments <orders@vipraiments.com>";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vip-raiments.vercel.app";

function getResend() {
  if (!resendApiKey) return null;
  return new Resend(resendApiKey);
}

function formatCurrency(amountInr: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountInr);
}

function buildOrderItemsHtml(items: OrderItemRow[]): string {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee;">
          <strong>${item.product_name}</strong>
          <br><span style="color:#666;font-size:13px;">Size: ${item.size} | Qty: ${item.quantity}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;">
          ${formatCurrency(item.line_total_inr)}
        </td>
      </tr>`
    )
    .join("");
}

function baseTemplate(title: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;padding:24px 0;border-bottom:2px solid #111;">
      <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:2px;color:#111;">VIP RAIMENTS</h1>
    </div>
    <div style="background:#fff;padding:32px;border-radius:0 0 8px 8px;">
      <h2 style="margin:0 0 20px;font-size:20px;color:#111;">${title}</h2>
      ${content}
    </div>
    <div style="text-align:center;padding:24px 0;color:#999;font-size:12px;">
      <p>VIP Raiments | Premium Streetwear</p>
      <p><a href="${siteUrl}" style="color:#999;">vip-raiments.vercel.app</a></p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendOrderConfirmation(order: OrderRow, items: OrderItemRow[]) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping order confirmation email");
    return { ok: false, error: "Email not configured" };
  }

  const itemsHtml = buildOrderItemsHtml(items);

  const html = baseTemplate(
    "Order Confirmed",
    `
    <p style="color:#333;margin:0 0 16px;">Hi <strong>${order.customer_name}</strong>,</p>
    <p style="color:#333;margin:0 0 24px;">We've received your order and it's being processed.</p>
    
    <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#666;">Order ID</p>
      <p style="margin:0;font-family:monospace;font-size:14px;">${order.id.slice(0, 8)}...</p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
      <thead>
        <tr style="border-bottom:2px solid #111;">
          <th style="padding:12px 0;text-align:left;font-size:13px;text-transform:uppercase;color:#666;">Item</th>
          <th style="padding:12px 0;text-align:right;font-size:13px;text-transform:uppercase;color:#666;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr style="border-top:2px solid #111;">
          <td style="padding:16px 0;font-weight:700;font-size:16px;">Total</td>
          <td style="padding:16px 0;text-align:right;font-weight:700;font-size:16px;">${formatCurrency(order.total_inr)}</td>
        </tr>
      </tfoot>
    </table>

    <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#666;">Shipping Address</p>
      <p style="margin:0;font-size:14px;color:#333;">
        ${order.address_line}<br>
        ${order.city}, ${order.postal_code}
      </p>
    </div>

    <p style="color:#666;font-size:13px;margin:0;">You can track your order status at any time.</p>
    <a href="${siteUrl}/track?orderId=${order.id}" style="display:inline-block;margin-top:12px;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">Track Order</a>
    `
  );

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: order.email,
      subject: `Order Confirmed - ${order.id.slice(0, 8).toUpperCase()}`,
      html,
    });

    if (error) {
      console.error("Email send error:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("Email send exception:", err);
    return { ok: false, error: "Failed to send email" };
  }
}

export async function sendStatusUpdate(order: OrderRow, items: OrderItemRow[], oldStatus: string, note?: string) {
  const resend = getResend();
  if (!resend) return { ok: false, error: "Email not configured" };

  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
  const itemsHtml = buildOrderItemsHtml(items);

  let extraContent = "";
  if (order.status === "shipped" && order.tracking_number) {
    extraContent = `
      <div style="background:#f0f0ff;padding:16px;border-radius:8px;margin:0 0 24px;">
        <p style="margin:0 0 8px;font-size:13px;color:#666;">Tracking Number</p>
        <p style="margin:0;font-family:monospace;font-size:16px;font-weight:700;">${order.tracking_number}</p>
        ${order.shipping_carrier ? `<p style="margin:4px 0 0;font-size:13px;color:#666;">Carrier: ${order.shipping_carrier}</p>` : ""}
      </div>`;
  }

  if (note) {
    extraContent += `
      <div style="background:#fffbe6;padding:16px;border-radius:8px;margin:0 0 24px;border-left:4px solid #f5a623;">
        <p style="margin:0 0 4px;font-size:13px;color:#666;">Note from seller</p>
        <p style="margin:0;font-size:14px;color:#333;">${note}</p>
      </div>`;
  }

  const html = baseTemplate(
    `Order ${statusLabel}`,
    `
    <p style="color:#333;margin:0 0 16px;">Hi <strong>${order.customer_name}</strong>,</p>
    <p style="color:#333;margin:0 0 24px;">Your order status has been updated to <strong>${statusLabel}</strong>.</p>
    
    <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#666;">Order ID</p>
      <p style="margin:0;font-family:monospace;font-size:14px;">${order.id.slice(0, 8)}...</p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
      <thead>
        <tr style="border-bottom:2px solid #111;">
          <th style="padding:12px 0;text-align:left;font-size:13px;text-transform:uppercase;color:#666;">Item</th>
          <th style="padding:12px 0;text-align:right;font-size:13px;text-transform:uppercase;color:#666;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr style="border-top:2px solid #111;">
          <td style="padding:16px 0;font-weight:700;font-size:16px;">Total</td>
          <td style="padding:16px 0;text-align:right;font-weight:700;font-size:16px;">${formatCurrency(order.total_inr)}</td>
        </tr>
      </tfoot>
    </table>

    ${extraContent}

    <a href="${siteUrl}/track?orderId=${order.id}" style="display:inline-block;margin-top:12px;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">Track Order</a>
    `
  );

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: order.email,
      subject: `Order ${statusLabel} - ${order.id.slice(0, 8).toUpperCase()}`,
      html,
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("Email send exception:", err);
    return { ok: false, error: "Failed to send email" };
  }
}
