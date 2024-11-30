import { Request, Response } from 'express';
import { videoUpload } from '../services/videoService';

export const uploadVideo = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  return res.status(200).json({
    message: 'Video uploaded successfully!',
    file: req.file,
  });
};

export const getVideos = (req: Request, res: Response) => {
  // Fetch video metadata or a list of uploaded videos
  res.status(200).json({ message: 'Fetch video metadata here' });
};
