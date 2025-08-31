"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import css from "./SignInPage.module.css";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { isAxiosError } from "axios";            // ✅

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/profile";

  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    try {
      const user = await login({ email, password });
      setUser(user);
      router.replace(from);
    } catch (err: unknown) {                      // ✅ без any
      let msg = "Login failed";
      if (isAxiosError(err)) {
        msg = (err.response?.data as { message?: string } | undefined)?.message ?? err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    }
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={onSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>Log in</button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}





