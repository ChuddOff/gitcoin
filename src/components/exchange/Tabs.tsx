import { api } from "@/trpc/react";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { Orders } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import YourOrders from "../userOrders/yourOrders/YourOrders";
import OrdersHistory from "../userOrders/ordersHistory/OrdersHistory";
import TradeHistory from "../userOrders/tradeHistory/TradeHistory";

interface Props {
  orders: Omit<Orders, "userId">[] | undefined;
}

export default function BottomTabs({ orders }: Props) {
  const searchParams = useSearchParams();
  const tvwidgetsymbol = searchParams.get("tvwidgetsymbol");
  const typeCoin =
    (tvwidgetsymbol?.slice(tvwidgetsymbol?.indexOf(":") + 1, -3) ?? "BTC") +
    "/USDT";
  const getAll = api.order.getAll.useQuery();
  const costs = api.coin.getCosts.useQuery({
    type: typeCoin,
  });

  return (
    <div className="h-[190px] bg-[#101014] rounded-[5px]">
      <div className="flex w-full flex-col h-full">
        <Tabs
          aria-label="Options"
          variant="underlined"
          color="warning"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-[10px] border-b border-divider",
            cursor: "w-full",
            tab: "max-w-fit p-0",
            tabContent: "text-white",
          }}
        >
          <Tab
            key="photos"
            title={`Текущие ордеры (${orders?.length ?? 0})`}
            className="p-[0px] h-full "
          >
            <Card className="p-[0px] h-full rounded-[5px]">
              <CardBody className="p-[0px] h-full">
                <YourOrders
                  cost={costs.data?.price || 0}
                  orderData={getAll.data || []}
                  isPending={getAll.isPending}
                />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="music" title="История ордеров" className="p-[0px] h-full">
            <Card className="p-[0px] h-full rounded-[5px]">
              <CardBody className="p-[0px] h-full">
                <OrdersHistory
                  cost={costs.data?.price || 0}
                  orderData={getAll.data || []}
                  isPending={getAll.isPending}
                />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="videos" title="История торговли" className="p-[0px] h-full">
            <Card className="p-[0px] h-full rounded-[5px]">
              <CardBody className="p-[0px] h-full">
                <TradeHistory
                  cost={costs.data?.price || 0}
                  orderData={getAll.data || []}
                  isPending={getAll.isPending}
                />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
