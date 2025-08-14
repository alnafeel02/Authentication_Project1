import express from 'express';
const app = express();
import dot from 'dotenv';
import bodyParser from 'body-parser';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
dot.config(); // Load environment variables from .env file

connectDB();

const allowedOrigins = ['http://localhost:5173']

app.use(express.json() );  
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json() );  
app.use(bodyParser.urlencoded({ extended: true }) );
app.use(cors({origin:allowedOrigins,credentials: true}));
app.use(cookieParser()); // Middleware to parse cookies


app.use('/api/auth', authRouter);
app.use("/api/user", userRouter);
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
})


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});