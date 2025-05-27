const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
require("express-async-errors");

const userRoutes = require("./routers/userRoutes");
const postRoutes = require("./routers/posts");
const errorMiddleware = require("./middlewares/errorMiddleware");
const limiter = require("./utils/rateLimiter");
dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(limiter);

app.use("/users", userRoutes);
app.use("/posts", postRoutes);


const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
  mongoose
    .connect(DB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
});
