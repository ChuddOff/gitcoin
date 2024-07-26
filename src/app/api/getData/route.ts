import ccxt from "ccxt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log(1);

  const exchange = new ccxt.binance();

  try {
    console.log(2);
    const url = new URL(req.url || "");
    const params = new URLSearchParams(url.searchParams);
    console.log(3);
    const type = params.get("type");
    console.log(4);
    const orderBook = await exchange.fetchOrderBook(type as string);
    console.log(5);
    return NextResponse.json({
      status: 200,
      order: orderBook,
    });
  } catch (error) {
    return NextResponse.json({ status: 400, error: error });
  }
}
