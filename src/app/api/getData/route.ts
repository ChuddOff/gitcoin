import ccxt from "ccxt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log(1);

  const exchange = new ccxt.bigone();

  try {
    console.log(exchange.id);
    const url = new URL(req.url || "");
    const params = new URLSearchParams(url.searchParams);
    console.log(url);
    const type = params.get("type");
    console.log(type);
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
