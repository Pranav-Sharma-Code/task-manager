import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
connectDB();

//     middleware
app.use(cors());
app.use(express.json());

//    ROutes
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.send("server running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Running on Server port ${PORT}`)
});