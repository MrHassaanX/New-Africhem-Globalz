import { chemicalFamilies, chemicalProducts } from "@/lib/chemical-catalogue";
import { otherBusinesses } from "@/lib/businesses";

export const quoteCategories = [...chemicalFamilies.map(item => ({ value: item.slug, label: item.name })), ...otherBusinesses.map(item => ({ value: item.slug, label: item.name }))];
export type QuoteFields = { name: string; company: string; country: string; email: string; phone: string; category: string; product: string; quantity: string; unit: string; destination: string; message: string; dateNeeded: string; website: string };
export const blankQuote: QuoteFields = { name: "", company: "", country: "", email: "", phone: "", category: "", product: "", quantity: "", unit: "", destination: "", message: "", dateNeeded: "", website: "" };
export type QuoteErrors = Partial<Record<keyof QuoteFields, string>>;
export function validateQuote(input: unknown): { values: QuoteFields; errors: QuoteErrors } {
  const object = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};
  const values = Object.fromEntries(Object.keys(blankQuote).map(key => [key, typeof object[key] === "string" ? (object[key] as string).trim() : ""])) as QuoteFields;
  const errors: QuoteErrors = {};
  for (const key of ["name", "company", "country", "phone", "category", "quantity", "unit", "destination", "message"] as const) {
    if (!values[key]) errors[key] = "This field is required.";
  }
  if (!values.email) errors.email = "This field is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254) errors.email = "Enter a valid email address.";
  if (values.phone && !/^[+\d()\s-]{7,30}$/.test(values.phone)) errors.phone = "Enter a valid phone number.";
  if (values.category && !quoteCategories.some(item => item.value === values.category)) errors.category = "Choose a listed category.";
  if (values.product && !chemicalProducts.some(item => item.slug === values.product && item.family === values.category)) errors.product = "Choose a product in this category or leave it blank.";
  if (values.quantity && (!/^\d+(?:[.,]\d+)?$/.test(values.quantity) || Number(values.quantity.replace(",", ".")) <= 0)) errors.quantity = "Enter a quantity greater than zero.";
  if (values.unit && !["kg", "tonnes", "litres", "drums", "units", "other"].includes(values.unit)) errors.unit = "Choose a unit.";
  if (values.dateNeeded && !/^\d{4}-\d{2}-\d{2}$/.test(values.dateNeeded)) errors.dateNeeded = "Enter a valid date.";
  for (const key of Object.keys(blankQuote) as (keyof QuoteFields)[]) if (values[key].length > (key === "message" ? 3000 : 200)) errors[key] = "Please shorten this field.";
  return { values, errors };
}
export function quoteTransportReady() { return Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_FROM_EMAIL && process.env.ENQUIRY_TO_EMAIL && process.env.QUOTE_FORM_ENABLED === "true"); }
