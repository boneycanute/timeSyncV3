"use client";

import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserAvatarContext";

export function UserProfile() {
  const router = useRouter();
  const { user, isLoading, updateUserData } = useUser();

  // Create the client once, not on every render
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
        return;
      }
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {user.avatarUrl && (
        <div className="relative w-8 h-8">
          <Image
            src={user.avatarUrl}
            alt={`${user.email}'s profile`}
            fill
            className="rounded-full object-cover"
          />
        </div>
      )}
      <span className="text-sm text-foreground truncate max-w-[200px]">
        {user.email}
      </span>
      <Button
        onClick={handleSignOut}
        variant="ghost"
        className="text-sm"
      >
        Sign Out
      </Button>
    </div>
  );
}
