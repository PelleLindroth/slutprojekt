const express = require("express");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
// const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require('./middleware/errorHandler')
const Logger = require('./middleware/logger')
const PORT = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use(Logger)

app.use("/api/v1", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
