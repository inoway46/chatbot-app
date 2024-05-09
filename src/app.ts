import express, { Application } from "express";
import router from "./routes";
import layouts from "express-ejs-layouts";
import { PrismaClient } from "@prisma/client";
import { middleware, MiddlewareConfig } from "@line/bot-sdk";
import { load } from "ts-dotenv";
const env = load({
  CHANNEL_SECRET: String,
});
import bodyParser from "body-parser";

export const prisma = new PrismaClient();

const config: MiddlewareConfig = {
  channelSecret: env.CHANNEL_SECRET || "",
};

const app: Application = express();

app.use("line/webhook", middleware(config));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(layouts);
app.use("/public", express.static("public"));
app.use("/", router);

export default app;
