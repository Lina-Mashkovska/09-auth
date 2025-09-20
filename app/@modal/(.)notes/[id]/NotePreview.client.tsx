// app/@modal/(.)notes/[id]/NotePreview.client.tsx
"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getNoteById } from "@/lib/api/clientApi"; // ← було getSingleNote з ./api
import type { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

type Props = { id: string };

export default function NotePreview({ id }: Props) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id), // ← викликаємо клієнтську функцію
    refetchOnMount: false,
  });

  return (
    <Modal isOpen onClose={() => router.back()}>
      <div className={css.container}>
        {isLoading && <p>Loading…</p>}
        {isError && <p>Failed to load note</p>}

        {note && (
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              <span className={css.tag}>{note.tag}</span>
            </div>

            <div className={css.content}>{note.content}</div>

            {note.createdAt && (
              <time className={css.date}>
                {new Date(note.createdAt).toLocaleString()}
              </time>
            )}

            <button className={css.backBtn} onClick={() => router.back()} type="button">
              ← Back
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}




