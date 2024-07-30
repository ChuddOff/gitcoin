import clientPromise from "@/lib/mongoConnect";
import code, { ICode } from "@/lib/model";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@clerk/backend";

export async function GET(req: NextRequest) {
  await clientPromise;

  try {
    console.log(0);
    const token = await req.cookies.get("__session_Vzza_nc9");
    console.log(token);
    const { sub: user_id } = await verifyToken(token?.value ?? "", {
      jwtKey: process.env.CLERK_JWT_KEY,
    });

    console.log(user_id);

    const newCode = await code.findOne({ _id: user_id }).exec();

    if (!newCode) {
      console.log(1212);

      const newProfile = await code.create({
        _id: user_id,
        deposit: 10000,
        bonus: true,
        pocket: [],
      });

      await newProfile.save();

      return NextResponse.json({ status: 200, profile: newProfile });
    }

    return NextResponse.json({ status: 200, profile: newCode });
  } catch (error) {
    return NextResponse.json({ status: 400, error: error });
  }
}
