import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "Africhem Globalz — Sourcing Simplified",
  description: "Africhem Globalz plans, sources and sees supply through to delivery.",
  alternates: { canonical: "/" },
};

export default function Page() { return <HomePage />; }
