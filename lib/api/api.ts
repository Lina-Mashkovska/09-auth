import axios from "axios";
import type { Note, NewNote, NoteTag } from "@/types/note";
import type { User } from "@/types/user";


const baseURL =
  typeof window === "undefined"
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ---------- Auth ----------
export const register = async (body: { email: string; password: string; userName: string }): Promise<User> => {
  const res = await api.post<User>("/auth/register", body);
  return res.data;
};

export const login = async (body: { email: string; password: string }): Promise<User> => {
  const res = await api.post<User>("/auth/login", body);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getSession = async (): Promise<User | null> => {
  try {
    const res = await api.get<User | null>("/auth/session", { validateStatus: () => true });
    return res.data ?? null;
  } catch {
   
    return null;
  }
};

// ---------- Notes ----------
export const createNote = async (payload: NewNote): Promise<Note> => {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
};

export const getSingleNote = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};


export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

type GetNotesArgs = {
  page: number;
  perPage?: number;          // за замовчуванням 12
  search?: string;
  tag?: NoteTag | undefined; // "all" не передаємо
};

export const getNotes = async ({
  page,
  perPage = 12,
  search = "",
  tag,
}: GetNotesArgs): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;
  if (typeof tag === "string") params.tag = tag;

  const res = await api.get<NotesResponse>("/notes", { params });
  return res.data;
};

// видалення нотатки
export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};











