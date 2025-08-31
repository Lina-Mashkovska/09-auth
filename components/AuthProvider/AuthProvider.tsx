"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearAuth } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await getSession();
        if (user) setUser(user);
        else clearAuth();
      } finally {
        setChecking(false);
      }
    })();
  }, [setUser, clearAuth]);

  if (checking) return <div style={{ padding: 24 }}>Loading...</div>;

  return <>{children}</>;
}
