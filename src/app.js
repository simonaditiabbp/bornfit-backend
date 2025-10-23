import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

dotenv.config();


const app = express();
app.use(express.json());

// Serve static files from uploads folder
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(cors({
  origin: 'http://localhost:3000', // atau pakai '*' untuk semua origin
  credentials: true, // jika kamu kirim cookie atau Authorization header
}));

// routes utama
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
