import code from "@/lib/model";
import { clerkMiddleware, verifyToken } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
