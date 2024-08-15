import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const Chart: React.FC = () => {
  const searchParams = useSearchParams();
  const tvwidgetsymbol = searchParams.get("tvwidgetsymbol");

  const chart = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const chartscript = document.createElement("script");
    chartscript.style.display = theme === "light" ? "block" : "none";
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

    const chartscript2 = document.createElement("script");
    chartscript2.style.display = theme === "dark" ? "block" : "none";
    chartscript2.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    chartscript2.type = "text/javascript";
    chartscript2.async = true;
    chartscript2.innerHTML = `
        {
          "autosize": true,
          "symbol": "${tvwidgetsymbol || "BITSTAMP:BTCUSD"}",
          "interval": "S",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "ru",
          "allow_symbol_change": true,
          "calendar": true,
          "support_host": "https://www.tradingview.com"
        }`;

    if (chart.current!.children.length === 1) {
      chart.current!.appendChild(chartscript);
      chart.current!.appendChild(chartscript2);
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
