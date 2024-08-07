"use client";

import "./page.css";
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

export default function Home() {
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

        // replace it?
        refetchOrders();
      }
    },
  });

  const ordersNotCompleted = orders?.filter(
    (order) => order.completed === false
  );
  const checkOrders = () => {
    ordersNotCompleted?.forEach((order) => {
      const difference = Math.abs(
        order.orderPrice - (costs.data?.price ?? 0)
      )

      if (difference < 50) {
        markAsCompleted.mutate({
          id: order.id,
        });
      }
    });
  };

  useEffect(() => {
    // add refetch orders logic
    checkOrders();
  }, [orders]);
  
  return (
    <main className="flex flex-col items-center bg-gradient-to-b from-[#2EDEBE] to-[#A098FF] h-[calc(100vh-65px)] overflow-hidden">
      <SwitchText />
      <div className=" flex gap-[8px] ">
        {/* Left menu */}
        <div className="w-[350px] bg-white rounded-[5px] overflow-hidden">
          <List />
        </div>

        {/* Center menu */}
        <div className="w-[1205px]">
          <div className="h-[86px] bg-[#101014] rounded-[4px] w-[1205px] overflow-hidden">
            <Details />
          </div>
          
          <div className="h-[500px] bg-white rounded-[5px] overflow-hidden">
            <Chart />
          </div>

          <BottomTabs orders={ordersNotCompleted} />
        </div>

        {/* Right menu */}
        <RightMenu onButtonClick={refetchOrders}/>
      </div>
    </main>
  );
}
