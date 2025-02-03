"use client";

import SchedulerWrapper from "@/components/schedule/_components/view/schedular-view-filteration";
import { SchedulerProvider } from "@/providers/schedular-provider";
import { useGoogleTokens } from "@/hooks/useGoogleTokens";
import { useEffect } from "react";

export default function Home() {
  const { tokens, loading, error } = useGoogleTokens();
  useEffect(() => {
    console.log("Dashboard state:", {
      loading,
      hasTokens: !!tokens,
      error,
      tokenDetails: tokens,
    });
  }, [loading, tokens, error]);

  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 py-8 md:py-10">
      <SchedulerProvider weekStartsOn="monday">
        <SchedulerWrapper
          classNames={{
            tabs: {
              panel: "p-0",
            },
          }}
        />
      </SchedulerProvider>
    </section>
  );
}
