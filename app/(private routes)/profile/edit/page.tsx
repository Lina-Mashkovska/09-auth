"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./page.module.css";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function EditProfilePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { setUser } = useAuthStore();


  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const mutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
     
      qc.setQueryData(["me"], updatedUser);
      
      setUser(updatedUser);
  
      router.push("/profile");
      router.refresh();
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username") ?? "");
    mutation.mutate({ username });
  };

  if (isLoading) {
    return <div className={css.mainContent}>Loading...</div>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user?.avatar || "/default-avatar.png"}
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
              required
            />
          </div>

          <p>Email: {user?.email ?? "user_email@example.com"}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>

          {mutation.isError ? <p className={css.error}>Failed to save</p> : null}
        </form>
      </div>
    </main>
  );
}



