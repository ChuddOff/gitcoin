import Link from "next/link";
import { getServerAuthSession } from "../server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between h-full w-full bg-gradient-to-b from-[#2EDEBE] to-[#A098FF]">
      <div
        className="flex flex-col items-center w-[989px] h-[280px] bg-repeat	bg-center ] rounded-[9px] mt-[19px]"
        style={{ background: "url('/gitcoin.gif')" }}
      >
        <h1 className="text-[72px] font-[700] mt-[61px] drop-shadow">
          TRADE WITH GITCOIN
        </h1>
        {session?.user.deposit}
        <div className="mt-[32px]">
          <Link href={"/login"}>Login</Link>
          <Link href={"/register"}>Register</Link>
        </div>
      </div>
    </main>
  );
}
