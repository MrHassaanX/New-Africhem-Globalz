"use client";
import { useRef, useState } from "react";
import { blankQuote, quoteCategories, validateQuote, type QuoteErrors, type QuoteFields } from "@/lib/quote";
import { chemicalProducts } from "@/lib/chemical-catalogue";
import Link from "next/link";

export function QuoteForm({ enabled, initialCategory, initialProduct, initialDestination }: { enabled: boolean; initialCategory: string; initialProduct: string; initialDestination: string }) {
  const [values, setValues] = useState<QuoteFields>({ ...blankQuote, category: quoteCategories.some(item => item.value === initialCategory) ? initialCategory : "", product: chemicalProducts.some(item => item.slug === initialProduct && item.family === initialCategory) ? initialProduct : "", destination: initialDestination.slice(0, 200) });
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [notice, setNotice] = useState("");
  const form = useRef<HTMLFormElement>(null);
  function change(key: keyof QuoteFields, value: string) { setValues(previous => ({ ...previous, [key]: value, ...(key === "category" ? { product: "" } : {}) })); setErrors(previous => ({ ...previous, [key]: undefined })); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!enabled || status === "sending") return;
    const checked = validateQuote(values); setErrors(checked.errors);
    if (Object.keys(checked.errors).length) { setNotice("Please correct the highlighted fields."); const first = Object.keys(checked.errors)[0]; form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
    setStatus("sending"); setNotice("");
    try {
      const response = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(checked.values) });
      const result = await response.json() as { accepted?: boolean; error?: string; fields?: QuoteErrors };
      if (response.ok && result.accepted) { setStatus("sent"); setNotice("Your enquiry was accepted. We will review the details and respond using the contact information you provided."); return; }
      setErrors(result.fields ?? {}); setNotice(result.error ?? "The enquiry could not be sent. Please retry or use direct contact.");
    } catch { setNotice("The enquiry could not be sent. Please retry or use direct contact."); }
    setStatus("idle");
  }
  const field = (key: keyof QuoteFields, label: string, type = "text", required = true) => <label className="quote-field" key={key}><span>{label}{required && " *"}</span><input name={key} type={type} value={values[key]} onChange={event => change(key, event.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${key}-error` : undefined} autoComplete={key === "name" ? "name" : key === "company" ? "organization" : key === "country" ? "country-name" : key === "email" ? "email" : key === "phone" ? "tel" : "off"} />{errors[key] && <small id={`${key}-error`} role="alert">{errors[key]}</small>}</label>;
  return <div className="quote-form-shell">
    {!enabled && <div className="quote-unavailable" role="status"><strong>Online quotation submissions are not enabled in this preview.</strong><p>The sender and destination mailbox need verification. Please use email, phone or WhatsApp below for a live enquiry.</p></div>}
    {status === "sent" ? <div className="quote-success" role="status"><h3>Enquiry accepted.</h3><p>{notice}</p></div> : <form ref={form} onSubmit={submit} noValidate aria-label="Quotation request form">
      <div className="quote-form-grid">{field("name", "Name")}{field("company", "Company")}{field("country", "Country")}{field("email", "Email", "email")}{field("phone", "Phone / WhatsApp", "tel")}
        <label className="quote-field"><span>Product category *</span><select name="category" value={values.category} onChange={event => change("category", event.target.value)} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "category-error" : undefined}><option value="">Choose a category</option>{quoteCategories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select>{errors.category && <small id="category-error" role="alert">{errors.category}</small>}</label>
        {chemicalProducts.some(item => item.family === values.category) && <label className="quote-field"><span>Named product (optional)</span><select name="product" value={values.product} onChange={event => change("product", event.target.value)}><option value="">Other / not sure</option>{chemicalProducts.filter(item => item.family === values.category).map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>}
        {field("quantity", "Quantity", "text")}
        <label className="quote-field"><span>Unit *</span><select name="unit" value={values.unit} onChange={event => change("unit", event.target.value)} aria-invalid={Boolean(errors.unit)} aria-describedby={errors.unit ? "unit-error" : undefined}><option value="">Choose a unit</option>{["kg", "tonnes", "litres", "drums", "units", "other"].map(unit => <option key={unit} value={unit}>{unit}</option>)}</select>{errors.unit && <small id="unit-error" role="alert">{errors.unit}</small>}</label>
        {field("destination", "Destination port or city")}{field("dateNeeded", "Date needed", "date", false)}
        <label className="quote-field quote-field-full"><span>Message / specification *</span><textarea name="message" rows={6} value={values.message} onChange={event => change("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} />{errors.message && <small id="message-error" role="alert">{errors.message}</small>}</label>
      </div>
      <label className="quote-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={event => change("website", event.target.value)} /></label>
      {notice && <p className="quote-notice" role="alert">{notice}</p>}
      <button className="quote-button" type="submit" disabled={!enabled || status === "sending"}>{status === "sending" ? "Sending…" : "Request My Quote"}<span aria-hidden="true">→</span></button>
      <p className="quote-privacy">Your details are used only to reply to your enquiry. <Link href="/privacy">Privacy information</Link></p>
    </form>}
  </div>;
}
