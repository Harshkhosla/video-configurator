import express from 'express';
import cors from 'cors';

import { ConnectToMongo } from "./db/db";
import VideoRouter from './routes/videoRoutes';
const app = express();
ConnectToMongo()
app.use(cors());
app.use(express.json()); 

app.use('/api',VideoRouter ); 
app.get('/', (req, res) => {
  res.send('Video Configurator Backend Running');
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
