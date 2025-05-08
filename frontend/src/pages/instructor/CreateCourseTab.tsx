import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CourseForm from "./CourseFormProps";
import { Category, Course } from "@/types";

interface CreateCourseTabProps {
  categories: Category[];
  levels: Course["level"];
}

export default function CreateCourseTab({
  categories,
  levels,
}: CreateCourseTabProps) {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, mb: 6 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1a237e",
          mb: 4,
          textTransform: "uppercase",
          letterSpacing: "2px",
          background: "default",
          py: 2,
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        Tạo Khóa Học Mới
      </Typography>
      <CourseForm
        categories={categories}
        levels={levels}
        courseToEdit={undefined}
        onBack={undefined}
      />
    </Box>
  );
}
