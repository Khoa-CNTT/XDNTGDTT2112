// Models
import Notification, { NotificationType } from "../models/Notification.js";

// Server response
import serverResponse from "../utils/helpers/responses.js";

// Messages
import messages from "../configs/messagesConfig.js";

// Service
import UserService from "./UserService.js";

// Types
type CreateNotificationInput = Pick<
  NotificationType,
  "userId" | "title" | "message" | "referenceUrl" | "to"
>;

const NotificationService = {
  getAllNotificationsByUserId: async function (userId: string) {
    try {
      const notifications = await Notification.find({
        userId: userId,
      })
        .populate({
          path: "user",
        })
        .sort({ rating: -1 });
      return notifications;
    } catch (error) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: "Không tìm thấy danh sách thông báo",
      });
    }
  },
  createNotification: async function (data: CreateNotificationInput) {
    const notification = await Notification.create(data);
    return notification;
  },
  deleteNotificationByIdAndUserId: async function (id: string, userId: string) {
    try {
      const existedUser = await UserService.getUserById(userId);

      if (existedUser.role === "admin") {
        const result = await Notification.findByIdAndDelete(id);

        if (!result) {
          throw serverResponse.createError({
            ...messages.NOT_FOUND,
            message: "Không tìm thấy thông báo",
          });
        }

        return true;
      }

      const result = await Notification.findOneAndDelete({
        _id: id,
        userId: userId,
      });

      if (!result) {
        throw serverResponse.createError({
          ...messages.NOT_FOUND,
          message: "Không tìm thấy thông báo",
        });
      }

      return true;
    } catch (error) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: "Không tìm thấy thông báo",
      });
    }
  },
  updateNotificationByIdAndUserId: async function (
    id: string,
    data: CreateNotificationInput
  ) {
    const existedNotification = await Notification.findOne({
      _id: id,
      userId: data.userId,
    });

    if (!existedNotification) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: "Không tìm thấy thông báo",
      });
    }

    Object.assign(existedNotification, data);
    const notification = await existedNotification.save();
    return notification;
  },
};

export default NotificationService;
