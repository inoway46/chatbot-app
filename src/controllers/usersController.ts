import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  index: async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.render("users/index", { users });
  },

  getUserMessages: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { messages: true },
    });
    res.render("users/messages", {
      userName: user?.name,
      messages: user?.messages,
    });
  },
};
