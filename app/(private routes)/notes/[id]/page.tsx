// app/(private routes)/notes/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNoteServer } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
import css from "./NoteDetails.module.css";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const note = await getNoteServer(id);
    if (!note) throw new Error("not found");

    const plain = (note.content ?? "").replace(/\s+/g, " ").trim();
    const description =
      plain.length > 160 ? `${plain.slice(0, 157)}…` : plain || "Note details";
    const title = note.title || "Note details";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${siteUrl}/notes/${id}`,
        siteName: "NoteHub",
        type: "article",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "NoteHub",
          },
        ],
      },
    };
  } catch {
    const title = "Note not found";
    const description = "Такої нотатки не існує або вона була видалена.";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${siteUrl}/notes/${id}`,
        siteName: "NoteHub",
        type: "article",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "NoteHub — note not found",
          },
        ],
      },
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // опціонально: швидка перевірка на сервері
  const note = await getNoteServer(id);
  if (!note) {
    notFound();
  }

  return (
    <main className={css.wrapper}>
      <NoteDetailsClient id={id} />
    </main>
  );
}





