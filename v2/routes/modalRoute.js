import express from 'express';
import ModalController from '../controllers/mongo.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, ModalController.createURIs);
router.get('/getURIs', authMiddleware, ModalController.getURIs);

export default router;
