import { clientContent } from "@/lib/content/company";

export function PillarRows({ listClassName, rowClassName }: { listClassName: string; rowClassName: string }) {
  return <ol className={listClassName}>
    {clientContent.pillars.map((pillar, index) => <li className={rowClassName} key={pillar.title}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <h3>{pillar.title}</h3>
      <p>{pillar.description}</p>
    </li>)}
  </ol>;
}
