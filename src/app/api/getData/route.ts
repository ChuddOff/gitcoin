import ccxt from "ccxt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const exchange = new ccxt.binance();

  try {
    const url = new URL(req.url || "");
    const params = new URLSearchParams(url.searchParams);

    const type = params.get("type");

    const OHLCV = await exchange.fetchOHLCV(
      type as string,
      "1d",
      exchange.parse8601("2022-07-01T00:00:00Z"),
      1000000
    );

    const orderBook = await exchange.fetchOrderBook(type as string);

    const ticker = await exchange.fetchTicker(type as string);
    console.log(ticker.last);

    if (!OHLCV) {
      return NextResponse.json({ status: 400 });
    }

    return NextResponse.json({
      status: 200,
      OHLC: OHLCV,
      order: orderBook,
      prise: ticker.last,
    });
  } catch (error) {
    return NextResponse.json({ status: 400, error: error });
  }
}
