import { Request, Response } from "express";
import createRoomInfoMessage from "../lib/room_info_scraper";

export default {
  getRoomInfo: async (req: Request, res: Response) => {
    const roomUrl = req.body.url;
    try {
      const message = await createRoomInfoMessage(roomUrl);
      console.log(message);
      res.json({
        type: "text",
        message: message,
      });
    } catch (error) {
      console.log(error);
      res.json({
        type: "text",
        error_message: "不正なURLです",
      });
    }
  },
};
