"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/api/api";
import { useAuthStore } from "@/lib/store/authStore";

const PRIVATE = ["/profile", "/notes"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await getSession();     // ← ключова відмінність
      if (!mounted) return;
      setUser(u);
      const isPrivate = PRIVATE.some((p) => pathname.startsWith(p));
      if (!u && isPrivate) {
        await logout().catch(() => {});
        clearIsAuthenticated();
        router.replace("/sign-in");
        return;
      }
      setChecking(false);
    })();
    return () => { mounted = false; };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (checking) return <div style={{ padding: 16 }}>Loading…</div>;
  return <>{children}</>;
}


