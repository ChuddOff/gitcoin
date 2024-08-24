"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const SwitchText: React.FC = () => {
  const [state, setState] = useState<number>(0);

  const text = useRef<HTMLDivElement>(null);

  const coefficient = window && window.innerWidth > 1400 ? 22.3 : 19.5;

  const switchText = () => {
    setState((state) => (state % text.current!.childElementCount) + 1);
  };

  useEffect(() => {
    const interval = setInterval(switchText, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gap-[30px] flex w-[calc(100vw-16px)] h-[58px] rounded-[5px] mt-[5px] mb-[5px] px-[22px] items-center bg-[#F0DDF3] dark:bg-[#fddf91] dark:border-[#7d8a88] dark:border-[1px]">
      <Image src="/bell.svg" alt="bell" width={45} height={45} />
      <div
        className={`h-[23px] overflow-hidden text-[15px] font-[800] max-[700px]:text-[13px]`}
      >
        <div
          className={`flex flex-col ${
            state !== 1 && "duration-1000 transition-all ease-in-out"
          }`}
          style={{ transform: `translateY(-${(state - 1) * coefficient}px)` }}
          ref={text}
        >
          <h2 className=" text-black">
            GItCoin добавит 12 торговых пар с EUR в листинг на споте
          </h2>
          <h2 className=" text-black">
            GItCoin добавит 12 торговых пар с EUR в листинг на споте
          </h2>
          <h2 className=" text-black">
            GItCoin добавит 12 торговых пар с EUR в листинг на споте
          </h2>
          <h2 className=" text-black">
            GItCoin добавит 12 торговых пар с EUR в листинг на споте
          </h2>
          <h2 className=" text-black">
            GItCoin добавит 12 торговых пар с EUR в листинг на споте
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SwitchText;
