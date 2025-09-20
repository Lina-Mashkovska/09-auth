"use client";

import Link from "next/link";          
import css from "./AuthNavigation.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";

export default function AuthNavigation() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  if (isAuthenticated && user) {
    return (
      <>
        <li className={css.navigationItem}>
          {}
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>

        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user.email}</p>
          <button
            className={css.logoutButton}
            onClick={async () => {
              await logout();
              clearAuth();
              window.location.href = "/sign-in";
            }}
          >
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}


