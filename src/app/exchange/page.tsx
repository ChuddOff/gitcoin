"use client";

import "./page.css";
import Image from "next/image";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
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
  Tab,
  Tabs,
} from "@nextui-org/react";

interface OHLCData {
  OHLC: any[][];
  order: any;
  prise: number;
  status: number;
}

async function getData(type: string) {
  const url = process.env.URL;
  let response = await fetch("/api/getData?type=" + type, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

export default function Home() {
  const [data, setData] = useState<OHLCData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [price, setPrice] = useState<string>();
  const [fill, setFill] = useState<string>();

  async function fetchData() {
    try {
      const newData = await getData("BTC/USDT");
      setData(newData ?? data);
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
          "symbol": "BITSTAMP:BTCUSD",
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
          "symbol": "BITSTAMP:BTCUSD",
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
  }, []);

  useEffect(() => {
    fetchData(); // Первоначальный запрос данных

    const intervalId = setInterval(fetchData, 10000); // Обновление данных каждые 5 секунд

    return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
  }, []);

  return (
    <main className="flex flex-col items-center w-full bg-gradient-to-b from-[#2EDEBE] to-[#A098FF] h-[calc(100vh-65px)] overflow-hidden">
      <div className="flex w-[1890px] h-[58px] rounded-[5px] mt-[5px] mb-[5px] px-[22px] items-center bg-[#F0DDF3]">
        <Image src="/bell.svg" alt="bell" width={45} height={45} />
      </div>
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
          <div className="h-[150px] bg-[#101014] rounded-[5px]">
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
          <div className="w-[323px] h-[47px] border-[1px] mt-[34px] p-[11px] flex items-center justify-between">
            <h3 className="font-[800] text-[13px] text-black">
              Доступ Баланс:
            </h3>
            <h3 className="font-[800] text-[13px] text-black">10030,30 USDT</h3>
          </div>
          <div className="mt-[32px] flex items-center gap-[30px]">
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
              base: "max-w-full max-w-[300px] w-full h-[40px] mt-[32px]",
              mainWrapper: "h-full ",
              input: "text-[#b7b2b2] font-[800] text-[12px] bg-transparent ",
              innerWrapper: "flex",
              inputWrapper:
                "rounded-[8px] h-full text-default-500 bg-[white] border-[black] data-[hover=true]:bg-[#F8F8FF] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text",
            }}
            endContent={
              <div className="h-full flex items-center justify-center w-[76px]">
                <h3 className="text-[#45979f] font-[800] text-[12px]">
                  Последняя
                </h3>
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
              base: "max-w-full max-w-[300px] w-full h-[40px] mt-[36px] ",
              mainWrapper: "h-full ",
              input: "text-[#b7b2b2] font-[800] text-[12px] bg-transparent ",
              innerWrapper: "flex",
              inputWrapper:
                "rounded-[8px] h-full text-default-500 bg-[white] border-[black] data-[hover=true]:bg-[#F8F8FF] group-data-[focus=true]:bg-[#FFFFF0] !cursor-text",
            }}
            endContent={
              <div className="h-full flex items-center w-[76px]">
                <h3 className="text-[#45979f] font-[800] text-[12px]">USDT</h3>
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
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-r-[1px] border-black p-[0px]"
              >
                10%
              </Button>
              <Button
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-x-[1px] border-black"
              >
                25%
              </Button>
              <Button
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-x-[1px] border-black"
              >
                50%
              </Button>
              <Button
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-x-[1px] border-black"
              >
                75%
              </Button>
              <Button
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-l-[1px] border-black"
              >
                100%
              </Button>
            </ButtonGroup>
          </div>
          <div className="h-full bg-[#ffffff] rounded-[5px] mt-[11px] w-[300px]">
            <div className="flex w-full flex-col h-full">
              <Tabs
                aria-label="Options"
                variant="underlined"
                color="warning"
                classNames={{
                  tabList: "gap-3 w-full relative rounded-none p-[12px]",
                  cursor: "w-full",
                  tab: " px-0",
                  tabContent:
                    "text-[#b4b6b9] font-[700] group-data-[selected=true]:text-black",
                }}
              >
                <Tab key="photos" title="Книга ордеров" className=" h-full p-0">
                  <Card className="rounded-[0px] p-[0px] h-full rounded-[5px]">
                    <CardBody className="p-[0px] h-full] bg-[#f9f9f9] border-[0px] p-[10px]">
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="music" title="Недавние торги" className=" h-full p-0">
                  <Card className="rounded-[0px] p-[0px] h-full rounded-[5px]">
                    <CardBody className="p-[0px] h-full bg-[#f9f9f9] border-[0px] p-[10px]">
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
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
