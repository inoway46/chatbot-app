import { Request, Response } from "express";
import { prisma } from "../app";
import { User } from "@prisma/client";
import {
  ClientConfig,
  WebhookEvent,
  MessageAPIResponseBase,
  messagingApi,
} from "@line/bot-sdk";
import { load } from "ts-dotenv";

const env = load({
  CHANNEL_ACCESS_TOKEN: String,
});

const clientConfig: ClientConfig = {
  channelAccessToken: env.CHANNEL_ACCESS_TOKEN || "",
};

export const client = new messagingApi.MessagingApiClient(clientConfig);

const textEventHandler = async (
  event: WebhookEvent,
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  const lineId = event.source.userId;
  if (lineId === undefined) {
    console.error("lineId is undefined");
    return;
  }

  const user = await createUser(lineId);

  const { text } = event.message;
  await createMessage(user.id, text, true);

  const responseText = `「${text}」ですね。`;
  await client.replyMessage({
    replyToken: event.replyToken as string,
    messages: [
      {
        type: "text",
        text: responseText,
      },
    ],
  });
  await createMessage(user.id, responseText, false);
};

const createUser = async (lineId: string): Promise<User> => {
  const displayName = (await client.getProfile(lineId))?.displayName;
  const user = await prisma.user.upsert({
    where: { lineId: lineId },
    update: {},
    create: {
      lineId: lineId,
      name: displayName || "unknown",
    },
  });

  return user;
};

const createMessage = async (
  userId: number,
  text: string,
  isFromUser: boolean,
): Promise<void> => {
  await prisma.message.create({
    data: {
      userId: userId,
      content: text,
      isFromUser: isFromUser,
    },
  });
};

export default {
  webhook: async (req: Request, res: Response) => {
    const events = req.body.events;
    await Promise.all(
      events.map(async (event: WebhookEvent) => {
        await textEventHandler(event);
      }),
    );
    res.sendStatus(200);
  },
};
