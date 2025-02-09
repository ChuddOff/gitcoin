import {
  Card,
  CardBody,
  Spinner,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { api } from "../../trpc/react";

export default function OrdersInfo() {
  const searchParams = useSearchParams();
  const tvwidgetsymbol = searchParams.get("tvwidgetsymbol");

  const type =
    (tvwidgetsymbol?.slice(tvwidgetsymbol?.indexOf(":") + 1, -3) ?? "BTC") +
    "/USDT";

  const { data: response, isLoading } = api.coin.getData.useQuery(
    {
      type,
    },
    {
      refetchInterval: 3000,
    }
  );

  const bids = response?.bids
    .slice(0, 8)
    .map((item) => item[1])
    .reduce((a, b) => {
      return (a ?? 0) + (b ?? 0);
    }, 0);

  const asks = response?.asks
    .slice(0, 8)
    .reverse()
    .map((item) => item[1])
    .reduce((a, b) => {
      return (a ?? 0) + (b ?? 0);
    }, 0);

  const percent =
    bids && asks && (bids ?? 1 / (bids ?? 1 + (asks ?? 1))) * 100 < 100
      ? (bids ?? 1 / (bids ?? 1 + (asks ?? 1))) * 100
      : 100;

  return (
    <div className="flex w-full flex-col h-full">
      <Tabs
        aria-label="Options"
        variant="underlined"
        color="warning"
        classNames={{
          base: "dark:text-white dark:bg-[#101014]",
          panel: "bg-white dark:bg-[#101014] dark:text-white ",
          tabList:
            "gap-3 w-full relative rounded-none p-[5px] px-[7px] dark:bg-[#25282c] dark:text-white rounded-[5px] ",
          cursor: "w-full ",
          tab: " px-0 w-[120px] dark:bg-[#25282c] dark:text-white ",
          tabContent:
            "light:text-[#b4b6b9] font-[700] group-data-[selected=true]:text-black text-[13px] dark:text-white ",
        }}
      >
        <Tab
          key="photos"
          title="Книга ордеров"
          className=" h-full p-0 bg-white dark:text-white"
        >
          <Card className="p-[0px] h-full rounded-[5px] dark:bg-[#101014] dark:text-white">
            <CardBody className="h-full bg-white border-[0px] p-[0px] dark:bg-[#101014] mt-[6px] dark:text-white">
              <Table
                aria-label="Example static collection table"
                radius="sm"
                layout="fixed"
                classNames={{
                  th: "w-full pt-[5px] px-[10px] m-[0px] h-[10px] bg-white text-[#81858c] font-[700] dark:bg-[#25282c]",
                  base: "w-full p-[0px] m-[0px] h-[195px] dark:bg-[#101014]",
                  table: "w-full p-[0px] m-[0px] h-[5px] dark:bg-[#25282c]",
                  tbody: "w-full p-[0px] m-[0px] h-[5px] dark:bg-[#101014]",
                  emptyWrapper:
                    "w-full p-[0px] m-[0px] h-[5px] dark:bg-[#101014]",
                  wrapper: "w-full p-[0px] m-[0px] h-full dark:bg-[#25282c]",
                  td: "py-[1px] px-[10px] m-[0px] h-[10px] text-[#ef484d] font-[500] text-[12px] dark:bg-[#25282c]",
                }}
              >
                <TableHeader>
                  <TableColumn>Цена(USDT)</TableColumn>
                  <TableColumn>
                    Кол-во(
                    {tvwidgetsymbol?.slice(
                      tvwidgetsymbol?.indexOf(":") + 1,
                      -3
                    ) ?? "BTC"}
                    )
                  </TableColumn>
                  <TableColumn>
                    Всего(
                    {tvwidgetsymbol?.slice(
                      tvwidgetsymbol?.indexOf(":") + 1,
                      -3
                    ) ?? "BTC"}
                    )
                  </TableColumn>
                </TableHeader>
                <TableBody
                  items={response?.asks.slice(0, 8).reverse() || []}
                  isLoading={isLoading}
                  loadingContent={<Spinner label="Loading..." />}
                >
                  {(item) => (
                    <TableRow key={response?.asks.indexOf(item)}>
                      <TableCell>{item[0]}</TableCell>
                      <TableCell>{item[1]!.toFixed(4)}</TableCell>
                      <TableCell>
                        {response!.asks
                          .slice(0, (response?.asks.indexOf(item) ?? 8) + 1)
                          .reverse()
                          .map((item) => item[1])
                          .reduce((a, b) => {
                            return (a ?? 0) + (b ?? 0);
                          }, 0)
                          ?.toFixed(4)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div>
                <h3 className="text-[#ef454a] font-[700] text-[15px] px-[10px] py-[1px]">
                  {response ? response?.asks[0][0] : ""}
                </h3>
              </div>
              <Table
                hideHeader
                aria-label="Example static collection table"
                radius="sm"
                layout="fixed"
                classNames={{
                  th: "w-full py-[5px] px-[10px] m-[0px] h-[10px] bg-white dark:bg-[#25282c]",
                  base: "w-full p-[0px] m-[0px] h-[165px] dark:bg-[#25282c] rounded-[10px]",
                  table: "w-full p-[0px] m-[0px] h-[5px] dark:bg-[#25282c]",
                  tbody: "w-full p-[0px] m-[0px] h-[5px] dark:bg-[#25282c]",
                  emptyWrapper:
                    "w-full p-[0px] m-[0px] h-[5px] dark:bg-[#25282c]",
                  wrapper:
                    "w-full p-[0px] m-[0px] h-full bg-white dark:bg-[#25282c]",
                  td: "py-[1px] px-[10px] m-[0px] h-[10px] text-[#45be84] font-[500] text-[12px] dark:bg-[#25282c]",
                }}
              >
                <TableHeader>
                  <TableColumn>Цена(USDT)</TableColumn>
                  <TableColumn>{`Кол-во(${tvwidgetsymbol?.slice(
                    tvwidgetsymbol?.indexOf(":") + 1,
                    -3
                  )})`}</TableColumn>
                  <TableColumn>Всего(BTC)</TableColumn>
                </TableHeader>
                <TableBody
                  items={response?.bids.slice(0, 8) || []}
                  loadingContent={<Spinner label="Loading..." />}
                >
                  {(item) => (
                    <TableRow key={response?.bids.indexOf(item)}>
                      <TableCell>{item[0]}</TableCell>
                      <TableCell>{item[1]!.toFixed(4)}</TableCell>
                      <TableCell>
                        {response?.bids
                          .slice(0, response?.bids.indexOf(item) + 1 ?? 8)
                          .map((item) => item[1])
                          .reduce((a, b) => {
                            return (a ?? 0) + (b ?? 0);
                          }, 0)
                          ?.toFixed(4)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex h-[29px] gap-[6px] p-[0px] px-[10px] my-[9px] transition-all w-full">
                <div
                  className="rounded-[5px] flex bg-[#e7f5ee] transition-all  items-center gap-[5px] min-w-[70px] dark:bg-[#172b22]"
                  style={{
                    width: `calc(${response ? percent : 50}%)`,
                  }}
                >
                  <div className="transition-d transition-all rounded-[5px] border-[2px] border-[#23b36e] flex w-[29px] justify-center items-center text-[#45be84] ">
                    B
                  </div>
                  <h3 className="text-[#45be84] font-[500] text-[15px]">
                    {response && percent.toFixed(0) + "%"}
                  </h3>
                </div>
                <div
                  className="rounded-[5px] flex bg-[#ffeaea] justify-end min-w-[70px] items-center gap-[5px] dark:bg-[#34191e]"
                  style={{
                    width: `calc(${response ? 100 - percent : 50}%)`,
                  }}
                >
                  <h3 className="text-[#ef484d] font-[500] text-[15px]">
                    {response && (100 - percent).toFixed(0) + "%"}
                  </h3>
                  <div className="rounded-[5px] border-[2px] border-[#ef464b] flex w-[29px] justify-center items-center text-[#ef484d] w-min-[29px]">
                    S
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
