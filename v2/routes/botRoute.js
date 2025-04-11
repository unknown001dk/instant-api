import express from 'express';
import botController from '../controllers/botController.js';

const router = express.Router();

router.post('/', botController.handleMessage);

export default router;