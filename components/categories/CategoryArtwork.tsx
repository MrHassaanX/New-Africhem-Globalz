import Image from "next/image";
import type { CategoryVisual } from "@/lib/categories";

const categoryPhotos: Record<CategoryVisual, string> = {
  chemicals: "/stock/industrial-refinery.webp",
  footwear: "/stock/footwear-making.webp",
  agro: "/stock/pineapple-logistics.webp",
  recycling: "/stock/metal-recycling.webp",
};

export function CategoryArtwork({ visual }: { visual: CategoryVisual }) {
  return <div className={`category-art category-art-${visual}`} aria-hidden="true">
    <Image className="category-art-image" src={categoryPhotos[visual]} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" />
  </div>;
}
