"use client";

import { api } from "@/trpc/react";
import {
  Button,
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

const OrdersHistory: React.FC = () => {
  const getAll = api.order.getAll.useQuery(undefined, {
    refetchInterval: 3000,
  });

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
        classNames={{
          th: "py-[5px] px-[10px] m-[0px] h-[20px] bg-white text-[15px]",
          base: "p-[0px] m-[0px] h-[165px] ",
          table: "p-[0px] m-[0px] h-[5px] ",
          tbody: "p-[0px] m-[0px] h-[5px]",
          emptyWrapper: "p-[0px] m-[0px] h-[5px]",
          wrapper: "p-[0px] m-[0px] h-full bg-white",
          td: "py-[1px] px-[10px] m-[0px] h-[10px] font-[500] text-[15px]",
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
          isLoading={getAll.isPending}
          items={getAll.data ?? []}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow
            // key={response?.bids.indexOf(item)}
            >
              <TableCell>
                {item.type === "buy" ? (
                  <Chip
                    size="lg"
                    variant="shadow"
                    classNames={{
                      base: "bg-[#6eed79] h-[25px] text-center ",
                      content:
                        "text-[#397730] text-[12px] font-bold w-[50px] text-center ",
                    }}
                  >
                    BUY
                  </Chip>
                ) : (
                  <Chip
                    size="lg"
                    variant="shadow"
                    classNames={{
                      base: "bg-[#ff6969] h-[25px] flex justify-center items-center text-center ",
                      content:
                        "text-[#397730] text-[12px] font-bold w-[50px] text-center ",
                    }}
                  >
                    SELL
                  </Chip>
                )}
              </TableCell>
              <TableCell>{item.orderPrice} USDT</TableCell>
              <TableCell>{item.fill} USDT</TableCell>
              <TableCell>
                {item.TakeProfit} / {item.StopLoss}
              </TableCell>
              <TableCell>
                <div className="flex gap-[9px]">
                  <Button>Установить TP/SL</Button>
                  <Button>Закрыть по рс</Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersHistory;
