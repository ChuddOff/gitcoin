import { getServerAuthSession } from "@/server/auth";
import Header from "./Header";

export default async function HeaderWrapper() {
  const session = await getServerAuthSession();

  return <Header session={session} />;
}
