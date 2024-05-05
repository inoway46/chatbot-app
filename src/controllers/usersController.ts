import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  index: async (req: express.Request, res: express.Response) => {
    const users = await prisma.user.findMany();
    res.render("users/index", { users });
  },
};
