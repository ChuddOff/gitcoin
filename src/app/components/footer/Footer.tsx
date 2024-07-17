"use client";

import React from "react";
import { Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Footer = () => {
  const pathName = usePathname();

  return (
    <>
      {!pathName.toString().includes("/upload") && (
        <footer className="h-[329px] w-[100%] pt-[41px] flex gap-[16px] bg-[white] top-[0px] text-black">
          <div className="h-full">
            <nav className="flex flex-row items-center gap-[16px] w-[262px] text-black ml-[32px]">
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-white"
                >
                  <Image src="/x.svg" alt="logo" width={24} height={24} />
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-white"
                >
                  <Image src="/inst.svg" alt="logo" width={24} height={24} />
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-white"
                >
                  <Image src="/youtube.svg" alt="logo" width={24} height={24} />
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-white"
                >
                  <Image src="/in.svg" alt="logo" width={24} height={24} />
                </Link>
              </ul>
            </nav>
          </div>

          <div className="flex flex-col gap-[28px]">
            <h3 className="font-[600] text-[16px]">Use cases</h3>
            <nav className="flex flex-col gap-[16px] w-[262px] ">
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  UI design
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  UX design
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  Wireframing
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  Diagramming
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  Brainstorming
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  Online whiteboard
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  Team collaboration
                </Link>
              </ul>
            </nav>
          </div>
          <div className="flex flex-col gap-[28px]">
            <h3 className="font-[600] text-[16px]">Explore</h3>
            <nav className="flex flex-col gap-[16px] w-[262px] ">
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  Design
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  Prototyping
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  Development features
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black"
                >
                  Design systems
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  Collaboration features
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  Design process
                </Link>
              </ul>
              <ul>
                <Link
                  href="https://www.youtube.com/@chudd_off"
                  className="text-black text-[16px] font-[400]"
                >
                  FigJam
                </Link>
              </ul>
            </nav>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
