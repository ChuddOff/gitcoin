import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  JsonValue,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import ccxt from "ccxt";

export const coinRouter = createTRPCRouter({
  buy: protectedProcedure
    .input(z.object({ cost: z.number(), coin: z.string(), amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      if (user.deposit < input.amount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Balance is not enough",
        });
      }

      const profilePocket = new Map(Object.entries(user.pocket));

      if (profilePocket.has(input.coin)) {
        const value = profilePocket.get(input.coin);
        if (typeof value === "number") {
          profilePocket.set(input.coin, value + input.amount);
        }
      } else {
        profilePocket.set(input.coin, input.amount);
      }

      await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          deposit: user.deposit - input.amount,
          pocket: {
            push: Object.fromEntries(profilePocket) as unknown as JsonValue[],
          },
        },
      });

      return { success: true };
    }),

  sell: protectedProcedure
    .input(z.object({ cost: z.number(), coin: z.string(), amount: z.number() }))
    .query(({ ctx, input }) => {
      const { user } = ctx.session;

      const profilePocket = new Map(Object.entries(user.pocket));

      if (profilePocket.has(input.coin)) {
        profilePocket.set(
          input.coin,
          ((profilePocket.get(input.coin) as number) ?? 0) - input.amount
        );
      } else {
        profilePocket.set(input.coin, input.amount);
      }

      ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          deposit: user.deposit - input.cost,
          pocket: Object.fromEntries(profilePocket),
        },
      });
    }),

  getCosts: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ input }) => {
      const exchange = new ccxt.bigone();

      const ticket = await exchange.fetchTicker(input.type);

      return { price: ticket.last };
    }),

  getData: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ input }) => {
      const exchange = new ccxt.bigone();
      const orderBook = await exchange.fetchOrderBook(input.type);

      return orderBook;
    }),
});
