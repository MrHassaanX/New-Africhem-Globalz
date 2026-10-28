const questions = [
  ["What information is needed for a quote?", "Please share the material or product, grade or specification if known, quantity and unit, destination, and any required date or documents."],
  ["How are product specifications and COA documents checked?", "Send us the specification and document requirements. We can discuss what information is available for a proposed source before you commit to an order; a universal COA-checking policy is not yet published."],
  ["What shipping and trade documents can be provided?", "Document availability depends on the material, source and destination. Please list the documents you require in your enquiry so the team can confirm them for that quotation."],
  ["What payment terms are available?", "Payment terms are agreed for each quotation. Please include any required terms in your enquiry; no standard public terms have been approved yet."],
  ["How long does sourcing and shipping take?", "Timing depends on the product, quantity, origin and destination. Share your required date and destination for a case-specific response."],
  ["Who handles my order and communication?", "Use the quotation form or the published phone, email and WhatsApp channels to reach Africhem Globalz. A named representative will be listed once approved by the founder."],
] as const;
export function ProductFAQ() { return <div className="product-faq">{questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>; }
