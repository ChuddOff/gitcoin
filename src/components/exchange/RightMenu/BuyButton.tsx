"use client";

import { api } from "@/trpc/react";
import { Button, Selection } from "@nextui-org/react";
import toast from "react-hot-toast";

interface Props {
  price: number;
  currentPrise: boolean;
  fill: string | number;
  costs: any;
  typeCoin: string;
  userDeposit: any;
  buy: any;
  buyOrder: any;
  tvwidgetsymbol: string | null;
  inputType: Set<"usdt" | "coin">;
}

export default function BuyButton({
  price,
  currentPrise,
  fill,
  costs,
  typeCoin,
  userDeposit,
  tvwidgetsymbol,
  inputType,
}: Props) {
  const utils = api.useUtils();
  const usdtOrCoin = inputType.has("usdt")
    ? Number(fill)
    : Number(fill) * (costs.data?.price ?? 1);

  const buyOrder = api.order.buyOrder.useMutation({
    onSuccess: async (data) => {
      if (data && !data.isAlreadyCompleted) {
        await Promise.all([
          userDeposit.refetch(),
          utils.order.getAll.invalidate(),
        ]);

        toast.success("Ордер успешно создан!");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const buy = api.coin.buy.useMutation({
    onSuccess: async (data) => {
      if (data) {
        await Promise.all([
          userDeposit.refetch(),
          utils.order.getAll.invalidate(),
        ]);

        toast.success(
          "Вы успешно преобрели " +
            data.coin +
            " в размере " +
            (data.amount / (costs.data?.price ?? 1)).toFixed(4)
        );
      }
    },
  });

  return (
    <Button
      isDisabled={
        Number(fill).toString() !== fill ||
        Number(fill) <= 0 ||
        price <= 0 ||
        (userDeposit.data ?? 0) === 0
      }
      color="success"
      isLoading={buyOrder.isPending}
      className="text-white text-[15px] w-[120px] rounded-[5px] bg-[#20B26C]"
      onClick={() => {
        if (currentPrise) {
          buy.mutate({
            cost: price,
            coin: typeCoin,
            amount: usdtOrCoin,
          });
          buyOrder.mutate({
            price: price,
            fill: usdtOrCoin,
            symbol: tvwidgetsymbol || "BITSTAMP:BTCUSD",
            isAlreadyCompleted: true,
          });
        } else {
          buyOrder.mutate({
            price: price,
            fill: usdtOrCoin,
            symbol: tvwidgetsymbol || "BITSTAMP:BTCUSD",
            isAlreadyCompleted: false,
          });
        }
      }}
    >
      Купить
    </Button>
  );
}
