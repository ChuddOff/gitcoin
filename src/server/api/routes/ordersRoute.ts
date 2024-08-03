import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { OrderType } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";

export const ordersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.orders.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  // тип цена ордера заполнить по стоимости тп сл
  addOrder: protectedProcedure
    .input(
      z.object({
        type: z.enum(["buy", "sell"] as [OrderType, OrderType]),
        price: z.number(),
        fill: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { price, type, fill } = input;

      return ctx.db.orders.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          orderPrice: price,
          type,
          fill,
        },
      });
    }),

  updateOrder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        tp: z.number({ message: "tp must be a number" }),
        sl: z.number({ message: "sl must be a number" }),
        fill: z.number({ message: "fill must be a number" }),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, fill } = input;

      const isOrderExist = ctx.db.orders.findUnique({
        where: {
          id,
        },
      });

      if (!isOrderExist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid order id",
        });
      }

      try {
        return ctx.db.orders.update({
          where: {
            id,
          },
          data: {
            fill,
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
    .mutation(({ ctx, input }) => {
      const { id } = input;
      return ctx.db.orders.update({
        where: {
          id,
        },
        data: {
          completed: true,
        },
      });
    }),
});
