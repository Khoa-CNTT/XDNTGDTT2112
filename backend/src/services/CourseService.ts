// Models
import Course, { CourseType } from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Review from "../models/Review.js";

// Slugify
import slugify from "slugify";

// Server response
import serverResponse from "../utils/helpers/responses.js";

// Messages
import messages from "../configs/messagesConfig.js";

// Mongoose
import mongoose, { set } from "mongoose";
import CategoryService from "./CategoryService.js";

// Types
type CourseCreateInput = Pick<
  CourseType,
  | "title"
  | "description"
  | "price"
  | "thumbnail"
  | "instructorId"
  | "categoryId"
  | "level"
  | "duration"
  | "requirements"
  | "whatYouWillLearn"
> & {
  discountPrice?: number;
};

const CourseService = {
  get20PopularCourses: async function () {
    // Kiểm tra xem có enrollments nào không
    const hasEnrollments = await Enrollment.exists({});

    let courseIds;
    let courses;

    if (hasEnrollments) {
      // Tính số lượng đăng ký cho mỗi khóa học
      const courseEnrollments = await Enrollment.aggregate([
        {
          $group: {
            _id: "$courseId",
            enrollmentCount: { $sum: 1 },
          },
        },
        { $sort: { enrollmentCount: -1 } },
        { $limit: 20 },
      ]);

      // Lấy IDs của các khóa học phổ biến
      courseIds = courseEnrollments.map((item) => item._id);

      // Query các khóa học theo IDs
      courses = await Course.find({
        _id: { $in: courseIds },
        isPublished: true,
      }).populate("instructor category");

      // Thêm số lượng đăng ký vào mỗi khóa học
      courses = courses.map((course: any) => {
        const enrollment = courseEnrollments.find(
          (e) => e._id.toString() === course._id.toString()
        );

        course = course.toObject(); // Chuyển Mongoose document thành JavaScript object
        course.enrollmentCount = enrollment ? enrollment.enrollmentCount : 0;

        return course;
      });
    } else {
      // Lấy 20 khóa học mới nhất nếu không có đăng ký
      courses = await Course.find({
        isPublished: true,
      })
        .populate("instructor category")
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      // Thêm enrollmentCount = 0 cho mỗi khóa học
      courses = courses.map((course: any) => {
        course.enrollmentCount = 0;
        return course;
      });

      courseIds = courses.map((course) => course._id);
    }

    // Tính rating trung bình cho mỗi khóa học
    const courseRatings = await Review.aggregate([
      {
        $match: { courseId: { $in: courseIds } },
      },
      {
        $group: {
          _id: "$courseId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    // Thêm thông tin rating vào mỗi khóa học
    courses = courses.map((course) => {
      const rating = courseRatings.find(
        (r) => r._id.toString() === course._id.toString()
      );

      course.averageRating = rating
        ? parseFloat(rating.averageRating.toFixed(1))
        : 0;
      course.reviewCount = rating ? rating.reviewCount : 0;

      return course;
    });

    // Sắp xếp lại nếu cần thiết (nếu có đăng ký)
    if (hasEnrollments) {
      courses.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
    }

    return courses;
  },
  get20NewestCourses: async function () {
    // Lấy 20 khóa học mới nhất nếu không có đăng ký
    let courses = await Course.find({
      isPublished: true,
    })
      .populate("instructor category")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const courseIds = courses.map((course) => course._id);

    // Tính rating trung bình cho mỗi khóa học
    const courseRatings = await Review.aggregate([
      {
        $match: { courseId: { $in: courseIds } },
      },
      {
        $group: {
          _id: "$courseId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    // Tính số lượng đăng ký cho mỗi khóa học
    const courseEnrollments = await Enrollment.aggregate([
      {
        $group: {
          _id: "$courseId",
          enrollmentCount: { $sum: 1 },
        },
      },
      { $sort: { enrollmentCount: -1 } },
      { $limit: 20 },
    ]);

    // Thêm thông tin rating vào mỗi khóa học
    courses = courses.map((course: any) => {
      const rating = courseRatings.find(
        (r) => r._id.toString() === course._id.toString()
      );

      const enrollment = courseEnrollments.find(
        (e) => e._id.toString() === course._id.toString()
      );

      course.averageRating = rating
        ? parseFloat(rating.averageRating.toFixed(1))
        : 0;
      course.reviewCount = rating ? rating.reviewCount : 0;
      course.enrollmentCount = enrollment ? enrollment.enrollmentCount : 0;

      return course;
    });

    return courses;
  },
  getAllCourses: async function () {
    const courses = await Course.find()
      .populate({
        path: "category instructor",
      })
      .sort({ createdAt: -1 });
    return courses;
  },
  getCourseById: async function (id: string) {
    try {
      let course: any = await Course.findById(id).populate({
        path: "category instructor",
      });

      if (!course) {
        throw serverResponse.createError({
          ...messages.NOT_FOUND,
          message: "Không tìm thấy khoá học",
        });
      }

      const courseIds = [course?._id];

      // Tính rating trung bình cho mỗi khóa học
      const courseRatings = await Review.aggregate([
        {
          $match: { courseId: { $in: courseIds } },
        },
        {
          $group: {
            _id: "$courseId",
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]);

      // Thêm thông tin rating vào mỗi khóa học
      const rating = courseRatings.find(
        (r) => r._id.toString() === course._id.toString()
      );

      course = course.toObject();

      course.averageRating = rating
        ? parseFloat(rating.averageRating.toFixed(1))
        : 0;

      course.reviewCount = rating ? rating.reviewCount : 0;

      return course;
    } catch (error) {
      // Handle error if id is not a valid ObjectId
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: "Không tìm thấy khoá học",
      });
    }
  },
  getCourseBySlug: async function (slug: string) {
    try {
      let course: any = await Course.findOne({
        slug: { $regex: new RegExp(slug, "i") },
        isPublished: true,
      }).populate({
        path: "category instructor",
      });

      if (!course) {
        throw serverResponse.createError({
          ...messages.NOT_FOUND,
          message: "Không tìm thấy khoá học",
        });
      }

      const courseIds = [course?._id];

      // Tính rating trung bình cho mỗi khóa học
      const courseRatings = await Review.aggregate([
        {
          $match: { courseId: { $in: courseIds } },
        },
        {
          $group: {
            _id: "$courseId",
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]);

      // Thêm thông tin rating vào mỗi khóa học
      const rating = courseRatings.find(
        (r) => r._id.toString() === course._id.toString()
      );

      course = course.toObject();

      course.averageRating = rating
        ? parseFloat(rating.averageRating.toFixed(1))
        : 0;

      course.reviewCount = rating ? rating.reviewCount : 0;

      return course;
    } catch (error) {
      // Handle error if id is not a valid ObjectId
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: "Không tìm thấy khoá học",
      });
    }
  },
  createCourse: async function (data: CourseCreateInput) {
    const existedCourse = await Course.findOne({
      title: data.title,
    });

    if (existedCourse) {
      throw serverResponse.createError({
        ...messages.ALREADY_EXISTS,
        message: "Khoá học đã tồn tại",
      });
    }

    const slug =
      "/" +
      (slugify as any)(data.title, {
        lower: true,
        locale: "vi",
      });

    const course = await Course.create({ ...data, slug });

    return course;
  },
  deleteCourseById: async function (id: string) {
    try {
      await Course.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: "Không tìm thấy khoá học",
      });
    }
  },
  updateCourseById: async function (
    id: string,
    data: CourseCreateInput & { isPublished?: boolean }
  ) {
    const course = await Course.findById(id);

    if (!course) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: "Không tìm thấy khoá học",
      });
    }

    // Kiểm tra course đã tồn tại hay chưa (trừ course hiện tại _id: $ne: id)
    const existedCourse = await Course.findOne({
      title: data.title,
      _id: { $ne: id },
    });

    if (existedCourse) {
      throw serverResponse.createError({
        ...messages.ALREADY_EXISTS,
        message: "Khoá học đã tồn tại",
      });
    }

    const slug =
      "/" +
      (slugify as any)(data.title, {
        lower: true,
        locale: "vi",
      });

    course.title = data.title;
    course.description = data.description;
    course.price = data.price;
    if (data.discountPrice !== undefined)
      course.discountPrice = data.discountPrice;
    course.thumbnail = data.thumbnail;
    course.instructorId = data.instructorId;
    course.categoryId = data.categoryId;
    course.level = data.level;
    course.duration = data.duration;
    course.requirements = data.requirements;
    course.whatYouWillLearn = data.whatYouWillLearn;
    course.slug = slug;
    if (data.isPublished !== undefined) course.isPublished = data.isPublished;

    await course.save();

    return course;
  },
  findCoursesByQuery: async function (query: string) {
    let courses = await Course.find({
      title: { $regex: query, $options: "i" },
      isPublished: true,
    })
      .populate("instructor category")
      .sort({ createdAt: -1 })
      .lean();

    const courseIds = courses.map((course) => course._id);

    // Tính rating trung bình cho mỗi khóa học
    const courseRatings = await Review.aggregate([
      {
        $match: { courseId: { $in: courseIds } },
      },
      {
        $group: {
          _id: "$courseId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    // Thêm thông tin rating vào mỗi khóa học
    courses = courses.map((course: any) => {
      const rating = courseRatings.find(
        (r) => r._id.toString() === course._id.toString()
      );

      course.averageRating = rating
        ? parseFloat(rating.averageRating.toFixed(1))
        : 0;

      course.reviewCount = rating ? rating.reviewCount : 0;

      return course;
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(courses);
      }, 1000);
    });

    return courses;
  },
  getCoursesByCategoryIds: async function (categoryId: string) {
    const category = await CategoryService.getCategoryById(categoryId);

    if (!category) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: "Không tìm thấy danh mục",
      });
    }

    const categoryIds =
      (category as any)?.children?.map((child: any) => child._id) || [];

    categoryIds.push(categoryId);
    if (category.parentId) categoryIds.push(category.parentId);

    let courses = await Course.find({
      categoryId: { $in: categoryIds },
      isPublished: true,
    })
      .populate("instructor category")
      .sort({ createdAt: -1 })
      .lean();

    const courseIds = courses.map((course) => course._id);

    // Tính rating trung bình cho mỗi khóa học
    const courseRatings = await Review.aggregate([
      {
        $match: { courseId: { $in: courseIds } },
      },
      {
        $group: {
          _id: "$courseId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    // Thêm thông tin rating vào mỗi khóa học
    courses = courses.map((course: any) => {
      const rating = courseRatings.find(
        (r) => r._id.toString() === course._id.toString()
      );

      course.averageRating = rating
        ? parseFloat(rating.averageRating.toFixed(1))
        : 0;

      course.reviewCount = rating ? rating.reviewCount : 0;

      return course;
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(courses);
      }, 1000);
    });

    return courses;
  },
  getCoursesByInstructorId: async function (instructorId: string) {
    const courses = await Course.find({
      instructorId,
    }).populate("instructor category");

    return courses;
  },
};

export default CourseService;
