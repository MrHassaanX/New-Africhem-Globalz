import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { company } from "@/lib/site";
const pages = {
  privacy: { title: "Privacy information", text: "This policy is under founder and legal review.", note: "This local preview stores your selected theme in browser storage and remembers the introductory animation for the session. The quotation form, when enabled, sends the details you provide to a configured business email address through an email provider. No analytics or advertising trackers are enabled. Retention and full processing terms require approval before public launch." },
  terms: { title: "Terms of sale", text: "Commercial terms are confirmed with each quotation.", note: "This page is a development review, not an approved contract. Product grade, quantity, documents, payment, delivery, quotation validity, claims and any applicable transport conditions must be confirmed in the individual quotation. Final terms require founder and legal approval before public launch." },
} as const;
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(pages).map(page => ({ page })); }
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> { const { page } = await params; const data = pages[page as keyof typeof pages]; return data ? { title: data.title, description: data.text, alternates: { canonical: `/${page}` } } : {}; }
export default async function Page({ params }: { params: Promise<{ page: string }> }) { const { page } = await params; const data = pages[page as keyof typeof pages]; if (!data) notFound(); return <article className="revision-page"><header className="revision-hero wrap"><p className="revision-kicker">WEBSITE INFORMATION / REVIEW DRAFT</p><h1>{data.title}</h1><p>{data.text}</p></header><section className="revision-section wrap"><p className="revision-lead">{data.note}</p><p>Questions about this review? <a className="text-arrow" href={`mailto:${company.email}`}>{company.email} <span aria-hidden="true">↗</span></a></p><Link className="text-arrow" href="/contact">Contact Africhem <span aria-hidden="true">→</span></Link></section></article>; }
