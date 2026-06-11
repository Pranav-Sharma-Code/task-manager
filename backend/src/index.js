import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js'; 

dotenv.config();

const app = express();
connectDB();

//     middleware
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());

//    ROutes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
    res.send("server running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Running on Server port ${PORT}`)
});