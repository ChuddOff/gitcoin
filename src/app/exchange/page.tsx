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
import List from "@/components/list/List";
import Chart from "@/components/chart/Chart";
import Details from "@/components/details/Details";
import Orders from "@/components/orders/Orders";

interface profileData {
  _id: string;
  nick: string;
  deposit: number;
  bonus: boolean;
}

async function getProfileData() {
  let response = await fetch("/api/profile", {
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
async function putProfileData(cost: number, coin: string, amount: number) {
  let response = await fetch("/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cost: cost,
      coin: coin,
      amount: amount,
    }),
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

  const [price, setPrice] = useState<number>(0);
  const [fill, setFill] = useState<number>(0);

  async function fetchProfileData() {
    setIsLoadingProfile(true);
    try {
      const newData = await getProfileData();
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

  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
    }
  }, [user?.id]);

  return (
    <main className="flex flex-col items-center bg-gradient-to-b from-[#2EDEBE] to-[#A098FF] h-[calc(100vh-65px)] overflow-hidden">
      <SwitchText />
      <div className=" flex gap-[8px] ">
        <div className="w-[350px] bg-white rounded-[5px] overflow-hidden">
          <List />
        </div>
        <div className="w-[1205px]">
          <div className="h-[86px] bg-[#101014] rounded-[4px] w-[1205px] overflow-hidden">
            <Details />
          </div>
          <div className="h-[500px] bg-white rounded-[5px] overflow-hidden">
            <Chart />
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
              onClick={() =>
                putProfileData(
                  fill,
                  tvwidgetsymbol ?? "BITSTAMP:BTCUSD",
                  +(fill / price).toFixed(8)
                )
              }
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
            value={`${price}`}
            onChange={(e) =>
              setPrice(
                e.target.value.match("^\\d+([,.]\\d+)?$")
                  ? +e.target.value
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
            value={`${fill}`}
            onChange={(e) =>
              setFill(
                e.target.value.match("^\\d+([,.]\\d+)?$")
                  ? +e.target.value
                  : fill
              )
            }
          />
          <div className="mt-[15px] flex items-center gap-[1px]">
            <ButtonGroup>
              <Button
                onClick={() =>
                  setFill(Math.floor((profileData?.deposit ?? 0) / 10))
                }
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-r-[1px] border-black p-[0px]"
              >
                10%
              </Button>
              <Button
                onClick={() =>
                  setFill(Math.floor((profileData?.deposit ?? 0) / 4))
                }
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-x-[1px] border-black"
              >
                25%
              </Button>
              <Button
                onClick={() =>
                  setFill(Math.floor((profileData?.deposit ?? 0) / 2))
                }
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-x-[1px] border-black"
              >
                50%
              </Button>
              <Button
                onClick={() =>
                  setFill(Math.floor((profileData?.deposit ?? 0) * 0.75))
                }
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-x-[1px] border-black"
              >
                75%
              </Button>
              <Button
                onClick={() => setFill(Math.floor(profileData?.deposit ?? 0))}
                color="danger"
                size="sm"
                className="text-[#d6d5d5] font-[800] text-[13px] w-[30px] bg-[#606060] border-l-[1px] border-black"
              >
                100%
              </Button>
            </ButtonGroup>
          </div>
          <div className="h-full bg-[#ffffff] rounded-[5px] mt-[11px] w-[320px] h-full p-[0px]">
            <Orders />
          </div>
        </div>
      </div>
    </main>
  );
}
