import axios from "@/configs/axiosConfig";
import { Course, Lesson, Note, Review } from "@/types";

export interface CourseDetails {
  course: Course;
  reviews: Review[];
  lessons: Lesson[];
  notes: Note[];
}

export const get20PopularCourses = async () => {
  try {
    const response = await axios.get("courses/popular");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const get20NewestCourses = async () => {
  try {
    const response = await axios.get("courses/newest");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCourseById = async (courseId: string) => {
  try {
    const response = await axios.get(`courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCourseBySlug = async (courseSlug: string) => {
  try {
    const response = await axios.get(`learning/${courseSlug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course by slug:", error);
  }
};

export const getCoursesByQuery = async (query: string) => {
  try {
    const response = await axios.get(`courses/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by query:", error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [] as any;
  }
};

export const getCoursesByCategoryId = async (categoryId: string) => {
  try {
    const response = await axios.get(`courses/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by category ID:", error);
    return [];
  }
};
