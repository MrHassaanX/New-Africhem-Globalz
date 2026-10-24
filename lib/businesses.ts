export const otherBusinesses = [
  { slug: "agro", name: "Agro", description: "Roses and pineapples exported direct from Uganda.", image: "/stock/pineapple-logistics.webp", status: "documented" },
  { slug: "footwear", name: "Footwear", description: "Walkmate distribution in Mysore, Karnataka.", image: "/stock/footwear-making.webp", status: "documented" },
  { slug: "freight-forwarding-and-logistics", name: "Freight Forwarding & Logistics", description: null, image: null, status: "awaiting-details" },
  { slug: "scrap-recycling", name: "Scrap Recycling", description: "A growing division focused on keeping material in use.", image: "/stock/metal-recycling.webp", status: "documented" },
  { slug: "construction", name: "Construction", description: null, image: null, status: "awaiting-details" },
  { slug: "cctv-installation", name: "CCTV Installation", description: null, image: null, status: "awaiting-details" },
  { slug: "social-media", name: "Social Media", description: null, image: null, status: "awaiting-details" },
  { slug: "rc-toys", name: "RC Toys", description: null, image: null, status: "awaiting-details" },
] as const;
export const getBusiness = (slug: string) => otherBusinesses.find(item => item.slug === slug);
