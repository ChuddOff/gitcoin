import {
  Button,
  ButtonGroup,
  Input,
  Select,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import OrdersInfo from "../orders/Orders";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { Session } from "next-auth";
import { number } from "zod";

interface Props {
  session: Session | null;
}

export default function RightMenu({ session }: Props) {
  const searchParams = useSearchParams();
  const tvwidgetsymbol = searchParams.get("tvwidgetsymbol");
  const typeCoin =
    (tvwidgetsymbol?.slice(tvwidgetsymbol?.indexOf(":") + 1, -3) ?? "BTC") +
    "/USDT";
  const isValueIntOrFloat = (value: string) => {
    return !Number.isNaN(Number(value));
  };

  const fillButtons = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 75 },
    { value: 100 },
  ];

  const [price, setPrice] = useState<number>(0);
  const [fill, setFill] = useState<string | number>(0);
  const [inputUSDT, setInputUSDT] = useState<boolean>(true);
  const [currentPrise, setCurrentPrise] = useState<boolean>(false);

  const costs = api.coin.getCosts.useQuery({
    type: typeCoin,
  });

  const utils = api.useUtils();

  const userPocket = session?.user?.pocket.find(
    (pocketItem) => pocketItem[typeCoin] !== undefined
  );

  const userDeposit = api.user.getUserDeposit.useQuery();
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

  const sell = api.coin.sell.useMutation({
    onSuccess: async (data) => {
      if (data) {
        await Promise.all([
          userDeposit.refetch(),
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
        await userDeposit.refetch();
        toast.success("Ордер успешно создан!");
      }
    },
  });

  return (
    <div className="pb-[13px] rounded-[5px] w-[340px] h-full bg-gradient-to-b from-[#93A1F8] to-[#42D2C9] flex flex-col items-center">
      <div className="mt-[17px] relative flex flex-col items-center">
        {!session && (
          <div className=" absolute top-0 left-0 backdrop-blur-md z-30 w-full h-full rounded-[5px] flex items-center justify-center">
            <h1 className=" text-black font-bold text-lg">Login to do trade</h1>
          </div>
        )}

        <div className="w-[323px] h-[47px] border-[1px] p-[11px] flex items-center justify-between rounded-[5px]">
          <h3 className="font-[800] text-[13px] text-black">Доступ Баланс:</h3>
          {userDeposit.isFetched ? (
            <h3 className="font-[800] text-[13px] text-black">
              {userDeposit.data}
            </h3>
          ) : (
            <>
              <Skeleton className="h-3 w-[70px] rounded-lg" />
            </>
          )}
        </div>
        <div className="mt-[17px] flex items-center gap-[30px]">
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
                  amount: inputUSDT
                    ? Number(fill)
                    : Number(fill) * (costs.data?.price ?? 1),
                });
                buyOrder.mutate({
                  price: price,
                  fill: inputUSDT
                    ? Number(fill)
                    : Number(fill) * (costs.data?.price ?? 1),
                  symbol: tvwidgetsymbol || "BITSTAMP:BTCUSD",
                  isAlreadyCompleted: true,
                });
              } else {
                buyOrder.mutate({
                  price: price,
                  fill: inputUSDT
                    ? Number(fill)
                    : Number(fill) * (costs.data?.price ?? 1),
                  symbol: tvwidgetsymbol || "BITSTAMP:BTCUSD",
                  isAlreadyCompleted: false,
                });
              }
            }}
          >
            Купить
          </Button>
          <Button
            isDisabled={
              Number(fill).toString() !== fill ||
              Number(fill) <= 0 ||
              (userPocket![typeCoin] ?? 0) <= Number(fill) ||
              price <= 0
            }
            color="danger"
            className="text-white text-[15px] w-[120px] rounded-[5px] bg-[#EF454A]"
            isLoading={sellOrder.isPending}
            onClick={() => {
              if (currentPrise) {
                sellOrder.mutate({
                  price: price,
                  fill: inputUSDT
                    ? Number(fill)
                    : Number(fill) * (costs.data?.price ?? 1),
                  symbol: tvwidgetsymbol || "BITSTAMP:BTCUSD",
                  isAlreadyCompleted: true,
                });
                sell.mutate({
                  cost: price,
                  coin: typeCoin,
                  amount: inputUSDT
                    ? Number(fill)
                    : Number(fill) * (costs.data?.price ?? 1),
                });
              } else {
                sellOrder.mutate({
                  price: price,
                  fill: inputUSDT
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
        </div>
        <Input
          classNames={{
            base: "max-w-full max-w-[300px] w-full h-[40px] mt-[17px]",
            mainWrapper: "h-full ",
            input: "text-[#b7b2b2] font-[800] text-[12px] bg-transparent ",
            innerWrapper: "flex",
            label: "text-[#b7b2b2] font-[600] text-[12px]",
            inputWrapper:
              "rounded-[8px] h-full text-default-500 bg-[white] border-[black] data-[hover=true]:bg-[#F8F8FF] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text",
          }}
          endContent={
            <div className="h-full flex items-center justify-center w-[110px] ">
              <Button
                onClick={() => {
                  costs.refetch().then(() => {
                    setPrice(costs.data?.price || price);
                    setCurrentPrise(true);
                  });
                }}
                isLoading={costs.isFetching}
                className="text-[#45979f] font-[800] text-[12px] bg-transparent"
              >
                Последняя
              </Button>
            </div>
          }
          label="Цена Ордера"
          size="sm"
          value={`${price}`}
          onChange={(e) => {
            setCurrentPrise(false);
            setPrice(
              isValueIntOrFloat(e.target.value) ? +e.target.value : price
            );
          }}
        />
        <Select
          className="max-w-xs"
          disableSelectorIconRotation
          defaultSelectedKeys={["usdt"]}
          variant="underlined"
          size="sm"
          onChange={(e) => {
            setFill(0);
            setInputUSDT(!inputUSDT);
          }}
          classNames={{
            base: "flex justify-center items-center",
            mainWrapper: "max-w-full max-w-[240px] w-full h-[30px] flex",
            label: "text-[#b7b2b2] font-[800] text-[12px] bg-transparent",
            listbox:
              "border-[black] data-[hover=true]:bg-[white] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text text-black",
          }}
        >
          <SelectItem key="usdt">Заполнить по стоимости</SelectItem>
          <SelectItem key="value">Заполнить по кол-ву</SelectItem>
        </Select>
        {inputUSDT ? (
          <Input
            classNames={{
              base: "max-w-full max-w-[300px] w-full h-[30px] ",
              mainWrapper: "h-full ",
              input: "text-[#b7b2b2] font-[800] text-[12px] bg-transparent ",
              innerWrapper: "flex",
              inputWrapper:
                "rounded-[8px] h-full text-default-500 bg-[white] border-[black] data-[hover=true]:bg-[#F8F8FF] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text",
            }}
            endContent={
              <div className="h-full flex items-center justify-center w-[110px]">
                <h3 className="text-[#45979f] font-[800] text-[12px] w-[120px] text-center">
                  USDT
                </h3>
              </div>
            }
            // label="Заполнить по стоимости"
            size="sm"
            value={`${fill}`}
            onChange={(e) => {
              isValueIntOrFloat(e.target.value) && setFill(e.target.value);
            }}
          />
        ) : (
          <Input
            classNames={{
              base: "max-w-full max-w-[300px] w-full h-[30px] ",
              mainWrapper: "h-full ",
              input: "text-[#b7b2b2] font-[800] text-[12px] bg-transparent ",
              innerWrapper: "flex",
              inputWrapper:
                "rounded-[8px] h-full text-default-500 bg-[white] border-[black] data-[hover=true]:bg-[#F8F8FF] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text",
            }}
            endContent={
              <div className="h-full flex items-center justify-center w-[110px]">
                <h3 className="text-[#45979f] font-[800] text-[12px] w-[120px] text-center">
                  {typeCoin.slice(0, -5)}
                </h3>
              </div>
            }
            // label="Заполнить по стоимости"
            size="sm"
            value={`${fill}`}
            onChange={(e) => {
              isValueIntOrFloat(e.target.value) && setFill(e.target.value);
            }}
          />
        )}
        <div className="mt-[15px] flex items-center gap-[1px]">
          <ButtonGroup>
            {fillButtons.map((button) => (
              <Button
                onClick={() =>
                  setFill(
                    inputUSDT
                      ? Math.floor(
                          ((userDeposit.data ?? 0) * button.value) / 100
                        ).toString()
                      : (
                          ((userDeposit.data ?? 0) * button.value) /
                          100 /
                          (costs.data?.price ?? 1)
                        ).toFixed(8)
                  )
                }
                size="sm"
                key={button.value}
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-r-[1px] border-black p-[0px]"
              >
                {button.value + "%"}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
      <div className="bg-[#ffffff] rounded-[5px] mt-[11px] w-[320px] h-full p-[0px]">
        <OrdersInfo />
      </div>
    </div>
  );
}
