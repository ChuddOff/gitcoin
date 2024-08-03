import { db } from "@/server/db";
import { NextResponse } from "next/server";
import * as argon2 from "argon2";
import { registerSchema } from "@/schemas/register";
import { z } from "zod";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, email, password } = body;

  try {
    registerSchema.parse({ username, email, password });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);

      return NextResponse.json(
        {
          success: false,
          error: error.errors[0].message,
        },
        {
          status: 400,
        }
      );
    }
  }

  const userExist = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (userExist) {
    return NextResponse.json({
      success: false,
      error: "User with this email already exist",
    });
  }

  const hashedPassword = await argon2.hash(password);

  await db.user.create({
    data: {
      name: username,
      email,
      password: hashedPassword,
      pocket: [],
      bonus: false,
      deposit: 10000,
      image:
        "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
    },
  });

  return NextResponse.json({ success: true, error: null });
}
