const { setupRoutes } = require("./routes");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(express.json());

setupRoutes(app);

module.exports = app;
