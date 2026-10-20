import type { ContactIconName } from "@/lib/socials";
import { socialLinks } from "@/lib/socials";

export function ContactIcon({ name }: { name: ContactIconName }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.65, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  if (name === "linkedin") return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="7.4" cy="8" r=".8" fill="currentColor" stroke="none" /><path d="M7.4 11v6M11 17v-6h3v1.2c.5-.9 1.4-1.4 2.5-1.4 1.8 0 2.5 1.2 2.5 3V17M14 13.5V17" /></svg>;
  if (name === "instagram") return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.8" r=".9" fill="currentColor" stroke="none" /></svg>;
  if (name === "whatsapp") return <svg {...common}><path d="M6 19.2 3 21l.9-4.1A9 9 0 1 1 7 19.7" /><path d="M8.4 8.1c-.3-.5-.7-.5-1-.3-.7.4-1.1 1.3-.9 2.2.6 2.6 3 5.1 5.5 6.2 1.7.7 3 .7 4.1-.4.3-.3.4-.7.1-1l-1.6-1.1c-.3-.2-.6-.1-.9.2l-.8.8c-1.7-.6-3-1.9-3.7-3.5l.7-.8c.3-.3.3-.6.1-.9Z" /></svg>;
  if (name === "phone") return <svg {...common}><path d="M6.4 3.8 4.8 5.4c-.9.9-1.1 2.2-.6 3.4a20 20 0 0 0 11 11c1.2.5 2.5.3 3.4-.6l1.6-1.6-4.1-4.1-2.1 2.1a16 16 0 0 1-5.6-5.6l2.1-2.1-4.1-4.1Z" /></svg>;
  return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m4 6 8 6 8-6" /></svg>;
}

export function SocialLinks() {
  return <nav className="social-links" aria-label="Social and contact links">
    {socialLinks.map(link => <a key={link.icon} className="social-link" href={link.href} aria-label={link.label}
      title={link.label} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}>
      <ContactIcon name={link.icon} />
    </a>)}
  </nav>;
}
