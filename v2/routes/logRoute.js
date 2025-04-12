import express from "express";
import { handleAllRequest, handleGetRequestByUserId } from "../controllers/log.controller.js";

const router = express.Router();

router.get("/", handleAllRequest);
router.get("/:userId", handleGetRequestByUserId);

export default router;