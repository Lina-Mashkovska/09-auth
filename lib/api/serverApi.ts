// lib/api/serverApi.ts
import { cookies } from "next/headers";
import { api as shared } from "@/lib/api/api";
import type { User } from "@/types/user";

async function serverHeaders() {
  const jar = await cookies();          
  return { Cookie: jar.toString() };
}


export async function sGetSession(): Promise<User | null> {
  const res = await shared.get("/auth/session", {
    headers: await serverHeaders(),   
    validateStatus: () => true,
  });
  return res.data ? (res.data as User) : null;
}


export async function sGetMe(): Promise<User> {
  const user = await sGetSession();
  if (!user) throw new Error("No active session");
  return user;
}

