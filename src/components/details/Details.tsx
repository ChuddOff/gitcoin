import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const Details: React.FC = () => {
  const searchParams = useSearchParams();
  const tvwidgetsymbol = searchParams.get("tvwidgetsymbol");

  const details = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [details]);

  return (
    <div
      className="tradingview-widget-container translate-y-[-85px]"
      ref={details}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default Details;
