import { api } from "@/lib/api/api";
import type { User } from "@/types/user";

export async function register(payload: { email: string; password: string }): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}
export async function login(payload: { email: string; password: string }): Promise<User> {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
export async function getSession(): Promise<User | null> {
  const res = await api.get("/auth/session", { validateStatus: () => true });
  return res.data ? (res.data as User) : null;
}

export async function getMe(): Promise<User> {
  const user = await getSession();
  if (!user) throw new Error("No active session");
  return user;
}

export async function updateMe(payload: Partial<Pick<User, "username">>): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}


