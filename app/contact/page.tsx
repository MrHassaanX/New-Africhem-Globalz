import type { Metadata } from "next";
import { ContactIcon } from "@/components/SocialLinks";
import { phoneLink, socialLinks } from "@/lib/socials";
import { company } from "@/lib/site";
import { quoteTransportReady } from "@/lib/quote";
import { companyIdentity } from "@/lib/verified-content";
import { QuoteForm } from "@/components/quote/QuoteForm";
export const metadata: Metadata = { title: "Contact & Get a Quote", description: "Tell Africhem Globalz the product, quantity and destination you need for a chemical sourcing quotation.", alternates: { canonical: "/contact" } };
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ category?: string; product?: string; destination?: string }> }) {
  const context = await searchParams;
  const channels = [phoneLink, ...socialLinks];
  return <article className="revision-page contact-revision"><header className="revision-hero wrap"><p className="revision-kicker">CONTACT / QUOTATION</p><h1>Tell us what you need.</h1><p>Share your material, specification, quantity and destination. Use the form when online delivery is enabled, or reach us directly using the contact channels below.</p></header>
    <section className="revision-section wrap quote-layout" id="quote" aria-labelledby="quote-title"><div><p className="revision-kicker">GET A QUOTE</p><h2 id="quote-title">Start with the details.</h2><p className="revision-lead">A useful sourcing conversation begins with your requirement. Fields marked * are required.</p><div className="what-next"><h3>What happens next</h3><ol><li>We review your requirements.</li><li>We clarify product and delivery details.</li><li>We respond with available options and quotation information.</li></ol></div>{companyIdentity.legalName && <div className="contact-identity"><h3>Business identity</h3><p>{companyIdentity.legalName}</p>{companyIdentity.iec && <p>IEC: {companyIdentity.iec}</p>}{companyIdentity.gstin && <p>GSTIN: {companyIdentity.gstin}</p>}{companyIdentity.registeredAddress && <p>{companyIdentity.registeredAddress}</p>}</div>}</div><QuoteForm enabled={quoteTransportReady()} initialCategory={context.category ?? ""} initialProduct={context.product ?? ""} initialDestination={context.destination ?? ""} /></section>
    <section className="revision-section wrap"><div className="revision-section-head"><p className="revision-kicker">DIRECT CONTACT</p><h2>Speak with our team.</h2></div><div className="contact-links">{channels.map(channel => <a key={channel.icon} href={channel.href} target={channel.external ? "_blank" : undefined} rel={channel.external ? "noopener noreferrer" : undefined}><ContactIcon name={channel.icon} /><span>{channel.icon === "email" ? company.email : channel.icon === "phone" ? company.phone : "Open WhatsApp chat"}</span><span aria-hidden="true">↗</span></a>)}</div></section>
  </article>;
}
