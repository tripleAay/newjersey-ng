import "server-only";

// Compatibility entry point. Keep one service-role client implementation.
export { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
