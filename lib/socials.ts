import { clientContent } from "@/lib/content/company";

export type ContactIconName = "linkedin" | "instagram" | "whatsapp" | "email" | "phone";
const contactDigits = clientContent.contact.phone.replace(/\D/g, "");

export const socialLinks: readonly { icon: ContactIconName; href: string; label: string; external: boolean; companyProfile: boolean }[] = [
  { icon: "linkedin", href: "https://www.linkedin.com/", label: "LinkedIn homepage (Africhem profile coming soon)", external: true, companyProfile: false },
  { icon: "instagram", href: "https://www.instagram.com/", label: "Instagram homepage (Africhem profile coming soon)", external: true, companyProfile: false },
  { icon: "whatsapp", href: `https://wa.me/${contactDigits}`, label: "Chat with Africhem Globalz on WhatsApp", external: true, companyProfile: true },
  { icon: "email", href: `mailto:${clientContent.contact.email}`, label: "Email Africhem Globalz", external: false, companyProfile: true },
];

export const phoneLink = { icon: "phone" as const, href: `tel:+${contactDigits}`, label: "Call Africhem Globalz", external: false, companyProfile: true };
