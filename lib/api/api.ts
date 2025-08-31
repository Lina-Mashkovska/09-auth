import axios from "axios";
import type { Note, NewNote } from "@/types/note";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});


export const createNote = async (payload: NewNote): Promise<Note> => {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
};








