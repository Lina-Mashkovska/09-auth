// app/@modal/(.)notes/[id]/page.tsx
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NotePreview from "./NotePreview.client";

import { getNoteServer } from "@/lib/api/serverApi";

type Params = { id: string };

export default async function NoteModalInterceptedPage({
  params,
}: {
  params: Promise<Params>; 
}) {
  const { id } = await params;


  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteServer(id), 
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}







