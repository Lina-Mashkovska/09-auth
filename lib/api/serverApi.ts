import { cookies } from "next/headers";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import { api } from "./api";
import "server-only";

export async function getMeServer(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString(); 

  const res = await api.get<User | null>("/users/me", {
    headers: { Cookie: cookieHeader },
    validateStatus: () => true,
  });

  return res.data ?? null;
}


export async function getNoteServer(id: string): Promise<Note | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await api.get<Note | null>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
    validateStatus: () => true,
  });

  return res.data ?? null;
}


export async function checkSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await api.get<User | null>("/auth/session", {
    headers: { Cookie: cookieHeader },
    validateStatus: () => true,
  });

  return res.data ?? null;
}





