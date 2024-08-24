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
  const buy = api.coin.buy.useMutation();

  const [currentOrder, setCurrentOrder] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [TP, setTP] = useState<number>(0);
  const [SL, setSL] = useState<number>(0);

  const utils = api.useUtils();

  const markAsCompleted = api.order.markAsCompleted.useMutation({
    onSuccess: async (data) => {
      if (data) {
        await utils.order.getAll.invalidate();
        toast.success(
          "Вы успешно преобрели " +
            data.symbol +
            " в размере " +
            (data.fill / (cost ?? 1)).toFixed(4)
        );
      }
    },
  });

  return (
    <div className="w-full h-full overflow-x-hidden items-center ">
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
          td: "py-[1px] px-[10px] m-[0px] h-[10px] font-[500] text-[15px] dark:bg-[#101014] dark:border-[#8a8888] dark:shadow-none",
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
          isLoading={isPending}
          items={orderData.filter((item) => item.completed === false) ?? []}
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
              <TableCell>
                <div className="flex gap-[9px]">
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentOrder(item.id);
                      setTP(item.TakeProfit);
                      setSL(item.StopLoss);
                      onOpen();
                    }}
                  >
                    Установить TP/SL
                  </Button>
                  <Button
                    size="sm"
                    onClick={async () => {
                      buy.mutate({
                        cost: item.orderPrice,
                        coin: item.symbol,
                        amount: item.fill,
                      });
                      markAsCompleted.mutate({
                        id: item.id,
                      });
                    }}
                  >
                    Закрыть по рс
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">
                Укажите TP и SL <br /> (Значение 0 - не установливать)
              </ModalHeader>
              <ModalBody>
                <Input
                  classNames={{
                    base: "dark:text-white",
                  }}
                  autoFocus
                  label="TP"
                  type="number"
                  variant="bordered"
                  className="text-black"
                  onChange={(e) =>
                    Number(e.target.value) > SL || SL === 0
                      ? setTP(Number(e.target.value))
                      : TP
                  }
                  value={TP?.toString()}
                />
                <Input
                  classNames={{
                    base: "dark:text-white",
                  }}
                  label="SL"
                  type="number"
                  variant="bordered"
                  className="text-black"
                  onChange={(e) =>
                    Number(e.target.value) < TP || TP === 0
                      ? setSL(Number(e.target.value))
                      : SL
                  }
                  value={SL?.toString()}
                />
                <div className="flex py-2 px-1 justify-between"></div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={updateOrder.isPending}
                  color="warning"
                  onPress={() => {
                    updateOrder.mutate({
                      id: currentOrder,
                      tp: TP ?? 0,
                      sl: SL ?? 0,
                    });
                    onClose();
                  }}
                >
                  Подтвердить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default YourOrders;
