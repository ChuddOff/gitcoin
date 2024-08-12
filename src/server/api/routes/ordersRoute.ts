import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
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
        isAlreadyCompleted: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      const { price, fill, symbol } = input;

      if (ctx.session.user.deposit < fill) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Недостаточно средств",
        });
      }

      await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          deposit: user.deposit - input.fill,
        },
      });

      await ctx.db.orders.create({
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
          completed: input.isAlreadyCompleted,
        },
      });

      return {
        massage: "Успешно!",
        isAlreadyCompleted: input.isAlreadyCompleted,
      };
    }),

  sellOrder: protectedProcedure
    .input(
      z.object({
        price: z.number(),
        fill: z.number(),
        symbol: z.string(),
        isAlreadyCompleted: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      const { price, fill, symbol } = input;

      let userPocket = user.pocket;

      const existPocket = userPocket.find(
        (pocketItem) => pocketItem[input.symbol] !== undefined
      );

      if (existPocket![symbol] < fill) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Недостаточно средств",
        });
      }

      if (existPocket) {
        const existingPocketIndex = userPocket.indexOf(existPocket);
        const updatedPocket = userPocket[existingPocketIndex] as Record<
          string,
          number
        >;
        updatedPocket[input.symbol] += input.price;

        userPocket[existingPocketIndex] = updatedPocket;
      } else {
        userPocket.push({
          [input.symbol]: input.price,
        });
      }

      await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          pocket: userPocket,
        },
      });

      await ctx.db.orders.create({
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
          completed: input.isAlreadyCompleted,
        },
      });

      return {
        massage: "Успешно!",
        isAlreadyCompleted: input.isAlreadyCompleted,
      };
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
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const isUserOrderExist = ctx.session.user.orders.find(
        (order) => order.id === input.id
      );

      if (!isUserOrderExist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid order",
        });
      }

      return await ctx.db.orders.update({
        where: {
          id: input.id,
        },
        data: {
          completed: true,
        },
      });
    }),
});
