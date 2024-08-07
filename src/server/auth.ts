import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { JsonValue, type Adapter } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas/login";
import { z } from "zod";
import { Orders } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      deposit: number;
      bonus: boolean;
      pocket: JsonValue[];
      orders: Orders[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    name: string;
    email: string;
    image: string;
    deposit: number;
    bonus: boolean;
    pocket: JsonValue[];
    orders: Orders[];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/",
    signOut: "/",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 * 30 },
  callbacks: {
    jwt: async ({ token }): Promise<JWT> => {
      // check if like pressed

      // find user in db ( adapter Prisma спочатку створить юзера якшо його немає. Тому він завжди є )
      const dbuser = await db.user.findFirst({
        where: {
          id: token.sub,
        },
        select: {
          name: true,
          email: true,
          image: true,
          deposit: true,
          bonus: true,
          pocket: true,
          orders: true,
        },
      });

      // return to session default token and role, likedPosts
      return {
        sub: token.sub,
        name: dbuser!.name,
        email: dbuser!.email,
        image: dbuser!.image,
        pocket: dbuser!.pocket,
        deposit: dbuser!.deposit,
        bonus: dbuser!.bonus,
        orders: dbuser!.orders,
      };
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          id: token.sub,
          name: token.name,
          email: token.email,
          image: token.image as string,
          deposit: token.deposit,
          bonus: token.bonus,
          pocket: token.pocket,
          orders: token.orders,
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        if(!credentials?.username || !credentials?.password) {
          throw new Error("No credentials provided");
        }

        try {
          LoginSchema.parse(credentials);
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(error.errors[0].message)
          }
        }
        
        const user = await db.user.findFirst({
          where: {
            name: credentials?.username,
          },
        });

        if (!user) {
          throw new Error("No user provided");
        }

        // means user trying login to discord account
        if(!user.password) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Wrong password");
        }

        const { password, ...payload } = user;

        return payload;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
