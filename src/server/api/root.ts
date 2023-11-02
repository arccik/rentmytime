import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { friendRouter } from "./routers/friend";
import { uploaderRouter } from "./routers/file-upload";
import { chatRouter } from "./routers/chat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  friend: friendRouter,
  uploader: uploaderRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
