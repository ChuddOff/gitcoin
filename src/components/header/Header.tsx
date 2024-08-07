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
import { getServerAuthSession } from "@/server/auth";

const Header = async () => {
  const session = await getServerAuthSession();

  return (
    <Navbar isBordered={true} className="select-none bg-white">
      <NavbarBrand>
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={44.23} height={41.49} />
        </Link>
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
          {session?.user ? (
            <div className=" flex items-center gap-2">
              <Image
                src={session?.user.image as string}
                alt="profile"
                width={32}
                height={32}
                className="cursor-pointer rounded-full"
              />
              <div>
                <p className=" text-sm font-medium">{session?.user.name}</p>
                <p className=" text-xs font-medium">{session?.user.email}</p>
              </div>
            </div>
          ) : (
            <Link href={"/login"}>Login</Link>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
