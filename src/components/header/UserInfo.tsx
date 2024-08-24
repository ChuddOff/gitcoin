"use client";

import { Session } from "next-auth";
import Image from "next/image";

interface Props {
  session: Session | null;
}

export default function UserInfo({ session }: Props) {
  return (
    <div className=" flex items-center gap-2">
      <Image
        src={session?.user.image as string}
        alt="profile"
        width={32}
        height={32}
        className="cursor-pointer rounded-full"
      />
      {window && window.innerWidth > 1400 && (
        <div className=" text-black dark:invert">
          <p className=" text-sm font-medium">{session?.user.name}</p>
          <p className=" text-xs font-medium">{session?.user.email}</p>
        </div>
      )}
    </div>
  );
}
