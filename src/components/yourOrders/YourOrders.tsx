"use client";

import {
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const YourOrders: React.FC = () => {
  //   const [state, setState] = useState<number>(0);

  //   const text = useRef<HTMLDivElement>(null);

  //   const switchText = () => {
  //     setState((state) => (state % text.current!.childElementCount) + 1);
  //   };

  //   useEffect(() => {
  //     const interval = setInterval(switchText, 20000);
  //     return () => clearInterval(interval);
  //   }, []);

  return (
    <div className="w-full h-full overflow-x-hidden items-center bg-[#fffbfb]">
      <Table
        aria-label="Example static collection table"
        radius="sm"
        layout="fixed"
        classNames={{
          th: "w-full py-[5px] px-[10px] m-[0px] h-[59px] bg-white",
          base: "w-full p-[0px] m-[0px] h-[165px] ",
          table: "w-full p-[0px] m-[0px] h-[5px] ",
          tbody: "w-full p-[0px] m-[0px] h-[5px]",
          emptyWrapper: "w-full p-[0px] m-[0px] h-[5px]",
          wrapper: "w-full p-[0px] m-[0px] h-full bg-white",
          //   td: "py-[1px] px-[10px] m-[0px] h-[10px] text-[#45be84] font-[500] text-[12px]",
        }}
      >
        <TableHeader>
          <TableColumn>Тип</TableColumn>
          <TableColumn>Цена оредера</TableColumn>
          <TableColumn>Маржа</TableColumn>
          <TableColumn>TP/SL</TableColumn>
          <TableColumn>Действия</TableColumn>
        </TableHeader>
        <TableBody
        //   items={response?.bids.slice(0, 8) || []}
        //   loadingContent={<Spinner label="Loading..." />}
        >
          {/* {(item) => ( */}
          <TableRow
          // key={response?.bids.indexOf(item)}
          >
            <TableCell>
              <Chip
                variant="shadow"
                classNames={{
                  base: "bg-[#6eed79)] from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                  content: "text-[#397730]",
                }}
              >
                New
              </Chip>
            </TableCell>
            <TableCell>66.372,25 USDT</TableCell>
            <TableCell>547 USDT</TableCell>
            <TableCell>547 USDT</TableCell>
            <TableCell>5472123232 USDT</TableCell>
          </TableRow>
          {/* )} */}
        </TableBody>
      </Table>
    </div>
  );
};

export default YourOrders;
