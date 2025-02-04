"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { createBrowserClient } from "@supabase/ssr";

interface UserProfile {
  id: string | null;
  email: string | null;
  avatarUrl: string | null;
  fullName: string | null;
  provider: string | null;
  lastSignIn: string | null;
  metadata: {
    [key: string]: any;
  } | null;
  preferences: {
    theme?: string;
    timezone?: string;
    notifications?: boolean;
    [key: string]: any;
  } | null;
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  setUser: (user: UserProfile | null) => void;
  updateUserData: (data: Partial<UserProfile>) => void;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Create the Supabase client using SSR package
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const updateUserData = (data: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 Refreshing user data...");

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("❌ Auth error:", authError);
        throw authError;
      }

      if (authUser) {
        console.log("✅ User authenticated:", {
          id: authUser.id,
          email: authUser.email,
          metadata: authUser.user_metadata,
        });

        const userData: UserProfile = {
          id: authUser.id,
          email: authUser.email || null,
          avatarUrl: authUser.user_metadata?.avatar_url || null,
          fullName: authUser.user_metadata?.full_name || null,
          provider: authUser.app_metadata?.provider || null,
          lastSignIn: authUser.last_sign_in_at ?? null,
          metadata: authUser.user_metadata ?? null,
          preferences: authUser.user_metadata?.preferences ?? null,
        };
        setUser(userData);
      } else {
        console.log("ℹ️ No authenticated user found");
        setUser(null);
      }
      setError(null);
    } catch (err) {
      console.error("❌ Error refreshing user data:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch user data")
      );
      setUser(null);
    } finally {
      console.log("✅ Finished refreshing user data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("🚀 Initializing UserContext...");
    refreshUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("🔄 Auth state changed:", {
        event: _event,
        userId: session?.user?.id,
        email: session?.user?.email,
      });

      setIsLoading(true);
      try {
        if (session?.user) {
          const userData: UserProfile = {
            id: session.user.id,
            email: session.user.email || null,
            avatarUrl: session.user.user_metadata?.avatar_url || null,
            fullName: session.user.user_metadata?.full_name || null,
            provider: session.user.app_metadata?.provider || null,
            lastSignIn: session.user.last_sign_in_at ?? null,
            metadata: session.user.user_metadata ?? null,
            preferences: session.user.user_metadata?.preferences ?? null,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        setUser,
        updateUserData,
        refreshUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
