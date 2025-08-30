// app/(private-routes)/profile/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import css from "./page.module.css";
import { sGetSession } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile page",
  openGraph: { title: "Profile – NoteHub", description: "User profile" },
};

export default async function ProfilePage() {
  const user = await sGetSession(); // читаємо користувача з /api/auth/session

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          ) : (
            <div className={css.avatar} aria-label="No avatar" />
          )}
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user?.username ?? "—"}</p>
          <p>Email: {user?.email ?? "—"}</p>
        </div>
      </div>
    </main>
  );
}

