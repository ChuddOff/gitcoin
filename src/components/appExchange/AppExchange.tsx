"use client";

import { useEffect } from "react";
import SwitchText from "@/components/switchText/SwitchText";
import { useSearchParams } from "next/navigation";
import List from "@/components/list/List";
import Chart from "@/components/chart/Chart";
import Details from "@/components/details/Details";
import toast from "react-hot-toast";
import { api } from "../../trpc/react";
import BottomTabs from "@/components/exchange/Tabs";
import RightMenu from "@/components/exchange/RightMenu";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

export default function AppExchange({ session }: Props) {
  const searchParams = useSearchParams();
  const tvwidgetsymbol = searchParams.get("tvwidgetsymbol");
  const typeCoin =
    (tvwidgetsymbol?.slice(tvwidgetsymbol?.indexOf(":") + 1, -3) ?? "BTC") +
    "/USDT";

  const { data: orders, refetch: refetchOrders } = api.order.getAll.useQuery();

  const costs = api.coin.getCosts.useQuery({
    type: typeCoin,
  });

  const markAsCompleted = api.order.markAsCompleted.useMutation({
    onSuccess: (data) => {
      if (data) {
        toast.success(
          "Вы успешно преобрели " +
            data.symbol +
            " в размере " +
            (data.fill / (costs.data?.price ?? 1)).toFixed(4)
        );

        refetchOrders();
      }
    },
  });

  const ordersNotCompleted = orders?.filter(
    (order) => order.completed === false
  );
  const checkOrders = () => {
    ordersNotCompleted?.forEach((order) => {
      const difference = Math.abs(order.orderPrice - (costs.data?.price ?? 0));

      if (difference < 50) {
        markAsCompleted.mutate({
          id: order.id,
        });
      }
    });
  };

  useEffect(() => {
    checkOrders();
  }, [orders]);

  if (window && window.innerWidth < 1400) {
    return (
      <main className="w-[calc(100vw-8px)] light flex flex-col items-center light:bg-gradient-to-b light:from-[#2EDEBE] light:to-[#A098FF] h-[calc(100vh-65px)] overflow-hidden dark:from-[#101014] dark:to-[#101014]">
        <SwitchText />
        <div className=" flex gap-[8px] flex-col w-[calc(100vw-16px)]">
          <div className="h-[173px] bg-[#101014] rounded-[4px] w-full overflow-hidden">
            <Details />
          </div>

          <div className="h-[500px] w-full bg-white rounded-[5px] overflow-hidden dark:bg-black">
            <Chart />
          </div>
          <RightMenu session={session} />
          <BottomTabs orders={ordersNotCompleted} />
        </div>
      </main>
    );
  }

  return (
    <main className="light flex flex-col items-center light:bg-gradient-to-b light:from-[#2EDEBE] light:to-[#A098FF] h-[calc(100vh-65px)] overflow-hidden dark:from-[#101014] dark:to-[#101014]">
      <SwitchText />
      <div className=" flex gap-[8px] ">
        {/* Left menu */}
        <div className="max-w-[350px] w-full bg-white rounded-[5px] overflow-hidden dark:border-[#7d8a88] dark:border-[1px] dark:bg-black">
          <List />
        </div>

        {/* Center menu */}
        <div className="w-[calc(100vw-350px-340px-8px-8px-16px)] dark:border-[#7d8a88] dark:border-[1px] rounded-[5px] overflow-hidden">
          <div className="h-[86px] bg-[#101014] rounded-[4px] w-full overflow-hidden">
            <Details />
          </div>

          <div className="h-[500px] w-full bg-white rounded-[5px] overflow-hidden dark:bg-black">
            <Chart />
          </div>

          <BottomTabs orders={ordersNotCompleted} />
        </div>

        {/* Right menu */}
        <RightMenu session={session} />
      </div>
    </main>
  );
}
