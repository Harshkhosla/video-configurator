import express from 'express';
import { uploadVideo, getVideos } from '../controllers/videoController';

const router = express.Router();
//@ts-ignore
router.post('/upload', uploadVideo);

router.get('/', getVideos);

export default router;
