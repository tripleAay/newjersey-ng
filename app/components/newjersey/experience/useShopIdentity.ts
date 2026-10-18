"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/app/lib/newjersey/supabase/client";
export function useShopIdentity() {
  const [id, setId] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    try {
      const client = createClient();
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, session) => {
        setId(session?.user.id ?? null);
      });
      return () => subscription.unsubscribe();
    } catch {
      setId(null);
    }
  }, []);
  return id;
}
