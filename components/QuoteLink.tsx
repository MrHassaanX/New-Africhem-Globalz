import Link from "next/link";

export function quoteHref(category?: string, product?: string, destination?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (product) params.set("product", product);
  if (destination) params.set("destination", destination);
  const query = params.toString();
  return `/contact${query ? `?${query}` : ""}#quote`;
}

export function QuoteLink({ className = "", label = "Get a Quote", category, product, destination }: {
  className?: string; label?: string; category?: string; product?: string; destination?: string;
}) {
  return <Link className={`quote-button ${className}`.trim()} href={quoteHref(category, product, destination)}>{label}<span aria-hidden="true">→</span></Link>;
}
