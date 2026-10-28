import { buyerSteps } from "@/lib/verified-content";
import { QuoteLink } from "@/components/QuoteLink";

export function BuyerSteps({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? "buyer-steps buyer-steps-compact" : "buyer-steps"}>
    <ol>{buyerSteps.map(step => <li key={step.number}><span className="step-number">{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
    <QuoteLink label="Start with Step 1: Get a Quote" />
  </div>;
}
