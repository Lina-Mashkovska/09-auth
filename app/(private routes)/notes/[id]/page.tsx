"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import css from "./page.module.css"; // візьми стилі з пакета курсу
import { getNotes, deleteNote, type NotesResponse } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

const PER_PAGE = 12;

export default function NotesPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const page = Math.max(1, Number(sp.get("page") ?? 1));
  const search = sp.get("search") ?? "";
  const tag = sp.get("tag") ?? undefined;

  // простий debounce для пошуку
  const timerRef = useRef<number | null>(null);
  const setSearch = (value: string) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const params = new URLSearchParams(sp.toString());
      if (value) params.set("search", value);
      else params.delete("search");
      params.set("page", "1");
      router.replace(`/notes?${params.toString()}`);
    }, 400);
  };

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(nextPage));
    router.replace(`/notes?${params.toString()}`);
  };

  const setTag = (nextTag?: string) => {
    const params = new URLSearchParams(sp.toString());
    if (nextTag && nextTag.toLowerCase() !== "all") params.set("tag", nextTag);
    else params.delete("tag");
    params.set("page", "1");
    router.replace(`/notes?${params.toString()}`);
  };

  const { data, isLoading, isError, refetch, isFetching } = useQuery<NotesResponse>({
    queryKey: ["notes", { page, perPage: PER_PAGE, search, tag }],
    queryFn: () => getNotes({ page, perPage: PER_PAGE, search, tag }),
    placeholderData: keepPreviousData,
  });

  const qc = useQueryClient();
  const delMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  const totalPages = data?.totalPages ?? 1;
  const notes = data?.notes ?? [];

  useEffect(() => {
    if (!isLoading && notes.length === 0 && page > 1) {
      setPage(page - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, notes.length]);

  const disabledPrev = page <= 1;
  const disabledNext = page >= totalPages;

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this note?");
    if (!ok) return;
    await delMutation.mutateAsync(id);
  };

  const showingRange = useMemo(() => {
    const start = (page - 1) * PER_PAGE + 1;
    const end = Math.min(page * PER_PAGE, (totalPages - 1) * PER_PAGE + notes.length);
    return `${start}–${end}`;
  }, [page, notes.length, totalPages]);

  return (
    <main className={css.mainContent}>
      <section className={css.toolbar}>
        <div className={css.searchGroup}>
          <label htmlFor="search" className={css.visuallyHidden}>Search</label>
          <input
            id="search"
            type="text"
            defaultValue={search}
            className={css.input}
            placeholder="Search notes..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={css.selectGroup}>
          <label htmlFor="tag" className={css.visuallyHidden}>Tag</label>
          <select
            id="tag"
            className={css.select}
            value={tag ?? "All"}
            onChange={(e) => setTag(e.target.value)}
          >
            <option>All</option>
            <option>Todo</option>
            <option>Work</option>
            <option>Home</option>
            <option>Project</option>
            <option>Important</option>
          </select>
        </div>

        <div aria-live="polite" className={css.hint}>
          {isFetching ? "Updating…" : notes.length ? `Showing ${showingRange}` : null}
        </div>
      </section>

      {isLoading ? (
        <p>Loading…</p>
      ) : isError ? (
        <p className={css.error}>
          Failed to load notes. <button onClick={() => refetch()}>Retry</button>
        </p>
      ) : notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul className={css.noteGrid}>
          {notes.map((n: Note) => (
            <li key={n.id} className={css.noteCard}>
              <div className={css.noteHeader}>
                <h3 className={css.noteTitle}>{n.title}</h3>
                <span className={css.noteTag}>{n.tag}</span>
              </div>
              <p className={css.noteContent}>{n.content}</p>
              <div className={css.noteActions}>
                <button className={css.deleteButton} onClick={() => handleDelete(n.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <nav className={css.pagination} aria-label="Pagination">
        <button className={css.pageButton} onClick={() => setPage(page - 1)} disabled={disabledPrev}>
          Prev
        </button>
        <span className={css.pageInfo}>Page {page} / {totalPages}</span>
        <button className={css.pageButton} onClick={() => setPage(page + 1)} disabled={disabledNext}>
          Next
        </button>
      </nav>
    </main>
  );
}


