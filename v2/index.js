import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import { createClient } from "redis";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import schemaRouter from "./routes/schemaRoute.js";
import MongoUriRouter from "./routes/modalRoute.js";
import dynamicRouter from "./routes/dynamicRoute.js";
import botRouter from "./routes/botRoute.js";
import logRouter from "./routes/logRoute.js";

dotenv.config();
const app = express();

// const redisClient = createClient({
//   url: process.env.REDIS_URL || "redis://localhost:6379",
// });

// redisClient.on("error", (err) => console.error("Redis Client Error", err));
// redisClient.on("ready", () => console.log("Redis Client Connected"));
// redisClient.connect().catch(console.error);

// Create HTTP server for socket.io
const httpServer = createServer(app);

// Initialize Socket.IO
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*", // you can restrict this to specific frontend URL
//     methods: ["GET", "POST"],
//   },
// });

// Store io instance in app so we can pass it to route handlers
// app.set("io", io);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(compression()); 

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/schema", schemaRouter);
app.use("/api/v1/mongouri", MongoUriRouter);
app.use("/api/v1/dynamic", (req, res, next) => {
  // req.redisClient = redisClient;
  // req.io = io;
  next();
}, dynamicRouter);
app.use("/api/v1/bot", botRouter);
app.use("/api/v1/log", logRouter);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Database Connection
connectDB();

// Socket.IO Listeners
// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//     console.log(`Socket ${socket.id} joined room ${roomId}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// Start Server
const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

