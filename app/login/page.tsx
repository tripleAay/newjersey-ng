import { redirect } from "next/navigation";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AccountForm from "@/app/components/auth/AccountForm";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { safeDestination } from "@/app/lib/newjersey/auth/destination";

type Props = {
  searchParams: Promise<{
    next?: string | string[];
    error?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = safeDestination(params.next);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(
      `/auth/continue${next ? `?next=${encodeURIComponent(next)}` : ""}`
    );
  }

  return (
    <>
      <Header />
      <main>
        <AccountForm
          mode="login"
          next={next}
          confirmationError={params.error === "confirmation"}
        />
      </main>
      <Footer />
    </>
  );
}