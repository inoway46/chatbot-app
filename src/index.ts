import {
  ClientConfig,
  Client,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
} from '@line/bot-sdk';
import express, { Application, Request, Response } from 'express';
import { load } from 'ts-dotenv';
const env = load({
  CHANNEL_ACCESS_TOKEN: String,
  CHANNEL_SECRET: String,
  PORT: Number,
});
import { PrismaClient } from '@prisma/client';

const PORT = env.PORT || 3000;

const config = {
  channelAccessToken: env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: env.CHANNEL_SECRET || '',
};
const clientConfig: ClientConfig = config;
const middlewareConfig: MiddlewareConfig = config;
const client = new Client(clientConfig);

const app: Application = express();

const prisma = new PrismaClient();

app.get('/', async (_: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'success',
  });
});

const textEventHandler = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const userId = event.source.userId;
  if (userId !== undefined) {
    createUser(userId);
  }

  const { replyToken } = event;
  const { text } = event.message;
  const response: TextMessage = {
    type: 'text',
    text: text,
  };
  await client.replyMessage(replyToken, response);
};

const createUser = async (userId: string): Promise<void> => {
  const displayName = (await client.getProfile(userId))?.displayName;
  await prisma.user.upsert({
    where: { lineId: userId },
    update: {},
    create: {
      lineId: userId,
      name: displayName || 'unknown',
    },
  });
}

app.post(
  '/webhook',
  middleware(middlewareConfig),
  async (req: Request, res: Response): Promise<Response> => {
    const events: WebhookEvent[] = req.body.events;
    await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          await textEventHandler(event);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }
          return res.status(500);
        }
      })
    );
    return res.status(200);
  }
);

app.listen(PORT, () => {
  console.log(`listening port:${PORT}`);
});
