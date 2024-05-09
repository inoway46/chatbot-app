import { prisma } from "../app";
import { client } from "../controllers/lineController";
import { Request, Response } from "express";
import { LAYOUTS, PREFECTURES } from "../lib/condition_constants";

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
      userId: id,
      userName: user?.name,
      messages: user?.messages,
      errorMessage: req.query.error_message,
    });
  },

  postUserMessage: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { message } = req.body;
    if (!message || message === "") {
      const errorMessage = "メッセージを入力してください";
      res.redirect(
        `/users/${id}/messages?error_message=${encodeURIComponent(errorMessage)}`,
      );
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user?.lineId) {
      const errorMessage = "LINE未連携のため送信できません";
      res.redirect(
        `/users/${id}/messages?error_message=${encodeURIComponent(errorMessage)}`,
      );
      return;
    }
    await client
      .pushMessage({
        to: user?.lineId,
        messages: [{ type: "text", text: message }],
      })
      .catch(() => {
        const errorMessage = "送信に失敗しました";
        res.redirect(
          `/users/${id}/messages?error_message=${encodeURIComponent(errorMessage)}`,
        );
        return;
      });
    await prisma.message.create({
      data: {
        userId: Number(id),
        content: message,
        isFromUser: false,
      },
    });
    res.redirect(`/users/${id}/messages`);
  },

  getUserCondition: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        condition: {
          include: {
            layouts: true,
          },
        },
      },
    });
    console.log(user?.condition?.layouts);

    res.render("users/condition", {
      userId: id,
      userName: user?.name,
      condition: user?.condition,
      LAYOUTS: LAYOUTS,
      PREFECTURES: PREFECTURES,
    });
  },

  postUserCondition: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { rent, squareMeters, layouts, location } = req.body;

    const rentInt = parseInt(rent, 10);
    const squareMetersInt = parseInt(squareMeters, 10);

    const condition = await prisma.condition.upsert({
      where: { userId: Number(id) },
      update: {
        rent: rentInt,
        squareMeters: squareMetersInt,
        location,
      },
      create: {
        rent: rentInt,
        squareMeters: squareMetersInt,
        location,
        userId: Number(id),
      },
    });

    await prisma.layout.deleteMany({
      where: {
        conditionId: condition.id,
      },
    });

    for (const layoutName of layouts) {
      await prisma.layout.create({
        data: {
          conditionId: condition.id,
          name: layoutName,
        },
      });
    }
    res.redirect(`/users/${id}/condition`);
  },
};
