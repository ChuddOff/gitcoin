"use client";

import { api } from "@/trpc/react";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { Orders } from "@prisma/client";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface YourOrdersInterface {
  cost: number;
  orderData: Omit<Orders, "userId">[];
  isPending: boolean;
}

const YourOrders = ({ cost, orderData, isPending }: YourOrdersInterface) => {
  const updateOrder = api.order.updateOrder.useMutation({
    onSuccess: (data) => {
      if (data) {
        toast.success("TP и SL успешно изменены!");
      }
    },
  });

  return (
    <div className="w-full h-full overflow-x-hidden items-center bg-[#fffbfb]">
      <Table
        aria-label="Example static collection table"
        radius="sm"
        isHeaderSticky={true}
        classNames={{
          th: "py-[5px] px-[10px] m-[0px] h-[20px] bg-white text-[15px] dark:bg-[#101014] dark:text-white dark:shadow-none",
          base: "p-[0px] m-[0px] h-[150px] dark:bg-[#101014] dark:border-[#8a8888] dark:text-white dark:shadow-none",
          table:
            "p-[0px] m-[0px] h-[5px] focus-within:outline-none dark:bg-[#101014] dark:border-[#8a8888] dark:text-white",
          tbody:
            "p-[0px] m-[0px] h-[5px] dark:bg-[#101014] dark:border-[#8a8888]",
          emptyWrapper:
            "p-[0px] m-[0px] h-[5px] dark:bg-[#101014] dark:border-[#8a8888]",
          wrapper:
            "p-[0px] m-[0px] h-full bg-white dark:bg-[#101014] dark:border-[#8a8888]",
          td: "py-[4.5px] px-[10px] m-[0px] h-[10px] font-[500] text-[15px] dark:bg-[#101014] dark:border-[#8a8888] dark:shadow-none",
        }}
      >
        <TableHeader>
          <TableColumn>Тип</TableColumn>
          <TableColumn>Цена оредера</TableColumn>
          <TableColumn>Маржа</TableColumn>
          <TableColumn>TP/SL</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isPending}
          items={orderData.filter((item) => item.completed === true) ?? []}
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
                    classNames={{
                      base: "bg-[#6eed79] h-[25px] text-center dark:shadow-none",
                      content:
                        "text-[#397730] text-[12px] font-bold w-[50px] text-center dark:shadow-none",
                    }}
                  >
                    BUY
                  </Chip>
                ) : (
                  <Chip
                    size="lg"
                    classNames={{
                      base: "bg-[#ff6969] h-[25px] flex justify-center items-center text-center dark:shadow-none",
                      content:
                        "text-[#397730] text-[12px] font-bold w-[50px] text-center dark:shadow-none",
                    }}
                  >
                    SELL
                  </Chip>
                )}
              </TableCell>
              <TableCell>{item.orderPrice} USDT</TableCell>
              <TableCell>{cost ?? 0 - item.orderPrice} USDT</TableCell>
              <TableCell>
                {item.TakeProfit} / {item.StopLoss}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default YourOrders;
