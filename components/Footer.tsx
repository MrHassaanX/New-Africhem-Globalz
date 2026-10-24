import Link from "next/link";
import { company } from "@/lib/site";
import { SocialLinks } from "@/components/SocialLinks";
import { navigation } from "@/lib/site";
import { companyIdentity } from "@/lib/verified-content";
import { QuoteLink } from "@/components/QuoteLink";
import Image from "next/image";
export function Footer() {
  return <footer className="footer wrap">
    <div className="footer-top"><Link href="/" className="footer-name" aria-label="Africhem Globalz home"><Image src="/africhem-logo.png" alt="AFRICHEM GLOBALZ" width={1041} height={271} sizes="200px" /></Link><div><p>Start a conversation.</p><a className="email-link" href={"mailto:" + company.email}>{company.email} <span aria-hidden="true">↗</span></a><p><a href={"tel:" + company.phone.replace(/[^+\d]/g, "")}>{company.phone}</a></p><SocialLinks /><QuoteLink /></div></div>
    <nav className="footer-site-nav" aria-label="Footer navigation">{navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
    {companyIdentity.legalName && <p className="footer-identity">{companyIdentity.legalName}{companyIdentity.registrationNumber && ` · Registration ${companyIdentity.registrationNumber}`}{companyIdentity.iec && ` · IEC ${companyIdentity.iec}`}{companyIdentity.gstin && ` · GSTIN ${companyIdentity.gstin}`}{companyIdentity.registeredAddress && ` · ${companyIdentity.registeredAddress}`}{companyIdentity.officeHours && ` · ${companyIdentity.officeHours}`}{companyIdentity.timeZone && ` ${companyIdentity.timeZone}`}</p>}
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Africhem Globalz</span><span>Sourcing simplified.</span><nav aria-label="Legal"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms &amp; Conditions</Link></nav></div>
  </footer>;
}
