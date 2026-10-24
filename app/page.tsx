import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "Industrial Chemical Sourcing",
  description: "Explore five chemical families and request a quotation for your specification, quantity and destination.",
  alternates: { canonical: "/" },
};

export default function Page() { return <HomePage />; }
