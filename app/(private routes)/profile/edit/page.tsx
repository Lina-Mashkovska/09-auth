// app/(private-routes)/profile/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { isAxiosError } from "axios";
import css from "./page.module.css";
import { getMe, updateMe } from "@/lib/api/clientApi";

export default function EditProfilePage() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const me = await getMe();
        if (!mounted) return;

        setUsername(me.username ?? "");
        setEmail(me.email);
        setAvatar(me.avatar ?? null);
      } catch (e: unknown) {
        const message = isAxiosError(e)
          ? (e.response?.data as { message?: string } | undefined)?.message ??
            "Failed to load profile"
          : "Failed to load profile";
        setError(message);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await updateMe({ username });
      router.replace("/profile");
    } catch (e: unknown) {
      const message = isAxiosError(e)
        ? (e.response?.data as { message?: string } | undefined)?.message ??
          "Failed to update profile"
        : "Failed to update profile";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {avatar ? (
          <Image
            src={avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        ) : (
          <div className={css.avatar} aria-label="No avatar" />
        )}

        <form className={css.profileInfo} onSubmit={onSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>

          {error ? <p className={css.error}>{error}</p> : null}
        </form>
      </div>
    </main>
  );
}

