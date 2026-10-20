import Link from "next/link";
import { company } from "@/lib/site";
import { SocialLinks } from "@/components/SocialLinks";
export function Footer() {
  return <footer className="footer wrap">
    <div className="footer-top"><Link href="/" className="footer-name">AFRICHEM<br /><span>GLOBALZ</span></Link><div><p>Start a conversation.</p><a className="email-link" href={"mailto:" + company.email}>{company.email} <span aria-hidden="true">↗</span></a><SocialLinks /></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Africhem Globalz</span><span>Sourcing simplified.</span><nav aria-label="Legal"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms &amp; Conditions</Link></nav></div>
  </footer>;
}
