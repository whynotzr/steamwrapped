import { LandingPage } from "@/components/home/LandingPage";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return <LandingPage hasError={params.error === "auth_failed"} />;
}
