// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const BYPASS_AUTH = true; // change to false when authentication is ready

// // export default function ShopLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   const router = useRouter();
// //   const [checkingAuth, setCheckingAuth] = useState(!BYPASS_AUTH);

// //   useEffect(() => {
// //     if (BYPASS_AUTH) {
// //       setCheckingAuth(false);
// //       return;
// //     }

// //     const token = localStorage.getItem("fynaro_token");

// //     if (!token) {
// //       router.replace("/auth/login");
// //       return;
// //     }

// //     setCheckingAuth(false);
// //   }, [router]);

// //   if (checkingAuth) {
// //     return (
// //       <main className="flex min-h-screen items-center justify-center bg-[#050506] text-white">
// //         <div className="text-sm text-white/60">
// //           Checking access...
// //         </div>
// //       </main>
// //     );
// //   }

// //   return <>{children}</>;
// // }

// export default function ShopLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <>{children}</>;
// }



export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}