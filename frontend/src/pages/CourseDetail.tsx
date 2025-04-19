import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  TextField,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// Dữ liệu giả lập (có thể thay bằng API)
const courseDetails = {
  1: {
    title: 'Vue Javascript Course',
    image: 'https://about.udemy.com/wp-content/themes/wp-about-v4/assets/images/fallbackimage.jpg', // Thay bằng URL hình ảnh thực tế
    description: 'Khóa học Vue JS từ cơ bản đến nâng cao.',
    author: 'Kita Studio',
    category: 'Chưa Bắt Đầu',
    fullDescription:
      'Khóa học giúp bạn làm quen với Vue JS từ cơ bản đến nâng cao. Bạn sẽ học cách xây dựng các ứng dụng web động, quản lý trạng thái, và tích hợp với các API. Khóa học phù hợp cho cả người mới bắt đầu và người đã có kinh nghiệm.',
    chapters: [
      { title: 'Course Overview', duration: '5:00', status: 'Free' },
      { title: 'Curriculum', duration: '10:00', status: 'Free' },
      { title: 'Installation', duration: '15:00', status: 'Paid' },
      { title: 'Vue Basics', duration: '20:00', status: 'Paid' },
      { title: 'Components', duration: '25:00', status: 'Paid' },
    ],
    comments: [
      { user: 'Bình Luân', avatar: '', comment: 'LÊ pơ. MS tà khóa học này tầm ngần nào vậy ad? Cảm ơn nhiều.' },
      { user: 'Nguyễn Minh', avatar: '', comment: 'Khóa học rất tuyệt, mình đã học được rất nhiều từ đây!' },
      { user: 'Triệu', avatar: '', comment: 'Đỉnh cao kiến thức, rất đáng để học.' },
      { user: 'Ak', avatar: '', comment: 'I have finished the course, great job! I would like to have some feedback from the teacher.' },
    ],
  },
  2: {
    title: 'Mobile Dev React Native',
    image: 'https://via.placeholder.com/800x450',
    description: 'iOS 12 & Swift 5 - Hoàn thành iOS...',
    author: 'VA Studio',
    category: 'Chưa Bắt Đầu',
    fullDescription: 'Khóa học này sẽ hướng dẫn bạn xây dựng ứng dụng di động với React Native, từ cơ bản đến nâng cao.',
    chapters: [],
    comments: [],
  },
};

const CourseDetail = () => {
  const { id } = useParams();
  const course = courseDetails[id];

  if (!course) {
    return <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>Khóa học không tồn tại!</Typography>;
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#673ab7' }}>
        {course.title}
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 2 }}>
        by {course.author}
      </Typography>

      {/* Video Player */}
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3, position: 'relative' }}>
          <img
            src={course.image}
            alt={course.title}
            style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px' }}
          />
          <Box sx={{ position: 'absolute', bottom: 10, left: 10, color: 'white' }}>
            <Typography variant="body2">12:00 / 58:00</Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              p: 1,
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
        </Paper>
      </Box>

      {/* Course Content */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Main Content */}
        <Box sx={{ flex: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Vue JS Scratch Course
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, color: 'text.secondary' }}>
            {course.fullDescription}
          </Typography>

          {/* Comments Section */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Bình luận
          </Typography>
          <Box sx={{ mb: 3 }}>
            {course.comments.map((comment, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                <Avatar sx={{ mr: 2 }}>{comment.user[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {comment.user}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {comment.comment}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Button
              variant="outlined"
              sx={{ mt: 2, borderColor: '#673ab7', color: '#673ab7', textTransform: 'none' }}
              endIcon={<ExpandMoreIcon />}
            >
              Load more review
            </Button>
          </Box>
        </Box>

        {/* Chapters Sidebar */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Chapter 1: Course Overview
            </Typography>
            <List>
              {course.chapters.map((chapter, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={chapter.title}
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{chapter.duration}</Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: chapter.status === 'Free' ? 'green' : 'red' }}
                        >
                          {chapter.status}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default CourseDetail;