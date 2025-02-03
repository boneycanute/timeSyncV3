// app/auth-error/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="container mx-auto py-20 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Authentication Error</h1>
      <p className="text-muted-foreground mt-2">
        There was a problem authenticating your account.
      </p>
      <Button asChild className="mt-4">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
