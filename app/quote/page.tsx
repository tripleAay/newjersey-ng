import { redirect } from "next/navigation";

export default function LegacyQuotePage() {
  redirect("/shop/quote");
}