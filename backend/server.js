import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwtMiddleware from './lib/jwtMiddleware.js';
import dotenv from 'dotenv';
import postsRouter from './router/posts.js';
import authRouter from './router/auth.js';
import footballRouter from './router/football.js';
dotenv.config();

// const postsRouter = require('./router/posts');
// const authRouter = require('./router/auth');
// const footballRouter = require('./router/football');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(jwtMiddleware);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.use('/posts', postsRouter);
app.use('/auth', authRouter);
app.use('/football', footballRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
