// lib/api/serverApi.ts
import "server-only";
import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// ---------- Users ----------
export async function getMeServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await api.get<User | null>("/users/me", {
    headers: { Cookie: cookieHeader },
    validateStatus: () => true,
  });

  return res.data ?? null;
}

// ---------- Notes ----------
export async function getNoteServer(id: string): Promise<Note | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await api.get<Note | null>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
    validateStatus: () => true,
  });

  return res.data ?? null;
}

// ---------- Session ----------
export async function checkSession(
  cookieHeader: string
): Promise<AxiosResponse<User | null>> {
  return api.get<User | null>("/auth/session", {
    headers: { Cookie: cookieHeader },
    validateStatus: () => true,
  });
}












