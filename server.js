require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");

const PORT = process.env.PORT || 3000;
const mongodbURI = process.env.mongodbURI;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/tasks", taskRoutes);

mongoose
  .connect(mongodbURI)
  .then(() => console.log("connected to mongodb atlas"))
  .catch((err) => console.error(`error connecting mongodb ${err}`));

app.listen(PORT, () => {
  console.log(`app is listening to port ${PORT}`);
});
