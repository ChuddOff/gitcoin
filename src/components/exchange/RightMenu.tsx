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
    <div className="light pb-[13px] rounded-[5px] w-[340px] max-[1400px]:w-[calc(100vw-16px)] h-full min-[1401px]:bg-gradient-to-b light:from-[#93A1F8] light:to-[#42D2C9] flex flex-col items-center dark:from-[#141514] dark:to-[#141514] dark:border-[#7d8a88] dark:border-[1px] max-[1400px]:from-white max-[1400px]:to-white max-[1400px]:bg-white max-[1400px]:bg-white dark:bg-white">
      <title>Results page {typeCoin}</title>
      <div className="mt-[17px] relative flex flex-col items-center ">
        {!session && (
          <div className=" absolute top-0 left-0 backdrop-blur-md z-30 w-full h-full rounded-[5px] flex items-center justify-center ">
            <h1 className=" text-black font-bold text-lg dark:text-white">
              Login to do trade
            </h1>
          </div>
        )}

        <div className="w-[323px] h-[47px] border-[1px] p-[11px] flex items-center justify-between rounded-[5px] dark:border-[#404854]">
          <h3 className="font-[800] text-[13px] text-black dark:invert">
            Доступ Баланс:
          </h3>
          {userDeposit.isFetched ? (
            <h3 className="font-[800] text-[13px] text-black dark:invert">
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
              (userPocket &&
                userPocket[typeCoin] &&
                userPocket[typeCoin] <= Number(fill)) ||
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
            input:
              "text-[#b7b2b2] font-[800] text-[12px] bg-transparent dark:invert",
            innerWrapper: "flex",
            label:
              "text-[#b7b2b2] font-[600] text-[12px] dark:text-white dark:invert",
            inputWrapper:
              "rounded-[8px] h-full text-default-500 bg-[white] border-[black] data-[hover=true]:bg-[#F8F8FF] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text dark:bg-[#25282c] dark:group-data-[focus=true]:bg-[#25282c] dark:text-white",
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
          className="max-w-xs dark:text-white"
          disableSelectorIconRotation
          defaultSelectedKeys={["usdt"]}
          variant="underlined"
          size="sm"
          onChange={(e) => {
            setFill(0);
            setInputUSDT(e.target.value === "usdt");
          }}
          classNames={{
            base: "flex justify-center items-center text-black dark:invert",
            mainWrapper:
              "max-w-full max-w-[240px] w-full h-[30px] flex text-black",
            label:
              "text-[#b7b2b2] font-[800] text-[12px] bg-transparent text-black dark:text-white",
            listbox:
              "border-[black] data-[hover=true]:bg-black group-data-[focus=true]:bg-[#FFFFF0] !cursor-text text-black dark:text-white",
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
              input:
                "text-[#b7b2b2] font-[800] text-[12px] bg-transparent dark:text-white dark:invert",
              innerWrapper: "flex",
              inputWrapper:
                "rounded-[8px] h-full text-default-500 bg-[white] border-[black] data-[hover=true]:bg-[#F8F8FF] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text dark:bg-[#25282c] dark:group-data-[focus=true]:bg-[#25282c] dark:text-white",
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
              input:
                "text-[#b7b2b2] font-[800] text-[12px] bg-transparent dark:text-white dark:invert",
              innerWrapper: "flex",
              inputWrapper:
                "rounded-[8px] h-full text-default-500 bg-[white] border-[black] data-[hover=true]:bg-[#F8F8FF] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text dark:bg-[#25282c] dark:group-data-[focus=true]:bg-[#25282c] dark:text-white",
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
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-r-[1px] border-black p-[0px] dark:bg-[#404854]"
              >
                {button.value + "%"}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
      {window && window.innerWidth > 800 && (
        <div className="bg-[#ffffff] rounded-[5px] mt-[11px] w-[320px] h-full p-[0px]">
          <OrdersInfo />
        </div>
      )}
    </div>
  );
}
