import express from "express";
import { getUserLogStats, handleAllRequest, handleGetRequestByUserId } from "../controllers/log.controller.js";

const router = express.Router();

router.get("/", handleAllRequest);
router.get("/:userId", handleGetRequestByUserId);
router.get("/stats/:userId", getUserLogStats);

export default router;