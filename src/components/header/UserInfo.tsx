import { Session } from "next-auth";
import Image from "next/image";

interface Props {
    session: Session | null;
}

export default async function UserInfo({ session }: Props) {
  return (
    <div className=" flex items-center gap-2">
      <Image
        src={session?.user.image as string}
        alt="profile"
        width={32}
        height={32}
        className="cursor-pointer rounded-full"
      />
      <div className=" text-black">
        <p className=" text-sm font-medium">{session?.user.name}</p>
        <p className=" text-xs font-medium">{session?.user.email}</p>
      </div>
    </div>
  );
}
