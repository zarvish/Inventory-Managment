// app.js
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const connectToDB = require("./mongoConnection"); // Update the path if needed
const app = express();
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 3000;

//cors
app.use(cors());
// Middleware
app.use(express.json());

// Basic route
app.get("/health", (req, res) => {
  res.send("ok");
});

// Connect to MongoDB
connectToDB();
app.use("/auth", authRoutes);
app.use("/api", inventoryRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
