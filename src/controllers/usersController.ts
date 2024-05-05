import Express from "express";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  index: async (req: Express.Request, res: Express.Response) => {
    const users = await prisma.user.findMany();
    res.render("users/index", { users });
  },
};
