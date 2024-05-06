import express from "express";
import apiController from "../controllers/apiController";

const router = express.Router();

router.post("/get-room-info", apiController.getRoomInfo);

export default router;
