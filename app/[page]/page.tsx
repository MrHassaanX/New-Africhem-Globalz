import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { company } from "@/lib/site";
import { clientContent } from "@/lib/content/company";
const pages = {
  contact: { title: "Let's talk.", label: "CONTACT / ENQUIRY", text: "Start with the details.", note: `Email us or call ${clientContent.contact.phone} with your requirement. The website enquiry form is not yet connected.` },
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
