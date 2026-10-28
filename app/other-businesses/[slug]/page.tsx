import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBusiness, otherBusinesses } from "@/lib/businesses";
import { QuoteLink } from "@/components/QuoteLink";
export const dynamicParams = false;
export function generateStaticParams() { return otherBusinesses.filter(business => business.status === "documented").map(business => ({ slug: business.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const data = getBusiness(slug); return data?.status === "documented" ? { title: data.name, description: data.description ?? "", alternates: { canonical: `/other-businesses/${slug}` } } : {}; }
export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const data = getBusiness(slug); if (!data || data.status !== "documented") notFound(); return <article className="revision-page"><header className="revision-hero wrap"><p className="revision-kicker"><Link href="/other-businesses">OTHER BUSINESSES</Link> / {data.name.toUpperCase()}</p><h1>{data.name}</h1><p>{data.description}</p><QuoteLink category={data.slug} /></header>{data.image && <figure className="business-detail-image wrap"><div><Image src={data.image} alt={`Illustrative photograph for ${data.name}`} fill sizes="(max-width: 767px) 100vw, 80vw" /></div><figcaption>Illustrative stock photography · Not an Africhem operation</figcaption></figure>}<section className="revision-section wrap"><h2>Start with the details.</h2><p className="revision-lead">For scope, availability and destination information, contact Africhem Globalz directly. Further business details will be published after founder approval.</p></section></article>; }
