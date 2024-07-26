import ccxt from "ccxt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const exchange = new ccxt.bigone();

  try {
    const url = new URL(req.url || "");
    const params = new URLSearchParams(url.searchParams);
    const type = params.get("type");
    const orderBook = await exchange.fetchOrderBook(type as string);
    return NextResponse.json({
      status: 200,
      order: orderBook,
    });
  } catch (error) {
    return NextResponse.json({ status: 400, error: error });
  }
}
