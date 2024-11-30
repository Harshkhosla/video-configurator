import express, { Request, Response } from 'express';
import { Video, IVideo, IAnnotation } from '../models/Video';
import { multerConfig } from '../utils/multerConfig';
import multer from 'multer';

const router = express.Router();




const upload = multer({ storage: multerConfig });
// @ts-ignore
router.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
    try {
        console.log(req.body.annotations,"sdvlkljvdnkjvdnsjkvnsdjk");
        
      if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded.' });
      }


      const annotations = JSON.parse(req.body.annotations);
    //   const { annotations } = req.body;
  
      const newVideo: IVideo = new Video({
        fileUrl: `/uploads/videos/${req.file.filename}`,
        annotations: (annotations || '[]'), 
          });
  
      await newVideo.save();
  
      res.status(201).json({ message: 'Video uploaded successfully!', video: newVideo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload video.' });
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







const VideoRouter = router;
export default VideoRouter;
