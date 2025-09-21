// lib/api/clientApi.ts
import { api } from "./api";
import type { User } from "@/types/user";
import type { Note, NewNote } from "@/types/note";

// ---------- Auth ----------
export async function register(body: { email: string; password: string }): Promise<User> {
  const res = await api.post<User>("/auth/register", body);
  return res.data;
}

export async function login(body: { email: string; password: string }): Promise<User> {
  const res = await api.post<User>("/auth/login", body);
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getSession(): Promise<User | null> {
  try {
    const res = await api.get<User | null>("/auth/session", { validateStatus: () => true });
    // ✅ важливо: сесія валідна ТІЛЬКИ коли status === 200 і є дані
    return res.status === 200 && res.data ? res.data : null;
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const res = await api.get<User>("/users/me", { validateStatus: () => true });
    return res.status === 200 && res.data ? res.data : null;
  } catch {
    return null;
  }
}

export async function updateMe(patch: Partial<User>): Promise<User> {
  const res = await api.patch<User>("/users/me", patch);
  return res.data;
}

// ---------- Notes ----------
export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function getNotes(params: {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string | undefined;
}): Promise<NotesResponse> {
  const { page, perPage = 12, search = "", tag } = params;
  const query: Record<string, string | number> = { page, perPage };
  if (search) query.search = search;

  const isAll = typeof tag === "string" && tag.toLowerCase() === "all";
  if (tag && !isAll) query.tag = tag;

  const res = await api.get<NotesResponse>("/notes", { params: query });
  return res.data;
}

export async function getNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function createNote(payload: NewNote): Promise<Note> {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}
