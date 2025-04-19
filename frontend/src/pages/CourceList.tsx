import { Grid, Card, CardMedia, CardContent, Typography, Container, Pagination, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Dữ liệu giả lập (có thể thay bằng API)
const courses = [
  { id: 1, title: 'Website Dev Zero to Hero', image: 'https://about.udemy.com/wp-content/themes/wp-about-v4/assets/images/fallbackimage.jpg', description: 'Ngược mới bắt đầu lập trình Java', author: 'VA Studio', category: 'Chưa Bắt Đầu' },
  { id: 2, title: 'Mobile Dev React Native', image: 'https://about.udemy.com/wp-content/themes/wp-about-v4/assets/images/fallbackimage.jpg', description: 'iOS 12 & Swift 5 - Hoàn thành iOS...', author: 'VA Studio', category: 'Chưa Bắt Đầu' },
  { id: 3, title: 'Make Uber Clone App', image: 'https://about.udemy.com/wp-content/themes/wp-about-v4/assets/images/fallbackimage.jpg', description: 'Khóa học WordPress Trung cấp', author: 'VA Studio', category: 'Chưa Bắt Đầu' },
  { id: 4, title: 'Vue Javascript Course', image: 'https://about.udemy.com/wp-content/themes/wp-about-v4/assets/images/fallbackimage.jpg', description: 'Khóa học WordPress Trung cấp', author: 'VA Studio', category: 'Chưa Bắt Đầu' },
  // Thêm các khóa học khác nếu cần
];

const CourseList = () => {
  const navigate = useNavigate();

  const handleCourseClick = (id) => {
    navigate(`/course/${id}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Tiêu đề chính */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
        Khóa học của bạn
      </Typography>

      {/* Mô tả phụ */}
      <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary', textAlign: 'center' }}>
        Danh sách các khóa học của bạn
      </Typography>

      {/* Grid hiển thị danh sách khóa học */}
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={3} key={course.id}>
            <Card
              onClick={() => handleCourseClick(course.id)}
              sx={{
                cursor: 'pointer',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
              }}
            >
              {/* Hình ảnh khóa học */}
              <CardMedia
                component="img"
                height="140"
                image={course.image}
                alt={course.title}
                sx={{
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3,
                  objectFit: 'cover',
                }}
              />
              
              {/* Nội dung khóa học */}
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  {course.description}
                </Typography>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {course.author} • {course.category}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={5} color="primary" />
      </Box>
    </Container>
  );
};

export default CourseList;
