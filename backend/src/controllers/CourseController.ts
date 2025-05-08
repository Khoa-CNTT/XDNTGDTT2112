// Types
import type { NextFunction, Request, Response } from "express";

// Services
import CourseService from "../services/CourseService.js";
import ReviewService from "../services/ReviewService.js";
import LessonService from "../services/LessonService.js";

// Messages
import messages from "../configs/messagesConfig.js";

// Server response
import serverResponse from "../utils/helpers/responses.js";
import NoteService from "../services/NoteService.js";
import { RequestWithUser } from "../middlewares/authMiddleware.js";
import UserService from "../services/UserService.js";

const CourseController = {
  get20PopularCourses: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const courses = await CourseService.get20PopularCourses();

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: "Lấy khoá học phổ biến thành công",
          },
          courses
        )
      );
    } catch (error) {
      next(error);
    }
  },
  get20NewestCourses: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const courses = await CourseService.get20NewestCourses();

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: "Lấy khoá học mới nhất thành công",
          },
          courses
        )
      );
    } catch (error) {
      next(error);
    }
  },
  getAllCourses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseService.getAllCourses();

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: "Get all courses successfully",
          },
          courses
        )
      );
    } catch (error) {
      next(error);
    }
  },
  getCourseById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const course = await CourseService.getCourseById(id);
      const reviews = await ReviewService.getAllReviewsByCourseId(id);
      const lessons = await LessonService.getAllLessonsByCourseId(id);

      console.log(course);
      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: "Lấy khoá học thành công",
          },
          {
            course: course,
            reviews: reviews,
            lessons: lessons,
          }
        )
      );
    } catch (error) {
      next(error);
    }
  },
  getCourseBySlug: async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    try {
      const { slug } = req.params;

      const existedUser = await UserService.getUserByEmailWithPasswordHash(
        user.email
      );

      if (!existedUser) {
        res.status(messages.UNAUTHORIZED.statusCode).json(
          serverResponse.createError({
            ...messages.UNAUTHORIZED,
            message: "Người dùng không tồn tại",
          })
        );
        return;
      }

      const course = await CourseService.getCourseBySlug(slug);
      const reviews = await ReviewService.getAllReviewsByCourseId(course._id);
      const lessons = await LessonService.getAllLessonsByCourseId(
        course._id,
        existedUser._id.toString()
      );
      const notes = await NoteService.getAllNotesByCourseIdAndUserId(
        course._id,
        existedUser._id.toString()
      );

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: "Lấy khoá học thành công",
          },
          {
            course: course,
            reviews: reviews,
            lessons: lessons,
            notes: notes,
          }
        )
      );
    } catch (error) {
      next(error);
    }
  },
  createCourse: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        title,
        description,
        price,
        thumbnail,
        instructorId,
        categoryId,
        level,
        duration,
        requirements,
        whatYouWillLearn,
      } = req.body;

      const course = await CourseService.createCourse({
        title,
        description,
        price,
        thumbnail,
        instructorId,
        categoryId,
        level,
        duration,
        requirements,
        whatYouWillLearn,
      });

      res.status(messages.CREATED.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.CREATED,
            message: "Khoá học đã được tạo thành công",
          },
          course
        )
      );
    } catch (error) {
      next(error);
    }
  },
  deleteCourseById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await CourseService.deleteCourseById(id);

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: "Khoá học đã được xoá thành công",
          },
          null
        )
      );
    } catch (error) {
      next(error);
    }
  },
  updateCourseById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        price,
        discountPrice,
        thumbnail,
        instructorId,
        categoryId,
        level,
        duration,
        requirements,
        whatYouWillLearn,
        isPublished,
      } = req.body;

      const course = await CourseService.updateCourseById(id, {
        title,
        description,
        price,
        discountPrice,
        thumbnail,
        instructorId,
        categoryId,
        level,
        duration,
        requirements,
        whatYouWillLearn,
        isPublished,
      });

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: "Khoá học đã được cập nhật thành công",
          },
          course
        )
      );
    } catch (error) {
      next(error);
    }
  },
  findCoursesByQuery: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { query } = req.query;

      const courses = await CourseService.findCoursesByQuery(query as string);

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: "Tìm kiếm khoá học thành công",
          },
          courses
        )
      );
    } catch (error) {
      next(error);
    }
  },
  getCoursesByCategoryIds: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const courses = await CourseService.getCoursesByCategoryIds(id);

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: "Lấy khoá học theo danh mục thành công",
          },
          courses
        )
      );
    } catch (error) {
      next(error);
    }
  },
};

export default CourseController;
