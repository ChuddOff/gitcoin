import clientPromise from "@/lib/mongoConnect";
import code, { ICode } from "@/lib/model";
import { Db, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

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

export async function PUT(req: NextRequest) {
  await clientPromise;

  try {
    const bodyObject = (await req.json()) as IbodyPut;
    const profile = await code.findOne({ _id: bodyObject._id }).exec();

    if (!profile) {
      return NextResponse.json({ status: 403 });
    }

    profile.deposit -= bodyObject.cost;

    // if (profile.pocket[bodyObject.coin]) {
    //   profile.pocket[bodyObject.coin] += bodyObject.amount;
    // } else {
    //   profile.pocket[bodyObject.coin] = bodyObject.amount;
    // }

    await profile.save();

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 400, error: error });
  }
}

export async function POST(req: NextRequest) {
  console.log(23233);

  await clientPromise;

  try {
    const bodyObject = (await req.json()) as IbodyPost;
    // _id, nick, deposit, bonus

    console.log(bodyObject);

    const allReadyDone = await code.findOne({ _id: bodyObject._id }).exec();

    console.log(allReadyDone);

    if (!allReadyDone) {
      return NextResponse.json({ status: 403 });
    }

    const newCode = await code.create(bodyObject);

    await newCode.save();

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 400, error: error });
  }
}

export async function GET(req: NextRequest) {
  await clientPromise;

  try {
    const url = new URL(req.url || "");
    const params = new URLSearchParams(url.searchParams);

    const _id = params.get("_id");

    const newCode = await code.findOne({ _id: _id }).exec();

    if (!newCode) {
      return NextResponse.json({ status: 400 });
    }

    return NextResponse.json({ status: 200, profile: newCode });
  } catch (error) {
    return NextResponse.json({ status: 400, error: error });
  }
}

// export async function DELETE(req: NextRequest) {
//   await clientPromise;

//   try {
//     const url = new URL(req.url || "");
//     const params = new URLSearchParams(url.searchParams);

//     const _id = params.get("_id");
//     const author = params.get("author");

//     const Code = await code.findOne({ _id: _id }).exec();

//     if (Code!.author !== author) {
//       return NextResponse.json({ status: 403 });
//     }

//     await code.deleteOne({ _id: _id });

//     return NextResponse.json({ status: 200 });
//   } catch (error) {
//     return NextResponse.json({ status: 400, error: error });
//   }
// }
