// Models
import Lesson, { LessonType } from "../models/Lesson.js";

// Slugify
import slugify from "slugify";

// Server response
import serverResponse from "../utils/helpers/responses.js";

// Messages
import messages from "../configs/messagesConfig.js";
import CommentService from "./CommentService.js";
import LessonProgress from "../models/LessonProgress.js";

// Types
type LessonCreateInput = Pick<
  LessonType,
  "title" | "description" | "courseId" | "duration" | "orderIndex" | "videoUrl"
> & {
  isFree?: boolean;
};

const LessonService = {
  getAllLessons: async function () {
    const lessons = await Lesson.find()
      .populate({
        path: "course",
      })
      .sort({ createdAt: -1 });
    return lessons;
  },
  getAllLessonsByCourseId: async function (courseId: string, userId?: string) {
    const lessons = await Lesson.find({ courseId })
      .populate({
        path: "course comments",
      })
      .sort({ orderIndex: 1 })
      .lean();

    for await (const lesson of lessons) {
      const comments = await CommentService.getAllCommentsByLessonId(
        lesson._id.toString()
      );
      if (userId) {
        (lesson as any).progress = await LessonProgress.find({
          lessonId: lesson._id,
          userId: userId,
        });
      }
      (lesson as any).comments = comments;
    }

    return lessons;
  },
  getLessonById: async function (id: string) {
    try {
      const lesson = await Lesson.findById(id).populate({
        path: "course",
      });
      if (!lesson) {
        throw serverResponse.createError({
          ...messages.NOT_FOUND,
          message: "Không tìm thấy bài học",
        });
      }
      return lesson;
    } catch (error) {
      // Handle error if id is not a valid ObjectId
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: "Không tìm thấy bài học",
      });
    }
  },
  createLesson: async function (data: LessonCreateInput) {
    const existedLesson = await Lesson.findOne({
      title: data.title,
      courseId: data.courseId,
    });

    if (existedLesson) {
      throw serverResponse.createError({
        ...messages.ALREADY_EXISTS,
        message: "Bài học đã tồn tại",
      });
    }

    if (data.isFree === undefined) {
      data.isFree = false;
    }

    const lesson = await Lesson.create(data);

    return lesson;
  },
  deleteLessonById: async function (id: string) {
    try {
      await Lesson.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: "Không tìm thấy bài học",
      });
    }
  },
  updateLessonById: async function (id: string, data: LessonCreateInput) {
    const lesson = await this.getLessonById(id);

    // Kiểm tra lesson đã tồn tại hay chưa (trừ lesson hiện tại _id: $ne: id)
    const existedLesson = await Lesson.findOne({
      title: data.title,
      _id: { $ne: id },
      courseId: data.courseId,
    });

    if (existedLesson) {
      throw serverResponse.createError({
        ...messages.ALREADY_EXISTS,
        message: "Bài học đã tồn tại",
      });
    }

    lesson.title = data.title;
    lesson.description = data.description;
    lesson.courseId = data.courseId;
    lesson.orderIndex = data.orderIndex;
    lesson.videoUrl = data.videoUrl;
    lesson.duration = data.duration;

    if (data.isFree) lesson.isFree = data.isFree;

    await lesson.save();

    return lesson;
  },
};

export default LessonService;
