"use server";

type Session = { user: { id: string } } | null;

export async function getSession(): Promise<Session> {
  return null;
}

export async function getUserId() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}
