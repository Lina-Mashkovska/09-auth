"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();
  const { user, setUser, clearIsAuthenticated } = useAuthStore();
  const authed = !!user;

  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await getSession();
      if (mounted) setUser(u);
    })();
    return () => { mounted = false; };
  }, [setUser]);

  const handleLogout = async () => {
    await logout().catch(() => {});
    clearIsAuthenticated();
    setUser(null);
    router.replace("/sign-in");
  };

  return authed ? (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>Profile</Link>
      </li>
      <li className={css.navigationItem}>
        <button onClick={handleLogout} className={css.logoutButton}>Logout</button>
      </li>
    </>
  ) : (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>Sign in</Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>Sign up</Link>
      </li>
    </>
  );
}







