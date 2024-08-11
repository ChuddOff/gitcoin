import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
    getUserDeposit: protectedProcedure.query(async ({ ctx }) => {
        return ctx.session.user.deposit
    })
})