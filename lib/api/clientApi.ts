import { api } from "./api";
import type { User } from "@/types/user";
import type { Note, NewNote } from "@/types/note";

// ---------- Auth ----------
export async function login(body: { email: string; password: string }): Promise<User> {
  const { data } = await api.post<User>("/auth/login", body);
  return data;
}

export async function register(body: { email: string; password: string }): Promise<User> {
  const { data } = await api.post<User>("/auth/register", body);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getSession(): Promise<User | null> {
  const res = await api.get<User | null>("/auth/session", { validateStatus: () => true });
  return (res.data as User) ?? null;
}

export async function updateMe(patch: Partial<User>): Promise<User> {
  const { data } = await api.patch<User>("/users/me", patch);
  return data;
}

// ---------- Notes ----------
export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

type GetNotesArgs = {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string | undefined;
};

export async function getNotes({
  page,
  perPage = 12,
  search = "",
  tag,
}: GetNotesArgs): Promise<NotesResponse> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const isAll = typeof tag === "string" && tag.toLowerCase() === "all";
  if (tag && !isAll) params.tag = tag;

  const { data } = await api.get<NotesResponse>("/notes", { params });
  return data;
}

export async function getNote(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: NewNote): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}




