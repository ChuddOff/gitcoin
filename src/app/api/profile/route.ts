import clientPromise from "@/lib/mongoConnect";
import code, { ICode } from "@/lib/model";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@clerk/backend";

interface IPocket {
  [key: string]: number;
}

interface IbodyPost {
  _id: string;
  nick: string;
  deposit: number;
  bonus: boolean;
  pocket: IPocket;
}

interface IbodyPut {
  _id: string;
  cost: number;
  coin: string;
  amount: number;
}

interface IbodyGet {
  _id: string;
  author: string;
}

// export async function PUT(req: NextRequest) {
//   await clientPromise;

//   try {
//     const bodyObject = (await req.json()) as IbodyPut;
//     const profile = await code.findOne({ _id: bodyObject._id }).exec();

//     if (!profile) {
//       return NextResponse.json({ status: 403 });
//     }

//     profile.deposit -= bodyObject.cost;

//     // if (profile.pocket[bodyObject.coin]) {
//     //   profile.pocket[bodyObject.coin] += bodyObject.amount;
//     // } else {
//     //   profile.pocket[bodyObject.coin] = bodyObject.amount;
//     // }

//     await profile.save();

//     return NextResponse.json({ status: 200 });
//   } catch (error) {
//     return NextResponse.json({ status: 400, error: error });
//   }
// }

// export async function POST(req: NextRequest) {
//   await clientPromise;

//   try {
//     const bodyObject = (await req.json()) as IbodyPost;
//     // _id, nick, deposit, bonus

//     const allReadyDone = await code.findOne({ _id: bodyObject._id }).exec();

//     if (!allReadyDone) {
//       return NextResponse.json({ status: 403 });
//     }

//     const newCode = await code.create(bodyObject);

//     await newCode.save();

//     return NextResponse.json({ status: 200 });
//   } catch (error) {
//     return NextResponse.json({ status: 400, error: error });
//   }
// }

export async function GET(req: NextRequest) {
  await clientPromise;

  try {
    const token = req.cookies.get("__session_Vzza_nc9");

    console.log(token);

    const { sub: user_id } = await verifyToken(token?.value ?? "", {
      jwtKey: process.env.CLERK_JWT_KEY,
    });

    const newCode = await code.findOne({ _id: user_id }).exec();

    if (!newCode) {
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
