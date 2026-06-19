import { getProductionReview } from "../lib/production-review";
import { ProductionReviewShell } from "./production-review-shell";

export default function Home() {
  const review = getProductionReview();

  return <ProductionReviewShell review={review} />;
}
