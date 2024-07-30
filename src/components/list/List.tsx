import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const List: React.FC = () => {
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
  }, [widgetContainerRef]);

  return (
    <div className="tradingview-widget-container" ref={widgetContainerRef}>
      <div className="tradingview-widget-container__widget "></div>
    </div>
  );
};

export default List;
