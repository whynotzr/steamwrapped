import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function WrappedRedirectPage() {
  const session = await getSession();
  if (!session.steamId) redirect("/");
  redirect(`/u/${session.steamId}`);
}
