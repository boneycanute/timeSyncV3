"use client";

import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleGetStarted = async () => {
    try {
      console.log("🚀 Starting OAuth flow...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline", // Request refresh token
            prompt: "consent",
            include_granted_scopes: "true",
          },
          scopes: "https://www.googleapis.com/auth/calendar.readonly",
        },
      });

      if (error) {
        console.error("❌ OAuth Error:", error);
        throw error;
      }

      if (!data.url) {
        console.error("❌ No OAuth URL returned");
        return;
      }

      console.log("✅ OAuth flow initiated, redirecting to:", data.url);
      router.push(data.url);
    } catch (error) {
      console.error("❌ Error:", error);
      router.push("/auth-error");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-4xl font-bold text-center">
            Sync Your Calendar with AI
          </h1>
          <p className="text-xl text-center text-gray-600">
            Let AI help you manage your schedule
          </p>
          <Button onClick={handleGetStarted} size="lg">
            Get Started
          </Button>
        </div>
      </main>
    </div>
  );
}
