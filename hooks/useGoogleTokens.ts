// hooks/useGoogleTokens.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";

interface GoogleTokens {
  google_access_token: string | null;
  google_refresh_token: string | null;
  google_token_expires_at: string | null;
}

export function useGoogleTokens() {
  const [tokens, setTokens] = useState<GoogleTokens | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Watch for state changes
  useEffect(() => {
    console.log("State updated:", { loading, hasTokens: !!tokens, error });
  }, [loading, tokens, error]);

  useEffect(() => {
    let mounted = true;

    async function fetchTokens() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error("No user found");
        }

        const { data, error: tokensError } = await supabase
          .from("users")
          .select(
            "google_access_token, google_refresh_token, google_token_expires_at"
          )
          .eq("id", user.id)
          .single();

        if (tokensError) throw tokensError;

        if (mounted) {
          setTokens(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching tokens:", err);
        if (mounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch tokens")
          );
          setLoading(false);
        }
      }
    }

    fetchTokens();

    return () => {
      mounted = false;
    };
  }, []);

  return { tokens, loading, error };
}
