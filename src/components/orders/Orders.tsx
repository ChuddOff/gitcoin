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
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface OHLCData {
  bids: number[][];
  asks: number[][];
}

async function getData(type: string) {
  let response = await fetch("/api/getData?type=" + type, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

const Orders: React.FC = () => {
  const searchParams = useSearchParams();
  const tvwidgetsymbol = searchParams.get("tvwidgetsymbol");

  const [data, setData] = useState<OHLCData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchData() {
    try {
      const newData = await getData(
        (tvwidgetsymbol?.slice(tvwidgetsymbol?.indexOf(":") + 1, -3) ?? "BTC") +
          "/USDT"
      );
      setData(newData.order ?? data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData(); // Первоначальный запрос данных

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col h-full">
      <Tabs
        aria-label="Options"
        variant="underlined"
        color="warning"
        classNames={{
          panel: "bg-white",
          tabList: "gap-3 w-full relative rounded-none p-[5px] px-[7px]",
          cursor: "w-full ",
          tab: " px-0 w-[120px]",
          tabContent:
            "text-[#b4b6b9] font-[700] group-data-[selected=true]:text-black text-[13px]",
        }}
      >
        <Tab
          key="photos"
          title="Книга ордеров"
          className=" h-full p-0 bg-white"
        >
          <Card className="rounded-[0px] p-[0px] h-full rounded-[5px] bg-white">
            <CardBody className="p-[0px] h-full bg-white border-[0px] p-[0px]">
              <Table
                aria-label="Example static collection table"
                radius="sm"
                layout="fixed"
                classNames={{
                  th: "w-full pt-[5px] px-[10px] m-[0px] h-[10px] bg-white text-[#81858c] font-[700]",
                  base: "w-full p-[0px] m-[0px] h-[195px]",
                  table: "w-full p-[0px] m-[0px] h-[5px]",
                  tbody: "w-full p-[0px] m-[0px] h-[5px]",
                  emptyWrapper: "w-full p-[0px] m-[0px] h-[5px]",
                  wrapper: "w-full p-[0px] m-[0px] h-full",
                  td: "py-[1px] px-[10px] m-[0px] h-[10px] text-[#ef484d] font-[500] text-[12px]",
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
                  items={data?.asks.slice().reverse().slice(42) || []}
                  isLoading={isLoading}
                  loadingContent={<Spinner label="Loading..." />}
                >
                  {(item) => (
                    <TableRow key={data?.asks.indexOf(item)}>
                      <TableCell>{item[0]}</TableCell>
                      <TableCell>{item[1].toFixed(4)}</TableCell>
                      <TableCell>
                        {data?.asks
                          .slice()
                          .reverse()
                          .slice(data?.asks.indexOf(item) ?? 42)
                          .map((item) => item[1])
                          .reduce((a, b) => {
                            return a + b;
                          }, 0)
                          ?.toFixed(4)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div>
                <h3 className="text-[#ef454a] font-[700] text-[15px] px-[10px] py-[4px]">
                  {data ? data?.asks[0][0] : ""}
                </h3>
              </div>
              <Table
                hideHeader
                aria-label="Example static collection table"
                radius="sm"
                layout="fixed"
                classNames={{
                  th: "w-full py-[5px] px-[10px] m-[0px] h-[10px] bg-white",
                  base: "w-full p-[0px] m-[0px] h-[165px] ",
                  table: "w-full p-[0px] m-[0px] h-[5px] ",
                  tbody: "w-full p-[0px] m-[0px] h-[5px]",
                  emptyWrapper: "w-full p-[0px] m-[0px] h-[5px]",
                  wrapper: "w-full p-[0px] m-[0px] h-full bg-white",
                  td: "py-[1px] px-[10px] m-[0px] h-[10px] text-[#45be84] font-[500] text-[12px]",
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
                  items={data?.bids.slice(0, 8) || []}
                  loadingContent={<Spinner label="Loading..." />}
                >
                  {(item) => (
                    <TableRow key={data?.bids.indexOf(item)}>
                      <TableCell>{item[0]}</TableCell>
                      <TableCell>{item[1].toFixed(4)}</TableCell>
                      <TableCell>
                        {data?.bids
                          .slice(0, data?.bids.indexOf(item) + 1 ?? 8)
                          .map((item) => item[1])
                          .reduce((a, b) => {
                            return a + b;
                          }, 0)
                          ?.toFixed(4)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex h-[29px] gap-[6px] p-[0px] px-[10px] my-[9px] transition-[1s] transition-all">
                <div
                  className="rounded-[5px] flex bg-[#e7f5ee] transition-[1s] transition-all  items-center gap-[5px]"
                  style={{
                    width: `calc(${
                      data
                        ? (data?.bids
                            .slice(42)
                            .map((item) => item[1])
                            .reduce((a, b) => {
                              return a + b;
                            }, 0) /
                            (data?.bids
                              .slice(0, 8)
                              .map((item) => item[1])
                              .reduce((a, b) => {
                                return a + b;
                              }, 0) +
                              data?.asks
                                .slice(42)
                                .map((item) => item[1])
                                .reduce((a, b) => {
                                  return a + b;
                                }, 0))) *
                          100
                        : 50
                    }% + 55px)`,
                  }}
                >
                  <div className="transition-[1s] transition-all rounded-[5px] border-[2px] border-[#23b36e] flex w-[29px] justify-center items-center text-[#45be84]">
                    B
                  </div>
                  <h3 className="text-[#45be84] font-[500] text-[15px]">
                    {data &&
                      (
                        (data?.bids
                          .slice(42)
                          .map((item) => item[1])
                          .reduce((a, b) => {
                            return a + b;
                          }, 0) /
                          (data?.bids
                            .slice(0, 8)
                            .map((item) => item[1])
                            .reduce((a, b) => {
                              return a + b;
                            }, 0) +
                            data?.asks
                              .slice(42)
                              .map((item) => item[1])
                              .reduce((a, b) => {
                                return a + b;
                              }, 0))) *
                        100
                      ).toFixed(0) + "%"}
                  </h3>
                </div>
                <div className="rounded-[5px] flex w-full bg-[#ffeaea] justify-end w-min-[55px] items-center gap-[5px]">
                  <h3 className="text-[#ef484d] font-[500] text-[15px]">
                    {data &&
                      (
                        100 -
                        (data?.bids
                          .slice(42)
                          .map((item) => item[1])
                          .reduce((a, b) => {
                            return a + b;
                          }, 0) /
                          (data?.bids
                            .slice(0, 8)
                            .map((item) => item[1])
                            .reduce((a, b) => {
                              return a + b;
                            }, 0) +
                            data?.asks
                              .slice(42)
                              .map((item) => item[1])
                              .reduce((a, b) => {
                                return a + b;
                              }, 0))) *
                          100
                      ).toFixed(0) + "%"}
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
};

export default Orders;
