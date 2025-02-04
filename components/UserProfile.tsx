"use client";

import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Create the client once, not on every render
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Fetch initial user data
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching user:", error.message);
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Remove supabase.auth dependency

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

  if (loading) {
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
      {user.user_metadata?.avatar_url && (
        <div className="relative w-8 h-8">
          <Image
            src={user.user_metadata.avatar_url}
            alt={`${user.email}'s profile`}
            fill
            className="rounded-full object-cover"
            sizes="32px"
          />
        </div>
      )}
      <span className="text-sm text-white truncate max-w-[200px]">
        {user.email}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="ml-2"
      >
        Sign Out
      </Button>
    </div>
  );
}
