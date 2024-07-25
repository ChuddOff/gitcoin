"use client";

import "./page.css";
import Image from "next/image";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { chart } from "highcharts/highstock";
import useSWR from "swr";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Input,
  Skeleton,
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
import SwitchText from "@/components/switchText/SwitchText";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

interface profileData {
  _id: string;
  nick: string;
  deposit: number;
  bonus: boolean;
}
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
async function getProfileData(id: string) {
  let response = await fetch("/api/profile?_id=" + id, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}
async function getCost(type: string) {
  let response = await fetch("/api/getCost?type=" + type, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

export default function Home() {
  const searchParams = useSearchParams();
  const tvwidgetsymbol = searchParams.get("tvwidgetsymbol");
  const { user } = useUser();

  const [profileCost, setProfileCost] = useState<number>();
  const [isLoadingCost, setIsLoadingCost] = useState<boolean>(false);

  const [profileData, setProfileData] = useState<profileData>();
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

  const [data, setData] = useState<OHLCData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [price, setPrice] = useState<string>();
  const [fill, setFill] = useState<string>();

  async function fetchProfileData() {
    setIsLoadingProfile(true);
    try {
      const newData = await getProfileData(user?.id || "");
      setProfileData(newData.profile);
      setIsLoadingProfile(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoadingProfile(false);
    }
  }
  async function fetchCostData() {
    setIsLoadingCost(true);
    try {
      const newData = await getCost(
        (tvwidgetsymbol?.slice(tvwidgetsymbol?.indexOf(":") + 1, -3) ?? "BTC") +
          "/USDT"
      );
      setPrice(newData.prise);
      setIsLoadingCost(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoadingCost(false);
    }
  }

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

  const chart = useRef<HTMLDivElement>(null);
  const details = useRef<HTMLDivElement>(null);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marketsscript = document.createElement("script");
    marketsscript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    marketsscript.type = "text/javascript";
    marketsscript.async = true;
    marketsscript.innerHTML = `
  {
    "width": "350",
  "height": "100%",
  "defaultColumn": "overview",
  "screener_type": "crypto_mkt",
  "displayCurrency": "USD",
  "colorTheme": "light",
  "locale": "ru",
  "largeChartUrl": "http://${window.location.host}/exchange/"
  
  }`;

    if (widgetContainerRef!.current!.children.length === 1) {
      widgetContainerRef.current!.appendChild(marketsscript);
    }

    const detailsscript = document.createElement("script");
    detailsscript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    detailsscript.type = "text/javascript";
    detailsscript.async = true;
    detailsscript.innerHTML = `
        {
          "symbol": "${tvwidgetsymbol || "BITSTAMP:BTCUSD"}",
          "width": 1205,
          "locale": "ru",
          "colorTheme": "dark",
          "isTransparent": false
        }`;

    if (details.current!.children.length === 1) {
      details.current!.appendChild(detailsscript);
    }

    const chartscript = document.createElement("script");
    chartscript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    chartscript.type = "text/javascript";
    chartscript.async = true;
    chartscript.innerHTML = `
        {
          "autosize": true,
          "symbol": "${tvwidgetsymbol || "BITSTAMP:BTCUSD"}",
          "interval": "S",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "ru",
          "allow_symbol_change": true,
          "calendar": true,
          "support_host": "https://www.tradingview.com"
        }`;

    if (chart.current!.children.length === 1) {
      chart.current!.appendChild(chartscript);
    }
  }, [chart, details, widgetContainerRef]);

  useEffect(() => {
    fetchData(); // Первоначальный запрос данных

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
    }
  }, [user?.id]);

  return (
    <main className="flex flex-col items-center bg-gradient-to-b from-[#2EDEBE] to-[#A098FF] h-[calc(100vh-65px)] overflow-hidden">
      <SwitchText />
      <div className=" flex gap-[8px]">
        <div className="w-[350px] bg-white rounded-[5px] overflow-hidden">
          <div
            className="tradingview-widget-container"
            ref={widgetContainerRef}
          >
            <div className="tradingview-widget-container__widget"></div>
          </div>
        </div>
        <div className="w-[1205px]">
          <div className="h-[86px] bg-[#101014] rounded-[4px] w-[1205px] overflow-hidden">
            <div
              className="tradingview-widget-container translate-y-[-85px]"
              ref={details}
            >
              <div className="tradingview-widget-container__widget"></div>
            </div>
          </div>
          <div className="h-[500px] bg-white rounded-[5px] overflow-hidden">
            <div
              className="tradingview-widget-container"
              ref={chart}
              style={{ height: "100%", width: "100%" }}
            >
              <div
                className="tradingview-widget-container__widget"
                style={{ height: "calc(100% - 32px)", width: "100%" }}
              ></div>
            </div>
          </div>
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
                  title="Текущие ордеры (0)"
                  className="p-[0px] h-full "
                >
                  <Card className="rounded-[0px] p-[0px] h-full rounded-[5px]">
                    <CardBody className="p-[0px] h-full">
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                    </CardBody>
                  </Card>
                </Tab>
                <Tab
                  key="music"
                  title="История ордеров"
                  className="p-[0px] h-full"
                >
                  <Card className="rounded-[0px] p-[0px] h-full rounded-[5px]">
                    <CardBody className="p-[0px] h-full">
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                    </CardBody>
                  </Card>
                </Tab>
                <Tab
                  key="videos"
                  title="История торговли"
                  className="p-[0px] h-full"
                >
                  <Card className="rounded-[0px] p-[0px] h-full rounded-[5px]">
                    <CardBody className="p-[0px] h-full">
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="pb-[13px] rounded-[5px] w-[340px] h-full bg-gradient-to-b from-[#93A1F8] to-[#42D2C9] flex flex-col items-center">
          <div className="w-[323px] h-[47px] border-[1px] mt-[17px] p-[11px] flex items-center justify-between">
            <h3 className="font-[800] text-[13px] text-black">
              Доступ Баланс:
            </h3>
            {profileData ? (
              <h3 className="font-[800] text-[13px] text-black">
                {profileData.deposit}
              </h3>
            ) : (
              <Skeleton className="h-3 w-[70px] rounded-lg" />
            )}
          </div>
          <div className="mt-[17px] flex items-center gap-[30px]">
            <Button
              color="success"
              className="text-white text-[15px] w-[120px] rounded-[5px] bg-[#20B26C]"
            >
              Купить
            </Button>
            <Button
              color="danger"
              className="text-white text-[15px] w-[120px] rounded-[5px] bg-[#EF454A]"
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
              inputWrapper:
                "rounded-[8px] h-full text-default-500 bg-[white] border-[black] data-[hover=true]:bg-[#F8F8FF] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text",
            }}
            endContent={
              <div className="h-full flex items-center justify-center w-[110px] ">
                <Button
                  onClick={fetchCostData}
                  isLoading={isLoadingCost}
                  className="text-[#45979f] font-[800] text-[12px] bg-transparent"
                >
                  Последняя
                </Button>
              </div>
            }
            label="Цена Ордера"
            size="sm"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value.match("^\\d+([,.]\\d+)?$")
                  ? e.target.value
                  : price
              )
            }
          />
          <Input
            classNames={{
              base: "max-w-full max-w-[300px] w-full h-[40px] mt-[17px] ",
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
            label="Заполнить по стоимости"
            size="sm"
            value={fill}
            onChange={(e) =>
              setFill(
                e.target.value.match("^\\d+([,.]\\d+)?$")
                  ? e.target.value
                  : fill
              )
            }
          />
          <div className="mt-[15px] flex items-center gap-[1px]">
            <ButtonGroup>
              <Button
                onClick={() =>
                  setFill(
                    Math.floor((profileData?.deposit ?? 0) / 10).toString()
                  )
                }
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-r-[1px] border-black p-[0px]"
              >
                10%
              </Button>
              <Button
                onClick={() =>
                  setFill(
                    Math.floor((profileData?.deposit ?? 0) / 4).toString()
                  )
                }
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-x-[1px] border-black"
              >
                25%
              </Button>
              <Button
                onClick={() =>
                  setFill(
                    Math.floor((profileData?.deposit ?? 0) / 2).toString()
                  )
                }
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-x-[1px] border-black"
              >
                50%
              </Button>
              <Button
                onClick={() =>
                  setFill(
                    Math.floor((profileData?.deposit ?? 0) * 0.75).toString()
                  )
                }
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-x-[1px] border-black"
              >
                75%
              </Button>
              <Button
                onClick={() =>
                  setFill(Math.floor(profileData?.deposit ?? 0).toString())
                }
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-l-[1px] border-black"
              >
                100%
              </Button>
            </ButtonGroup>
          </div>
          <div className="h-full bg-[#ffffff] rounded-[5px] mt-[11px] w-[320px] h-full p-[0px]">
            <div className="flex w-full flex-col h-full">
              <Tabs
                aria-label="Options"
                variant="underlined"
                color="warning"
                classNames={{
                  panel: "bg-white",
                  tabList:
                    "gap-3 w-full relative rounded-none p-[5px] px-[7px]",
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
                          items={data?.bids.slice(0, 8) || []}
                          isLoading={isLoading}
                          loadingContent={<Spinner label="Loading..." />}
                        >
                          {(item) => (
                            <TableRow key={data?.bids.indexOf(item)}>
                              <TableCell>{item[0]}</TableCell>
                              <TableCell>{item[1]}</TableCell>
                              <TableCell>
                                {data?.bids
                                  .slice(data?.bids.indexOf(item) ?? 0, 8)
                                  .map((item) => item[1])
                                  .reduce((a, b) => {
                                    return a + b;
                                  }, 0)
                                  ?.toFixed(2)}
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
                          items={data?.asks.slice(0, 8) || []}
                          loadingContent={<Spinner label="Loading..." />}
                        >
                          {(item) => (
                            <TableRow key={data?.asks.indexOf(item)}>
                              <TableCell>{item[0]}</TableCell>
                              <TableCell>{item[1]}</TableCell>
                              <TableCell>
                                {data?.asks
                                  .slice(0, data?.asks.indexOf(item) + 1 ?? 8)
                                  .map((item) => item[1])
                                  .reduce((a, b) => {
                                    return a + b;
                                  }, 0)
                                  ?.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      <div className="flex h-[29px] gap-[6px] p-[0px] px-[10px] my-[9px] transition-[1s] transition-all">
                        <div
                          className="rounded-[5px] flex bg-[#e7f5ee] transition-[1s] transition-all"
                          style={{
                            width: `${
                              data
                                ? (data?.asks
                                    .slice(0, 8)
                                    .map((item) => item[1])
                                    .reduce((a, b) => {
                                      return a + b;
                                    }, 0) /
                                    data?.bids
                                      .slice(0, 8)
                                      .map((item) => item[1])
                                      .reduce((a, b) => {
                                        return a + b;
                                      }, 0)) *
                                  100
                                : 50
                            }%`,
                          }}
                        >
                          <div className="transition-[1s] transition-all rounded-[5px] border-[2px] border-[#23b36e] flex w-[29px] justify-center items-center text-[#45be84]">
                            B
                          </div>
                        </div>
                        <div className="rounded-[5px] flex w-full bg-[#ffeaea] justify-end w-min-[29px]">
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
          </div>
        </div>
      </div>
    </main>
  );
}
