import { Server } from "socket.io";
import http from "http";
import { config } from "dotenv";
import { ISocket } from "./socket-io.interface.js";
import NotificationService from "../services/NotificationService.js";
import UserService from "../services/UserService.js";
import { NotificationType } from "../models/Notification.js";
config();

let io: Server;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", async (socket: ISocket) => {
    socket.on("register", async (email: string) => {
      const user = await UserService.getUserByEmailWithoutPasswordHash(email);
      const notifications =
        await NotificationService.getAllNotificationsByUserId(
          user?._id?.toString() || ""
        );
      socket.join(email);
      socket.emit("notifications", notifications);
    });
  });
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
}

export function sendNotification(
  email: string,
  notification: NotificationType
) {
  const io = getIO();
  io.to(email).emit("new_notification", notification);
}
