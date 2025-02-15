import { z } from "zod";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { env } from "~/env.mjs";

let PAGE_LIMIT = 11;

export const ddbClient = new DynamoDBClient({
  region: "eu-west-2",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { chatHrefConstructor } from "~/helpers/chatHrefConstructor";

import {
  getMessages,
  markAsRead,
  saveMessage,
} from "../controllers/message-controller";
import { saveMessageSchema } from "~/validation/message";

export const chatRouter = createTRPCRouter({
  saveMessage: protectedProcedure
    .input(saveMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const primaryKey = chatHrefConstructor(
        input.recipientId,
        ctx.session.user.id,
      );
      return await saveMessage({ ...input, primaryKey });
    }),
  getMessages: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        exclusiveStartKey: z.record(z.string()).optional(),
      }),
    )
    .query(async ({ ctx, input: { chatId, exclusiveStartKey } }) => {
      const primaryKey = chatHrefConstructor(chatId, ctx.session.user.id);
      if (exclusiveStartKey) {
        PAGE_LIMIT += PAGE_LIMIT;
      }
      await markAsRead(primaryKey);
      return await getMessages({
        primaryKey,
        exclusiveStartKey,
        limit: PAGE_LIMIT,
      });
    }),
  deleteMessage: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .mutation(({ input: { chatId } }) => {
      const params = {
        TableName: "ChatHistory",
        Key: {
          primaryKey: { S: chatId },
        },
      };
      const command = new DeleteCommand(params);
      return ddbClient.send(command);
    }),
  isBlocked: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
        blockedBy: { has: ctx.session.user.id },
      },
    });
  }),
});
