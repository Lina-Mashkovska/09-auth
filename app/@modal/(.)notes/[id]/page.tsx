// app/@modal/(.)notes/[id]/page.tsx
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getNoteById } from "@/lib/api/clientApi"; // ← було getSingleNote
import NotePreview from "./NotePreview.client";

type Params = { id: string };

export default async function NoteModalInterceptedPage({
  params,
}: {
  params: Promise<Params>; // Next.js 15: params як Promise
}) {
  const { id } = await params;

  // SSR prefetch → hydration
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}






