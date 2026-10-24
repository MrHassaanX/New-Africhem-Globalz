import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Intro, introScript } from "@/components/Intro";
import { Providers } from "@/components/Providers";
import { company, indexable, siteUrl } from "@/lib/site";
import "./globals.css";
import "./revision-pages.css";
const inter = localFont({ src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", variable: "--font-body", display: "swap" });
const display = localFont({ src: "../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2", variable: "--font-display", display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), title: { default: "Industrial Chemical Sourcing | Africhem Globalz", template: "%s | Africhem Globalz" },
  description: company.description, robots: { index: indexable, follow: indexable },
  openGraph: { type: "website", siteName: company.name, title: "Africhem Globalz", description: company.description },
  twitter: { card: "summary_large_image", title: "Africhem Globalz", description: company.description },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#06111a" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable + " " + display.variable} suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: introScript }} /></head>
    <body><a className="skip-link" href="#main">Skip to content</a><Providers><Header /><main id="main" tabIndex={-1}>{children}</main><Footer /></Providers><Intro /></body>
  </html>;
}
