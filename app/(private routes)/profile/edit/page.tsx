"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import css from "./page.module.css"; // скопіюй зі стилів курсу
import { getSession, updateMe } from "@/lib/api/clientApi";

export default function EditProfilePage() {
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: updateMe,
    onSuccess: () => router.replace("/profile"),
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = String(form.get("username"));
    await mutateAsync({ username });
  }

  if (isLoading) return <div className={css.mainContent}>Loading...</div>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <img
          src={user?.avatar ?? "avatar"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={onSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={user?.username ?? ""}
              className={css.input}
            />
          </div>

          <p>Email: {user?.email ?? "user_email@example.com"}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={isPending}>
              Save
            </button>
            <button type="button" className={css.cancelButton} onClick={() => router.back()}>
              Cancel
            </button>
          </div>

          {error ? <p className={css.error}>Failed to save</p> : null}
        </form>
      </div>
    </main>
  );
}


