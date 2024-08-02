import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import ccxt from "ccxt";

export const coinRouter = createTRPCRouter({
  buy: publicProcedure
    .input(z.object({ cost: z.number(), coin: z.string(), amount: z.number() }))
    .mutation(({ ctx, input }) => {
      const user = ctx.session?.user;

      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
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

      ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          deposit: user.deposit - input.cost,
          pocket: Object.fromEntries(profilePocket),
        },
      });

      return { success: true };
    }),

  getCosts: publicProcedure
    .input(z.object({ type: z.string() }))
    .mutation(async ({ input }) => {
      const exchange = new ccxt.bigone();

      const ticket = await exchange.fetchTicker(input.type);

      return {price: ticket.last};
    }),

  getData: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ input }) => {
      const exchange = new ccxt.bigone();
      const orderBook = await exchange.fetchOrderBook(input.type);

      return orderBook;
    }),

  sell: publicProcedure
    .input(z.object({ cost: z.number(), coin: z.string(), amount: z.number() }))
    .query(({ ctx, input }) => {
      const user = ctx.session?.user;

      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

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
});
