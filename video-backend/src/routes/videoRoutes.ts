import express, { Request, Response } from 'express';
import { Video, IVideo, IAnnotation } from '../models/Video';
import { multerConfig } from '../utils/multerConfig';
import multer from 'multer';

const router = express.Router();




const upload = multer({ storage: multerConfig });
// @ts-ignore
router.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const newVideo = new Video({
            fileUrl: req.file.path, 
            annotations: [] 
        });

        await newVideo.save();  
        res.status(200).json({ message: 'Video uploaded successfully', video: newVideo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading video' });
    }
});



router.get('/videos', async (req: Request, res: Response) => {
    try {
        const videos: IVideo[] = await Video.find();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching videos', error });
    }
});
// @ts-ignore
router.put('/annotation/:videoId/:annotationId', async (req: Request, res: Response) => {
    try {
        const { videoId, annotationId } = req.params;
        const { answered } = req.body; 

        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        // @ts-ignore
        const annotation = video.annotations.id(annotationId);
        if (!annotation) return res.status(404).json({ message: 'Annotation not found' });

        annotation.answered = answered;
        await video.save();

        res.status(200).json({ message: 'Annotation updated successfully', annotation });
    } catch (error) {
        res.status(500).json({ message: 'Error updating annotation', error });
    }
});
const VideoRouter = router;
export default VideoRouter;
