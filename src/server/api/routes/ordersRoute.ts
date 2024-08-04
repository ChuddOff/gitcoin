import { symbol, z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { OrderType } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";

export const ordersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const order = await ctx.db.orders.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        orderPrice: true,
        type: true,
        fill: true,
        symbol: true,
        TakeProfit: true,
        StopLoss: true,
        completed: true,
      },
    });

    return order;
  }),
  // тип цена ордера заполнить по стоимости тп сл
  buyOrder: protectedProcedure
    .input(
      z.object({
        price: z.number(),
        fill: z.number(),
        symbol: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { price, fill, symbol } = input;

      const order = await ctx.db.orders.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          orderPrice: price,
          type: "buy",
          fill,
          symbol,
        },
      });

      return { massage: "Успешно!" };
    }),

  sellOrder: protectedProcedure
    .input(
      z.object({
        price: z.number(),
        fill: z.number(),
        symbol: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { price, fill, symbol } = input;

      const order = await ctx.db.orders.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          orderPrice: price,
          type: "sell",
          fill,
          symbol,
        },
      });

      return { massage: "Успешно!" };
    }),

  updateOrder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        tp: z.number({ message: "tp must be a number" }),
        sl: z.number({ message: "sl must be a number" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tp, sl } = input;

      const isOrderExist = await ctx.db.orders.findUnique({
        where: {
          id,
        },
      });

      const userOrders = ctx.session.user.orders;

      const isUserOrderExist = userOrders.find((order) => order.id === id);

      if (!isUserOrderExist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid order",
        });
      }

      if (!isOrderExist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid order id",
        });
      }

      try {
        return await ctx.db.orders.update({
          where: {
            id,
          },
          data: {
            TakeProfit: tp,
            StopLoss: sl,
          },
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Order not found",
            });
          }
        }
      }
    }),

  markAsCompleted: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.db.orders.update({
        where: {
          id,
        },
        data: {
          completed: true,
        },
      });
    }),
});
