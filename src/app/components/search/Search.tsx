import React from "react";
import { Input } from "@nextui-org/react";
import Image from "next/image";

interface SearchProps {
  input: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ input }) => {
  return (
    <Input
      classNames={{
        base: "max-w-full max-w-[430px] w-full h-[40px] ",
        mainWrapper: "h-full ",
        input: "text-small bg-transparent ",
        innerWrapper: "flex",
        inputWrapper:
          "rounded-[25px] h-full font-normal text-default-500 bg-[white] border-[1px] border-[black] data-[hover=true]:bg-[#F8F8FF] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text",
      }}
      endContent={
        <div className="h-full flex items-center">
          <Image src="search.svg" alt="search" width={12} height={12} />
        </div>
      }
      label="Search"
      size="sm"
      type="search"
      onChange={(e) => input(e.target.value)}
    />
  );
};

export default Search;
