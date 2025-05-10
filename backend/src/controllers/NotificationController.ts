// Types
import type { NextFunction, Request, Response } from "express";
import type { RequestWithUser } from "../middlewares/authMiddleware.js";

// Services
import NotificationService from "../services/NotificationService.js";
import UserService from "../services/UserService.js";

// Messages
import messages from "../configs/messagesConfig.js";

// Server response
import serverResponse from "../utils/helpers/responses.js";

const NotificationController = {
  getAllNotificationsByUserId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as RequestWithUser).user;

      const existedUser = await UserService.getUserByEmailWithoutPasswordHash(
        user.email
      );

      if (!existedUser) {
        throw serverResponse.createError({
          ...messages.NOT_FOUND,
          message: "Người dùng không tồn tại",
        });
      }

      const notifications =
        await NotificationService.getAllNotificationsByUserId(
          existedUser._id.toString()
        );

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: "Lấy danh sách thông báo thành công",
          },
          notifications
        )
      );
    } catch (error) {
      next(error);
    }
  },
  createNotification: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as RequestWithUser).user;
      const { title, message, referenceUrl } = req.body;

      const existedUser = await UserService.getUserByEmailWithoutPasswordHash(
        user.email
      );

      if (!existedUser) {
        throw serverResponse.createError({
          ...messages.NOT_FOUND,
          message: "Người dùng không tồn tại",
        });
      }

      const review = await NotificationService.createNotification({
        userId: existedUser._id,
        title,
        message,
        referenceUrl,
        to: "user",
      });

      res.status(messages.CREATED.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.CREATED,
            message: "Tạo thông báo thành công",
          },
          review
        )
      );
    } catch (error) {
      next(error);
    }
  },
  deleteNotificationByIdAndUserId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as RequestWithUser).user;
      const { id } = req.params;

      const existedUser = await UserService.getUserByEmailWithoutPasswordHash(
        user.email
      );

      if (!existedUser) {
        throw serverResponse.createError({
          ...messages.NOT_FOUND,
          message: "Người dùng không tồn tại",
        });
      }

      await NotificationService.deleteNotificationByIdAndUserId(
        id,
        existedUser._id.toString()
      );

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess({
          ...messages.OK,
          message: "Xóa thông báo thành công",
        })
      );
    } catch (error) {
      next(error);
    }
  },
  updateNotificationByIdAndUserId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as RequestWithUser).user;

      const { id } = req.params;
      const { title, message, referenceUrl } = req.body;

      const existedUser = await UserService.getUserByEmailWithoutPasswordHash(
        user.email
      );

      if (!existedUser) {
        throw serverResponse.createError({
          ...messages.NOT_FOUND,
          message: "Người dùng không tồn tại",
        });
      }

      const notification =
        await NotificationService.updateNotificationByIdAndUserId(id, {
          userId: existedUser._id,
          title,
          message,
          referenceUrl,
          to: "user",
        });

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: "Cập nhật thông báo thành công",
          },
          notification
        )
      );
    } catch (error) {
      next(error);
    }
  },
};

export default NotificationController;
