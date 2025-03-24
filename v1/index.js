import express from "express";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import connectDB, { connectLocalToMongoDB, connectToMongoDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import schemaRouter from "./routes/schemaRoute.js";
import MongoUriRouter from "./routes/modalRoute.js";
import dynamicRouter from "./routes/dynamicRoute.js";
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();
const app = express();

// Middleware
app.use(cors());

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/schema", schemaRouter);
app.use("/api/v1/mongouri", MongoUriRouter);
app.use("/api/v1/dynamic", dynamicRouter); // Dynamic schema with userId, schemaName, and optionally document ID


// middlewares
app.use(notFound);
app.use(errorHandler);

// Database configuration
// connectLocalToMongoDB();
connectDB();

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});