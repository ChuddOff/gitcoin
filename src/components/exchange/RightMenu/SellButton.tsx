import { PocketItem } from "@/server/auth";
import { api } from "@/trpc/react";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";

interface Props {
    price: number;
    currentPrise: boolean;
    fill: string | number;
    costs: any;
    typeCoin: string;
    userPocket: PocketItem | undefined
    sell: any;
    sellOrder: any;
    tvwidgetsymbol: string | null;
    inputType: Set<"usdt" | "coin">;
}

export default function SellButton({
  price,
  currentPrise,
  fill,
  costs,
  typeCoin,
  tvwidgetsymbol,
  inputType,
  userPocket
}: Props) {
  const utils = api.useUtils();

  const sell = api.coin.sell.useMutation({
    onSuccess: async (data) => {
      if (data) {
        await Promise.all([
          utils.user.getUserDeposit.invalidate(),
          utils.order.getAll.invalidate(),
        ]);

        toast.success(
          "Вы успешно продали " +
            data.coin +
            " в размере " +
            (data.amount / (costs.data?.price ?? 1)).toFixed(4)
        );
      }
    },
  });

  const sellOrder = api.order.sellOrder.useMutation({
    onSuccess: async (data) => {
      if (data && !data.isAlreadyCompleted) {
        await utils.order.getAll.invalidate();
        toast.success("Ордер успешно создан!");
      }
    },
  });

  return (
    <Button
      isDisabled={
        Number(fill).toString() !== fill ||
        Number(fill) <= 0 ||
        (userPocket![typeCoin ] ?? 0) <= Number(fill) ||
        price <= 0
      }
      color="danger"
      className="text-white text-[15px] w-[120px] rounded-[5px] bg-[#EF454A]"
      isLoading={sellOrder.isPending}
      onClick={() => {
        if (currentPrise) {
          sellOrder.mutate({
            price: price,
            fill: inputType.has("usdt")
              ? Number(fill)
              : Number(fill) * (costs.data?.price ?? 1),
            symbol: tvwidgetsymbol || "BITSTAMP:BTCUSD",
            isAlreadyCompleted: true,
          });
          sell.mutate({
            cost: price,
            coin: typeCoin,
            amount: inputType.has("usdt")
              ? Number(fill)
              : Number(fill) * (costs.data?.price ?? 1),
          });
        } else {
          sellOrder.mutate({
            price: price,
            fill: inputType.has("usdt")
              ? Number(fill)
              : Number(fill) * (costs.data?.price ?? 1),
            symbol: tvwidgetsymbol || "BITSTAMP:BTCUSD",
            isAlreadyCompleted: false,
          });
        }
      }}
    >
      Продать
    </Button>
  );
}
