import { clientContent } from "@/lib/content/company";

export type Coordinate = [longitude: number, latitude: number];
type Country = (typeof clientContent.network.countries)[number];

// Geographic points within each country, used as country markers only.
const coordinates: Record<Country, Coordinate> = {
  Kuwait: [47.5, 29.5],
  UAE: [54.3, 24.4],
  China: [104.2, 35.9],
  Algeria: [2.6, 28.2],
  Egypt: [30.8, 26.8],
  Uganda: [32.3, 1.3],
  Kenya: [37.9, 0.5],
};

export const partnerLocations = clientContent.network.countries.map((name) => ({
  name,
  coordinate: coordinates[name],
}));

// A single connected, non-directional network motif. These arcs are not
// verified trade lanes, shipments, or office-to-office connections.
export const networkArcs = [
  [2, 1], [1, 0], [0, 4], [4, 3], [1, 5], [5, 6],
] as const;
