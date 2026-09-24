import {
  redirect,
} from "next/navigation";

import TopBar from "@/app/components/TopBar";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Copyright from "@/app/components/Copyright";

import AdminLoginForm from "@/app/components/admin/AdminLoginForm";

import {
  getCurrentAdmin,
} from "@/app/lib/newjersey/auth/admin";

type PageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: PageProps) {
  const admin =
    await getCurrentAdmin();

  if (admin) {
    redirect(
      "/shop/admin"
    );
  }

  const params =
    await searchParams;

  const next =
    params.next?.startsWith(
      "/shop/admin"
    )
      ? params.next
      : "/shop/admin";

  return (
    <main className="min-h-screen bg-white">
      <TopBar />

      <Header />

      <AdminLoginForm
        next={next}
      />

      <Footer />

      <Copyright />
    </main>
  );
}