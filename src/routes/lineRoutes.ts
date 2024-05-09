import express from "express";
import lineController from "../controllers/lineController";

const router = express.Router();

router.post("/webhook", lineController.webhook);

export default router;
