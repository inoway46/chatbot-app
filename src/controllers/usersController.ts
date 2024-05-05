import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  index: async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.render("users/index", { users });
  },
};
