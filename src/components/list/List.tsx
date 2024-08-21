import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const List: React.FC = () => {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    widgetContainerRef.current?.children[1] &&
      widgetContainerRef.current!.removeChild(
        widgetContainerRef.current!.children[1]
      );
    widgetContainerRef.current?.children[0] &&
      widgetContainerRef.current!.removeChild(
        widgetContainerRef.current!.children[0]
      );
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
  "colorTheme": "${theme === "dark" ? "dark" : "light"}",
  "locale": "ru",
  "largeChartUrl": "http://${window.location.host}/exchange/"
  
  }`;

    if (widgetContainerRef!.current!.childElementCount === 0) {
      widgetContainerRef.current!.appendChild(marketsscript);
    }
  }, [widgetContainerRef, theme]);

  return (
    <div className="tradingview-widget-container" ref={widgetContainerRef}>
      <div className="tradingview-widget-container__widget "></div>
    </div>
  );
};

export default List;
