// lib/api/api.ts
import axios, { type AxiosResponse } from "axios";
import type { Note, NewNote } from "@/types/note";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});



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

function readTotalPagesFromHeaders(res: AxiosResponse, keys: string[]): number | null {
 
  const h = res.headers as Record<string, string | string[] | undefined>;
  for (const k of keys) {
    const v = h[k];
    if (typeof v === "string") {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) return n;
    } else if (Array.isArray(v) && typeof v[0] === "string") {
      const n = Number(v[0]);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }
  return null;
}

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

  const res = await api.get("/notes", { params });
  const data: unknown = res.data;


  if (Array.isArray(data)) {
    const totalFromHeaders = readTotalPagesFromHeaders(res, [
      "x-total-pages",
      "x-totalpages",
      "x-total-pages-count",
    ]);
    return {
      notes: data as Note[],
      totalPages: totalFromHeaders ?? 1,
    };
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "notes" in data &&
    Array.isArray((data as { notes: unknown }).notes)
  ) {
    const obj = data as { notes: Note[]; totalPages?: number };
    return { notes: obj.notes, totalPages: typeof obj.totalPages === "number" ? obj.totalPages : 1 };
  }

  throw new Error("Invalid /notes response shape");
}

export async function getSingleNote(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(payload: NewNote): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}


export const addNote = createNote;

export async function deleteNote(noteId: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${noteId}`);
  return data;
}






