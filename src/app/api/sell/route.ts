import clientPromise from "@/lib/mongoConnect";
import code, { ICode } from "@/lib/model";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@clerk/backend";

interface Ibody {
  cost: number;
  coin: string;
  amount: number;
}

export async function PUT(req: NextRequest) {
  await clientPromise;

  try {
    const token = req.cookies.get("__session_Vzza_nc9");

    const { sub: user_id } = await verifyToken(token?.value ?? "", {
      jwtKey: process.env.CLERK_JWT_KEY,
    });
    const bodyObject = (await req.json()) as Ibody;
    const profile = await code.findOne({ _id: user_id }).exec();

    if (!profile) {
      return NextResponse.json({ status: 403 });
    }

    profile.deposit -= bodyObject.cost;

    profile.pocket = new Map(Object.entries(profile.pocket));

    if (profile.pocket.has(bodyObject.coin)) {
      profile.pocket.set(
        bodyObject.coin,
        (profile.pocket.get(bodyObject.coin) ?? 0) - bodyObject.amount
      );
    } else {
      profile.pocket.set(bodyObject.coin, bodyObject.amount);
    }

    await profile.save();
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 400, error: error });
  }
}

export async function POST(req: NextRequest) {
  await clientPromise;

  try {
    const token = req.cookies.get("__session_Vzza_nc9");

    const { sub: user_id } = await verifyToken(token?.value ?? "", {
      jwtKey: process.env.CLERK_JWT_KEY,
    });

    const bodyObject = (await req.json()) as Ibody;
    const profile = await code.findOne({ _id: user_id }).exec();

    if (!profile) {
      return NextResponse.json({ status: 403 });
    }

    if (profile.deposit < bodyObject.cost) {
      return NextResponse.json({ status: 400 });
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 400, error: error });
  }
}
