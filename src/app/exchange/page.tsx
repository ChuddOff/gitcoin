import { getServerAuthSession } from "@/server/auth";
import "./page.css";
import AppExchange from "@/components/appExchange/AppExchange";

export default async function Home() {
  const session = await getServerAuthSession();

  return <AppExchange session={session} />;
}
