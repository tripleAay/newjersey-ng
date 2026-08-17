// src/app/credit/page.tsx
"use client";

import Header from "@/components/dashboard components/mainheader";
import AccountSecurityPanel from "@/components/credits/users";
import FooterNav from "@/components/credits/footerNav";

export default function Wallet() {
  return (
    <div className="min-h-screen bg-black text-slate-50">
      {/* Fixed top header (handled inside Header) */}
      <Header />

      {/* Page content below header (16 = ~64px) */}
      <div className="pt-16 pb-20">
        <main className="px-4 sm:px-6 lg:px-10">
          {/* ⬇️ just render StatusPage, no extra max-w-sm wrapper */}
          <AccountSecurityPanel/>
        </main>
      </div>

      {/* Fixed bottom nav */}
      <FooterNav />
    </div>
  );
}
