import { clientContent } from "@/lib/content/company";
import Image from "next/image";

const pillarPhotos = [
  { src: "/stock/industrial-refinery.webp", alt: "Industrial processing infrastructure" },
  { src: "/stock/footwear-making.webp", alt: "Shoemaker working with a finishing machine" },
  { src: "/stock/roses-pink.webp", alt: "Pink roses in bloom" },
  { src: "/stock/metal-recycling.webp", alt: "Industrial metal recycling equipment" },
] as const;

export function PillarRows({ listClassName, rowClassName, showImages = false }: { listClassName: string; rowClassName: string; showImages?: boolean }) {
  return <ol className={listClassName}>
    {clientContent.pillars.map((pillar, index) => <li className={rowClassName} key={pillar.title}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <h3>{pillar.title}</h3>
      {showImages && <div className="pillars-row-visual"><Image src={pillarPhotos[index].src} alt={pillarPhotos[index].alt} fill sizes="(max-width: 767px) 75vw, 20vw" /></div>}
      <p>{pillar.description}</p>
    </li>)}
  </ol>;
}
