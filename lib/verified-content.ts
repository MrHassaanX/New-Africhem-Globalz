export const companyIdentity: {
  legalName?: string; registrationNumber?: string; iec?: string; gstin?: string;
  registeredAddress?: string; establishedYear?: string; officeHours?: string; timeZone?: string;
} = {};

export const founderProfile: {
  name?: string; role?: string; biography?: string; portrait?: string; linkedin?: string;
} = {};

export const buyerSteps = [
  { number: "01", title: "Tell us what you need", description: "Share the material or product, quantity and destination." },
  { number: "02", title: "We source and verify", description: "We review requirements, specifications and available quality documents with you." },
  { number: "03", title: "We ship and document", description: "Shipping and paperwork requirements are clarified for the destination before a quotation is confirmed." },
] as const;

export type ProofPoint = { text: string; approved: boolean; source: string; public: boolean };
export const proofPoints: readonly ProofPoint[] = [
  { text: "White Spirit and Thinner enquiries", approved: true, source: "docs/source/Africhem_Globalz_About_Us.docx", public: true },
  { text: "India as our primary country", approved: true, source: "docs/source/Africhem_Globalz_About_Us.docx", public: true },
  { text: "Seven international partner countries", approved: true, source: "docs/source/Africhem_Globalz_About_Us.docx", public: true },
  { text: "Direct phone, email and WhatsApp contact", approved: true, source: "User-confirmed contact channels", public: true },
  { text: "COA checked before cargo ships", approved: false, source: "Historical client copy; operational evidence pending", public: false },
  { text: "Customs clearance handled", approved: false, source: "Historical client copy; operational evidence pending", public: false },
];
