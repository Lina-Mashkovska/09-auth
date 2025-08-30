"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

const PRIVATE_PREFIXES = ["/profile", "/notes"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearAuth } = useAuthStore();
  const [checking, setChecking] = useState(true);

  const mustBePrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    let mounted = true;

    (async () => {
      setChecking(true);
      const user = await getSession();

      if (!mounted) return;

      if (user) {
        setUser(user);
        if (pathname === "/sign-in" || pathname === "/sign-up") {
          router.replace("/profile");
        }
      } else {
        clearAuth();
        if (mustBePrivate) {
          try { await logout(); } catch {}
          router.replace("/sign-in");
        }
      }

      setChecking(false);
    })();

    return () => { mounted = false; };
  }, [pathname, router, setUser, clearAuth, mustBePrivate]);

  if (checking && mustBePrivate) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <p>Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
