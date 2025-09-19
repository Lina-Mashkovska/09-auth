"use client";

import { useQuery } from "@tanstack/react-query";
import { getNoteById } from "@/lib/api/clientApi";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient({ id }: { id: string }) {
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
  });

  if (isLoading) return <div className={css.loading}>Loading note…</div>;
  if (isError || !note) return <div className={css.error}>Failed to load note</div>;

  return (
    <article className={css.note}>
      <header className={css.header}>
        <h1 className={css.title}>{note.title}</h1>
        <span className={css.tag}>{note.tag}</span>
      </header>
      <section className={css.content}>{note.content}</section>
    </article>
  );
}

