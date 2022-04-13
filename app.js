const { setupRoutes } = require('./routes');
const express = require("express");
require("dotenv").config();
// const cors = require("cors");


const app = express();


// app.use(cors({ credentials: true}));
app.use(express.json());

// routes
setupRoutes(app);

// Please keep this module.exports app, we need it for the tests !
module.exports = app;