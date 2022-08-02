const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const postsRouter = require("./router/posts");
const authRouter = require("./router/auth");

app.use("/posts", postsRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
