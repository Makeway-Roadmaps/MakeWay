const express = require("express");
const app = express();
require("dotenv").config();
const Database = require("./config/DataBase");
const AuthRoutes = require("./routes/Auth/Authentication.routes");
const bodyParser = require("body-parser");

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(bodyParser.json());

// connection to database
Database.connectDb();

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// routes activation

app.use("/api/v1", AuthRoutes);

// port activation
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server is running on \x1b]8;;${url}\x1b\\${url}\x1b]8;;\x1b\\`);
});
