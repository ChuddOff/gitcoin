"use client";

import Image from "next/image";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between h-full w-full bg-gradient-to-b from-[#2EDEBE] to-[#A098FF]">
      <div
        className="flex flex-col items-center w-[989px] h-[280px] bg-repeat	bg-center ] rounded-[9px] mt-[19px]"
        style={{ background: "url('/gitcoin.gif')" }}
      >
        <h1 className="text-[72px] font-[700] mt-[61px] drop-shadow">
          TRADE WITH GITCOIN
        </h1>

        <div className="mt-[32px]">
          <SignedOut>
            <div className={"flex gap-[16px]"}>
              <SignUpButton>
                <div
                  className={
                    "w-[87px] h-[40px] rounded-[8px] bg-white flex items-center justify-center cursor-pointer"
                  }
                >
                  <h3 className="font-[700] text-[16px] text-black">
                    Register
                  </h3>
                </div>
              </SignUpButton>
              <SignInButton>
                <div
                  className={
                    "w-[87px] h-[40px] rounded-[8px] bg-black flex items-center justify-center cursor-pointer"
                  }
                >
                  <h3 className="font-[700] text-[16px] text-white">Log in</h3>
                </div>
              </SignInButton>
            </div>
          </SignedOut>
          {/* <SignedIn>
            <div className={"flex gap-3"}>
              <UserButton />
              <Link className={"text-violet uppercase"} href="/profile">
                {user?.username}
              </Link>
            </div>
          </SignedIn> */}
        </div>
      </div>
    </main>
  );
}
