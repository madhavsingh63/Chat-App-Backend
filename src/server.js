import express from "express";
import env from "dotenv";
import DBConnect from "./config/database.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";

const app = express();
// Load environment variables from .env file
env.config();
// Connect to the database
DBConnect();

// Set the port from environment variables or default to 5001
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON requests
// This is necessary to handle JSON data sent in requests
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Baat Chit m apka shuagat hai</h1>");
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
