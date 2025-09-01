import type { Metadata } from "next";
import css from "./page.module.css"; 
import { getMeServer } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile — NoteHub",
  description: "User profile page",
  robots: { index: false },
};

export default async function ProfilePage() {
  const user = await getMeServer();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <img
            src={user?.avatar ?? "Avatar"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user?.username ?? "your_username"}</p>
          <p>Email: {user?.email ?? "your_email@example.com"}</p>
        </div>
      </div>
    </main>
  );
}


