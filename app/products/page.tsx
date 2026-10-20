import { permanentRedirect } from "next/navigation";

export default function ProductsPage() {
  permanentRedirect("/categories");
}
