const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const expressValidator = require("express-validator");

const app = express();

//requiring routes
const authRoutes = require("./routes/auth");
const featureRoutes = require("./routes/feature");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");
const pageRoutes = require("./routes/page");

//app middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// app.use(expressValidator());

//routes middlewares
app.use("/api", authRoutes);
app.use("/api", featureRoutes);
app.use("/api", userRoutes);
app.use("/api", commentRoutes);
app.use("/api", pageRoutes);

const port = process.env.port || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("Db error", err);
  });
