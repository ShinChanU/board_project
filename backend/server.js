import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwtMiddleware from './lib/jwtMiddleware.js';
import excelPostsRouter from './router/excelPosts.js';
import authRouter from './router/auth.js';
require('dotenv').config();

const { ATLAS_URI } = process.env;

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

mongoose.connect(ATLAS_URI);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.use('/posts', excelPostsRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
