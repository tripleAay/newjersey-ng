"use server";
import { confirmOrderPricing as confirm } from "./actions";
export async function confirmOrderPricing(form: FormData): Promise<void> {
  return confirm(form);
}
