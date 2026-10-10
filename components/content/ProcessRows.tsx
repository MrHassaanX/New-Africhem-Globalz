import { clientContent } from "@/lib/content/company";

export function ProcessRows({ listClassName, rowClassName }: { listClassName: string; rowClassName: string }) {
  return <div className={listClassName} aria-label="How we work">
    {clientContent.process.map((step, index) => <div className={rowClassName} key={step.title}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <h3><span>{step.title}</span></h3>
      <p>{step.description}</p>
    </div>)}
  </div>;
}
