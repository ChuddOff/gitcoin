import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import ccxt from "ccxt";
import { Prisma } from "@prisma/client";

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

      let userPocket = user.pocket;

      const existPocket = userPocket.find(
        (pocketItem) => pocketItem[input.coin] !== undefined
      );

      if (existPocket) {
        const existingPocketIndex = userPocket.indexOf(existPocket);
        const updatedPocket = userPocket[existingPocketIndex] as Record<
          string,
          number
        >;
        updatedPocket[input.coin] += input.amount;

        userPocket[existingPocketIndex] = updatedPocket;
      } else {
        userPocket.push({
          [input.coin]: input.amount,
        });
      }

      await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          pocket: userPocket as Prisma.InputJsonValue[],
        },
      });

      return { success: true, coin: input.coin, amount: input.amount };
    }),

  sell: protectedProcedure
    .input(z.object({ cost: z.number(), coin: z.string(), amount: z.number() }))
    .query(({ ctx, input }) => {
      const { user } = ctx.session;

      ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          deposit: user.deposit + input.cost,
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
