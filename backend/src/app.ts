// Importing packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

// Importing db
import db from "./db/index.js";
import redisClient from "./db/redisClient.js";

// Import middlewares
import {
  defaultError,
  notFoundError,
} from "./middlewares/errorHandlingMiddleware.js";

// Routes
import AuthRoutes from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import CloudinaryRoutes from "./routes/CloudinaryRoutes.js";
import CategoryRoutes from "./routes/CategoryRoutes.js";
import CourseRoutes from "./routes/CourseRoutes.js";
import LessonRoutes from "./routes/LessonRoutes.js";
import CartRoutes from "./routes/CartRoutes.js";
import LessonProgressRoutes from "./routes/LessonProgressRoutes.js";
import NoteRoutes from "./routes/NoteRoutes.js";
import ReviewRoutes from "./routes/ReviewRoutes.js";
import CommentRoutes from "./routes/CommentRoutes.js";
import VNPayRoutes from "./routes/VNPayRoutes.js";
import NotificationRoutes from "./routes/NotificationRoutes.js";
import AIRoutes from "./routes/AIRoutes.js";
import EnrollmentRoutes from "./routes/EnrollmentRoutes.js";
import PaymentRoutes from "./routes/PaymentRoutes.js";
import { initSocket } from "./socket/socket-io.js";

// Configuring dotenv
dotenv.config();

// Express app
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a http server from Express app
const server = http.createServer(app);

initSocket(server);

// Routes
app.use("/api", AuthRoutes);
app.use("/api", UserRoutes);
app.use("/api", CloudinaryRoutes);
app.use("/api", CategoryRoutes);
app.use("/api", CourseRoutes);
app.use("/api", LessonRoutes);
app.use("/api", CartRoutes);
app.use("/api", LessonProgressRoutes);
app.use("/api", NoteRoutes);
app.use("/api", ReviewRoutes);
app.use("/api", CommentRoutes);
app.use("/api", VNPayRoutes);
app.use("/api", NotificationRoutes);
app.use("/api", AIRoutes);
app.use("/api", EnrollmentRoutes);
app.use("/api", PaymentRoutes);

// Not found handler
app.use(notFoundError);

// Error handler
app.use(defaultError);

// Server
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Connect to database
    await db.connect();
    await redisClient.connect();
    server.listen(PORT, () => console.log(`Server on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
}

start();
