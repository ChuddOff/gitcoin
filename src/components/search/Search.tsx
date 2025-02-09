"use client";

import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Search: React.FC = () => {
  const router = useRouter();

  const [input, setInput] = useState<string>("");

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(
        `/exchange?tvwidgetsymbol=BITSTAMP%3A${input.toUpperCase()}USD`
      );
      window.location.reload();
    }
  };

  return (
    <div onKeyDown={onKeyPress} className="w-[360px] max-[700px]:hidden">
      <Input
        classNames={{
          base: "w-full h-[40px] ",
          mainWrapper: "h-full ",
          input: "text-small bg-transparent ",
          innerWrapper: "flex",
          inputWrapper:
            "rounded-[25px] h-full font-normal text-default-500 bg-[white] border-[1px] border-[black] data-[hover=true]:bg-[#F8F8FF] light:group-data-[focus=true]:bg-[#FFFFF0] !cursor-text dark:bg-[#292a30] dark:border-[#8a8a88] dark:group-data-[focus=true]:bg-[#292a30]",
        }}
        endContent={
          <div className="h-full flex items-center">
            <Image
              src="search.svg"
              alt="search"
              width={12}
              height={12}
              className="dark:invert"
            />
          </div>
        }
        label="Search (BTC, ETH)"
        size="sm"
        type="search"
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};

export default Search;
