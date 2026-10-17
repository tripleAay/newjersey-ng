import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import JerseyEditor from "../JerseyEditor";
export const dynamic = "force-dynamic";
export default async function NewJerseyPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireStoreAdmin();
  const query = await searchParams;
  return <JerseyEditor error={typeof query.error === "string" ? query.error : undefined} />;
}
