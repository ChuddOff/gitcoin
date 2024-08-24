import React, { useEffect, useState } from "react";
import {
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Switch,
} from "@nextui-org/react";
import Search from "../search/Search";
import Image from "next/image";
import UserInfo from "./UserInfo";
import { Session } from "next-auth";
import DarkMode from "./DarkMode";

interface Props {
  session: Session | null;
}

const Header = ({ session }: Props) => {
  return (
    <Navbar
      isBordered={true}
      className="light select-none light:bg-white dark:bg-[#141417]"
    >
      <NavbarBrand>
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="logo"
            width={44.23}
            height={41.49}
            className="dark:invert"
          />
        </Link>
        <NavbarItem className="flex justify-center items-center w-[64px] pl-[36px]">
          <DarkMode />
        </NavbarItem>
      </NavbarBrand>

      <NavbarContent as="div" className="sm:flex" justify="center">
        <NavbarItem className="w-full flex justify-center items-center">
          <Search />
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
              className="cursor-pointer h-[32px] dark:invert"
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
              className="cursor-pointer h-[32px] dark:invert"
            />
          </Link>
        </NavbarItem>
        <NavbarItem>
          {session?.user ? (
            <UserInfo session={session} />
          ) : (
            <Link href="/login">Login</Link>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
