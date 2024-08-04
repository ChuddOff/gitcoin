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
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const YourOrders: React.FC = () => {
  const searchParams = useSearchParams();
  const tvwidgetsymbol = searchParams.get("tvwidgetsymbol");

  const typeCoin =
    (tvwidgetsymbol?.slice(tvwidgetsymbol?.indexOf(":") + 1, -3) ?? "BTC") +
    "/USDT";

  const getAll = api.order.getAll.useQuery(undefined, {
    refetchInterval: 3000,
  });

  const costs = api.coin.getCosts.useQuery(
    {
      type: typeCoin,
    },
    {
      refetchInterval: 3000,
    }
  );

  const updateOrder = api.order.updateOrder.useMutation({
    onSuccess: (data) => {
      if (data) {
        toast.success("TP и SL успешно изменены!");
      }
    },
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [TP, setTP] = useState<number>();
  const [SL, setSL] = useState<number>();

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
          items={getAll.data?.filter((item) => item.completed === false) ?? []}
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
              <TableCell>
                {costs.data?.price ?? 0 - item.orderPrice} USDT
              </TableCell>
              <TableCell>
                {item.TakeProfit} / {item.StopLoss}
              </TableCell>
              <TableCell>
                <div className="flex gap-[9px]">
                  <Button
                    onClick={() => {
                      setCurrentOrder(item.id);
                      onOpen();
                    }}
                  >
                    Установить TP/SL
                  </Button>
                  <Button>Закрыть по рс</Button>
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
                Укажите TP и SL (поля необязательные)
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="TP"
                  type="number"
                  variant="bordered"
                  className="text-black"
                />
                <Input
                  label="SL"
                  type="number"
                  variant="bordered"
                  className="text-black"
                />
                <div className="flex py-2 px-1 justify-between"></div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    updateOrder.mutate({
                      id: currentOrder,
                      tp: TP ?? 0,
                      sl: SL ?? 0,
                    });
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
