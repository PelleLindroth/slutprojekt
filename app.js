const express = require("express");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(fileUpload());

app.use("/api/v1", userRoutes, taskRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
