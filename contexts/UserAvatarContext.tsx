"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface UserAvatarContextType {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

const UserAvatarContext = createContext<UserAvatarContextType | undefined>(
  undefined
);

export function UserAvatarProvider({ children }: { children: ReactNode }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  return (
    <UserAvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </UserAvatarContext.Provider>
  );
}

export function useUserAvatar() {
  const context = useContext(UserAvatarContext);
  if (context === undefined) {
    throw new Error("useUserAvatar must be used within a UserAvatarProvider");
  }
  return context;
}
