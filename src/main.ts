import {
  ClientConfig,
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  MessageAPIResponseBase,
  messagingApi,
} from "@line/bot-sdk";
import express, { Application, Request, Response } from "express";
import router from "./routes";
import layouts from "express-ejs-layouts";
import { load } from "ts-dotenv";
const env = load({
  CHANNEL_ACCESS_TOKEN: String,
  CHANNEL_SECRET: String,
  PORT: Number,
});
import { PrismaClient, User } from "@prisma/client";

const PORT = env.PORT || 3000;

const clientConfig: ClientConfig = {
  channelAccessToken: env.CHANNEL_ACCESS_TOKEN || "",
};

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: env.CHANNEL_ACCESS_TOKEN || "",
  channelSecret: env.CHANNEL_SECRET || "",
};

const client = new messagingApi.MessagingApiClient(clientConfig);
const prisma = new PrismaClient();

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(layouts);
app.use("/public", express.static("src/public"));
app.use("/", router);
app.listen(PORT, () => {
  console.log(`server start. http://localhost:${PORT}`);
});

const textEventHandler = async (
  event: WebhookEvent
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
  isFromUser: boolean
): Promise<void> => {
  await prisma.message.create({
    data: {
      userId: userId,
      content: text,
      isFromUser: isFromUser,
    },
  });
};

app.post(
  "/webhook",
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
