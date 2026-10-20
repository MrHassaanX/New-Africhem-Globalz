import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { company } from "@/lib/site";
import { clientContent } from "@/lib/content/company";
import { ContactIcon } from "@/components/SocialLinks";
import { phoneLink, socialLinks } from "@/lib/socials";
const pages = {
  contact: { title: "Let's talk.", label: "CONTACT / ENQUIRY", text: "Start with the details.", note: `Email or call ${clientContent.contact.phone} with your requirement.` },
  privacy: { title: "Privacy policy.", label: "WEBSITE INFORMATION", text: "A foundation preview.", note: "This preview stores your selected theme locally and uses session storage to remember the introductory animation. No analytics, advertising trackers or website enquiry form are enabled. Email links open your email application. The full policy will be reviewed before launch." },
  terms: { title: "Terms & conditions.", label: "WEBSITE INFORMATION", text: "Information for review.", note: "This is a development preview. Product listings and company pages are not complete. Confirm any product, specification or commercial terms directly with Africhem Globalz. Final website terms are pending review before launch." },
} as const;
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(pages).map(page => ({ page })); }
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const data = pages[page as keyof typeof pages];
  return data ? { title: data.title.replace(/\.$/, ""), description: data.text, alternates: { canonical: "/" + page } } : {};
}
export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const data = pages[page as keyof typeof pages];
  if (!data) notFound();
  if (page === "contact") {
    const channels = [socialLinks[3], phoneLink, socialLinks[2], socialLinks[0], socialLinks[1]];
    const display = [clientContent.contact.email, clientContent.contact.phone, "Open WhatsApp chat", "LinkedIn homepage", "Instagram homepage"];
    return <article className="contact-page wrap">
      <div className="eyebrow-line"><p className="eyebrow">CONTACT / ENQUIRY</p><span className="review-label">AFRICHEM GLOBALZ</span></div>
      <div className="contact-hero"><h1>Let&apos;s talk.</h1><p>Tell us the material, product or requirement you have in mind. We&apos;ll take the conversation from there.</p></div>
      <div className="contact-grid"><div className="contact-intro"><p>DIRECT CONTACT</p><h2>Start with<br />the details.</h2><span>{data.note}</span></div>
        <div className="contact-channel-list">{channels.map((channel, index) => <a className="contact-channel" key={channel.icon} href={channel.href}
          aria-label={channel.label} target={channel.external ? "_blank" : undefined} rel={channel.external ? "noopener noreferrer" : undefined}>
          <span className="contact-channel-icon"><ContactIcon name={channel.icon} /></span><span className="contact-channel-copy"><small>{channel.icon.toUpperCase()}</small><strong>{display[index]}</strong></span><span className="contact-channel-arrow" aria-hidden="true">↗</span>
        </a>)}</div>
      </div>
      <p className="contact-platform-note">Africhem&apos;s LinkedIn and Instagram profile links are coming soon. Those icons currently open the platform homepages.</p>
    </article>;
  }
  return <section className="route-foundation wrap">
    <div className="eyebrow-line"><p className="eyebrow">{data.label}</p><span className="review-label">FOUNDATION PREVIEW</span></div>
    <h1>{data.title}</h1><div className="route-detail"><h2>{data.text}</h2><div><p>{data.note}</p>
    <div className={page === "contact" ? "contact-methods" : undefined}>
      <a className="text-link" href={"mailto:" + company.email}>{company.email} <span aria-hidden="true">↗</span></a>
      {page === "contact" && <>
        <a className="text-link" href={"tel:" + clientContent.contact.phone}>{clientContent.contact.phone} <span aria-hidden="true">↗</span></a>
        <a className="text-link" href={"https://" + clientContent.contact.website}>{clientContent.contact.website} <span aria-hidden="true">↗</span></a>
      </>}
    </div></div></div>
    <Link className="back-link" href="/">← Back to the foundation</Link>
  </section>;
}
