import { getCourseById } from "@/services/courseService";
import { LoaderFunctionArgs } from "react-router-dom";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const res = await getCourseById(params.courseId as string);
  return res?.data ? res.data : null;
};
