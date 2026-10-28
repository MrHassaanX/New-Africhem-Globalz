import { quoteTransportReady, validateQuote } from "@/lib/quote";
export const runtime = "nodejs";
const recent = new Map<string, number>();
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Request origin was not accepted." }, { status: 403 });
  if ((Number(request.headers.get("content-length")) || 0) > 12000) return Response.json({ error: "Request is too large." }, { status: 413 });
  let payload: unknown;
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ error: "Invalid request." }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 12000) {
        await reader.cancel();
        return Response.json({ error: "Request is too large." }, { status: 413 });
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const { values, errors } = validateQuote(payload);
  if (values.website) return Response.json({ error: "Request was not accepted." }, { status: 400 });
  if (Object.keys(errors).length) return Response.json({ error: "Please correct the highlighted fields.", fields: errors }, { status: 400 });
  if (!quoteTransportReady()) return Response.json({ error: "Online quotation requests are not enabled yet. Please use email, phone or WhatsApp instead." }, { status: 503 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  if (recent.size > 1000) for (const [key, time] of recent) if (now - time > 60000) recent.delete(key);
  if (now - (recent.get(ip) ?? 0) < 30000) return Response.json({ error: "Please wait before sending another request." }, { status: 429 });
  recent.set(ip, now);
  const lines = ["New Africhem Globalz quotation enquiry", "", ...Object.entries(values).filter(([key]) => key !== "website").map(([key, value]) => `${key}: ${value || "—"}`)];
  try {
    const response = await fetch("https://api.resend.com/emails", { method: "POST", signal: AbortSignal.timeout(10000), headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.ENQUIRY_FROM_EMAIL, to: [process.env.ENQUIRY_TO_EMAIL], subject: "Africhem Globalz quotation enquiry", text: lines.join("\n") }) });
    if (!response.ok) { recent.delete(ip); return Response.json({ error: "The enquiry could not be sent. Please retry or use direct contact." }, { status: 502 }); }
    const result = await response.json() as { id?: string };
    if (!result.id) { recent.delete(ip); return Response.json({ error: "The email provider did not confirm acceptance. Please use direct contact." }, { status: 502 }); }
    return Response.json({ accepted: true });
  } catch { recent.delete(ip); return Response.json({ error: "The enquiry could not be sent. Please retry or use direct contact." }, { status: 502 }); }
}
