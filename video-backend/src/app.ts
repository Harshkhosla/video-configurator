import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('Video Configurator Backend Running');
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
