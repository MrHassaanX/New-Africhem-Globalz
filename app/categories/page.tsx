import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCarousel } from "@/components/categories/CategoryCarousel";
import { categories } from "@/lib/categories";
import "./categories.css";

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore Africhem Globalz business categories: chemicals, footwear, Uganda agro-exports and recycling.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  return <article className="categories-page">
    <section className="categories-hero wrap" aria-labelledby="categories-page-title">
      <div className="categories-topline"><span>AFRICHEM GLOBALZ / CATEGORIES</span><span>01 — {String(categories.length).padStart(2, "0")}</span></div>
      <div className="categories-hero-main"><h1 id="categories-page-title">Explore our<br /><span>categories.</span></h1><p>Four business areas. Choose a category to see what is currently confirmed and where to start an enquiry.</p></div>
    </section>
    <section className="categories-feature" aria-label="Browse categories"><CategoryCarousel label="Browse all categories" /></section>
    <div className="categories-close wrap"><p>Have a specific material or product in mind? Tell us what you need.</p><Link href="/contact">Send an Enquiry <span aria-hidden="true">↗</span></Link></div>
  </article>;
}
