"use client";

import React, { useEffect, useState } from "react";
import {
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Search from "../search/Search";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserInfo from "./UserInfo";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

const Header = ({ session }: Props) => {
  const router = useRouter();

  const [input, setInput] = useState<string>("");

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/exchange/${input}`);
    }
  };

  return (
    <Navbar isBordered={true} className="select-none bg-white">
      <NavbarBrand>
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={44.23} height={41.49} />
        </Link>
      </NavbarBrand>

      <NavbarContent as="div" className="sm:flex" justify="center">
        <NavbarItem className="w-full flex justify-center items-center">
          <div onKeyDown={onKeyPress} className="w-[430px]">
            <Search input={setInput} />
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Link className={"text-violet uppercase"} href="/exchange">
            <Image
              src="/exchange.svg"
              alt="exchange"
              width={32}
              height={32}
              className="cursor-pointer h-[32px]"
            />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className={"text-violet uppercase"} href="/wallet">
            <Image
              src="/wallet.svg"
              alt="wallet"
              width={32}
              height={32}
              className="cursor-pointer h-[32px]"
            />
          </Link>
        </NavbarItem>
        <NavbarItem>
            {session?.user ? <UserInfo session={session}/> : <Link href="/login">Login</Link>}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
