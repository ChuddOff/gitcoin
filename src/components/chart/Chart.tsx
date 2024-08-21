import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const Chart: React.FC = () => {
  const searchParams = useSearchParams();
  const tvwidgetsymbol = searchParams.get("tvwidgetsymbol");

  const chart = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    console.log(chart);
    chart.current?.children[1] &&
      chart.current!.removeChild(chart.current!.children[1]);
    chart.current?.children[0] &&
      chart.current!.removeChild(chart.current!.children[0]);
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
          "theme": "${theme === "dark" ? "dark" : "light"}",
          "style": "1",
          "locale": "ru",
          "allow_symbol_change": true,
          "calendar": true,
          "support_host": "https://www.tradingview.com"
        }`;

    if (chart.current!.childElementCount === 0) {
      chart.current!.appendChild(chartscript);
    }
  }, [chart, tvwidgetsymbol, theme]);

  return (
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
  );
};

export default Chart;
