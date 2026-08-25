"use client";

import { useRouter } from "next/navigation";

export default function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.clear();
      router.push("/auth/login");
    } catch {
      localStorage.clear();
      router.push("/auth/login");
    }
  };

  return logout;
}