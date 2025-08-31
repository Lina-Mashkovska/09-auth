import axios from "axios";
import { cookies } from "next/headers";
import type { User } from "@/types/user";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

/**
 * SSR-запит профілю. ПЕРЕДАЄМО куки заголовком Cookie,
 * щоб /api/users/me зміг ідентифікувати сесію.
 */
export async function getMeServer(): Promise<User | null> {
  const cookieHeader = cookies().toString(); // "a=b; c=d"

  const client = axios.create({
    baseURL,
    headers: { Cookie: cookieHeader },
  });

  const res = await client.get<User | null>("/users/me", {
    validateStatus: () => true,
  });

  return (res.data as User) ?? null;
}




