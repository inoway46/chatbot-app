import express from "express";
import usersController from "../controllers/usersController";

const router = express.Router();

router.get("/", usersController.index);
router.get("/:id/messages", usersController.getUserMessages);
router.post("/:id/messages", usersController.postUserMessage);
router.get("/:id/condition", usersController.getUserCondition);
router.post("/:id/condition", usersController.postUserCondition);

export default router;
