import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/server/db";
import * as argon2 from "argon2";

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
      pocket: Object[];
      orders: Object[];
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
    pocket: Object[];
    orders: Object[];
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
      });

      // return to session default token and role, likedPosts
      return {
        sub: token.sub,
        name: dbuser!.name,
        email: dbuser!.email,
        image: dbuser!.image,
        pocket: dbuser!.pocket as Object[],
        deposit: dbuser!.deposit,
        bonus: dbuser!.bonus,
        orders: dbuser!.orders as Object[],
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
          pocket: token.pocket as Object[],
          orders: token.orders as Object[],
        },
      };
    },
  },
  secret: "s3cr3t", // replace it CHUD
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
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
        const user = await db.user.findFirst({
          where: {
            name: credentials?.username,
          },
        });

        if (!user || user.password) {
          throw new Error("Invalid username or password");
        }

        const passwordMatch = argon2.verify(
          user.password as string,
          credentials?.password as string
        );

        if (!passwordMatch) {
          throw new Error("Invalid password");
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
