import CourseSection from "@/components/common/CourseSection";
import { Box } from "@mui/material";
import React from "react";
import { useAppSelector } from "@/hooks/useStore";
import { enrollmentsSelector } from "@/features/account";

const MyLearning: React.FC = () => {
  const enrollments = useAppSelector(enrollmentsSelector);
  const courses = enrollments.map((enrollment) => enrollment?.course[0]);

  return (
    <Box mt={"128px"}>
      {courses.length > 0 && (
        <CourseSection title="Khóa học đã mua" courses={courses} />
      )}
      {courses.length === 0 && (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
          }}
        >
          Bạn chưa có khóa học nào.
        </Box>
      )}
    </Box>
  );
};

export default MyLearning;
