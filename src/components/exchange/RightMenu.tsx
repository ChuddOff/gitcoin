import {
  Button,
  ButtonGroup,
  Input,
  Select,
  Selection,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import OrdersInfo from "../orders/Orders";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { Session } from "next-auth";
import BuyButton from "./RightMenu/BuyButton";
import SellButton from "./RightMenu/SellButton";
import { z } from "zod";

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

    return !Number.isNaN(+value);
  };

  const fillButtons = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 75 },
    { value: 100 },
  ];

  const selectInputTypeButtons = [
    { key: "usdt", label: "заполнить по стоимости" },
    { key: "coin", label: "заполнить по количеству" },
  ];

  const [price, setPrice] = useState<number>(0);
  const [fill, setFill] = useState<string | number>(0);
  const [inputType, setInputType] = useState<Set<string>>(new Set(["usdt"]));
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
            <Skeleton className="h-3 w-[70px] rounded-lg" />
          )}
        </div>
        <div className="mt-[17px] flex items-center gap-[30px]">
          <BuyButton
            fill={fill}
            costs={costs}
            typeCoin={typeCoin}
            userDeposit={userDeposit}
            tvwidgetsymbol={tvwidgetsymbol}
            inputType={inputType as Set<"usdt" | "coin">}
            price={price}
            currentPrise={currentPrise}
            buy={buy}
            buyOrder={buyOrder}
          />

          <SellButton
            tvwidgetsymbol={tvwidgetsymbol}
            price={price}
            fill={fill}
            costs={costs}
            typeCoin={typeCoin}
            userPocket={userPocket}
            currentPrise={currentPrise}
            inputType={inputType as Set<"usdt" | "coin">}
            sell={buy}
            sellOrder={buyOrder}
          />
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
          aria-label="Options"
          disableSelectorIconRotation
          defaultSelectedKeys={["usdt"]}
          variant="underlined"
          size="sm"
          classNames={{
            base: "flex justify-center items-center",
            mainWrapper: "max-w-full max-w-[240px] w-full h-[30px] flex",
            label: "text-[#b7b2b2] font-[800] text-[12px] bg-transparent",
            listbox:
              "border-[black] data-[hover=true]:bg-[white] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text text-black",
          }}
          onSelectionChange={
            setInputType as unknown as ((keys: Selection) => void) | undefined
          }
        >
          {selectInputTypeButtons.map((item) => (
            <SelectItem key={item.key}>{item.label}</SelectItem>
          ))}
        </Select>

        {inputType.has("usdt") ? (
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
                    inputType
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
