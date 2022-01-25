const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cors = require('cors')
//Connect to DB
connectDB();

app.use(cors())
//bodyparser
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

//defire routes
app.use("/api/users", require("./ModulesAndRoutes/routes/users"));
app.use("/api/auth", require("./ModulesAndRoutes/routes/authRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
