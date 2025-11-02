require("dotenv").config();
const express = require("express");
const cors = require("cors");
const public_routes = require("./src/routes/public_routes");
const admin_routes = require("./src/routes/admin_routes");
const user_routes = require("./src/routes/user_routes");
const staff_routes = require("./src/routes/staff_routes");
const db_connection = require("./src/config/Db_connect");

const app = express();

app.use(cors());
app.use(express.json());

db_connection();

// --------------------------- PUBLIC ENDPOINTS --------------------------------------------------

// Health Check
app.get("/healthy", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api", public_routes);

// --------------------------- ADMIN ONLY --------------------------------------------------

app.use("/api", admin_routes);

// // ------------------------ STAFF ENDPOINTS -----------------------------------------

app.use("/api", staff_routes);

// --------------------------- USERS ONLY --------------------------------------------------

app.use("/api", user_routes);

// -----------------------------------------------------------------------------------------

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}/`);
});
