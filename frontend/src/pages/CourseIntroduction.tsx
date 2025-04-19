import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArticleIcon from '@mui/icons-material/Article';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import YouTubeIcon from '@mui/icons-material/YouTube';

// Dữ liệu giả lập (có thể thay bằng API)
const courseDetails = {
  1: {
    title: 'Cách lừa người dùng mua kẹo KERA 1 viên kẹo = 1 vườn rau',
    image:
      'https://iv1cdn.vnecdn.net/vnexpress/images/web/2025/04/05/quang-linh-vlogs-xin-loi-nhung-nguoi-da-tin-tuong-minh-1743825292.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=Nsy-SZHZvs7m4PEy4K9iiA',
    description: 'Học cách tiếp thị và bán hàng hiệu quả với chiến lược độc đáo.',
    author: 'Phạm Quang Linh Angola',
    category: 'Marketing',
    price: '1.999.000VND',
    originalPrice: '2.500.000VND',
    discount: '20%',
    chapters: 15,
    lessons: 50,
    duration: '3h 45m',
    language: 'Tiếng Việt',
    fullDescription:
      'Khóa học này sẽ hướng dẫn bạn cách tiếp thị và bán hàng hiệu quả thông qua các chiến lược sáng tạo và độc đáo. Bạn sẽ học cách thu hút khách hàng, xây dựng niềm tin, và tối ưu hóa doanh số bán hàng với các kỹ thuật thực tế đã được chứng minh.',
    reviews: [
      { user: 'Leonardo Da Vinci', comment: 'Loved the course! I’ve learned some very subtle techniques, especially on leaves.' },
      { user: 'Titian S', comment: 'I loved the course, it had been a long time since I had experimented with watercolors and now I will do more often, thanks to Kita Studio.' },
      { user: 'Zhirkov', comment: 'Yes! I just emphasize that the use of Photoshop, for non-users, becomes difficult to follow. What requirement a course to master. Safe and very didactic teacher.' },
      { user: 'Miphoka', comment: 'I have finished the course, yes!, and I would like to have some feedback from the teacher, about the contents shared on the forum 3 months ago, and I still haven’t had any answer. The teacher is very well established, however the explanations and videos are very quick for beginners. However, it is good to go practicing.' },
    ],
  },
  2: {
    title: 'Cách yêu 8 em cùng một lúc, cách chia thời gian yêu đương hiệu quả',
    image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/3/29/1483824/Kem.jpg',
    description: 'Học cách quản lý thời gian và xây dựng mối quan hệ hiệu quả.',
    author: 'Vi rút',
    category: 'Kỹ năng sống',
    price: '2.819.000VND',
    originalPrice: '3.500.000VND',
    discount: '20%',
    chapters: 10,
    lessons: 30,
    duration: '2h 15m',
    language: 'Tiếng Việt',
    fullDescription:
      'Khóa học này sẽ hướng dẫn bạn cách quản lý thời gian và xây dựng mối quan hệ hiệu quả, giúp bạn cân bằng giữa các mối quan hệ và cuộc sống cá nhân. Bạn sẽ học các kỹ năng giao tiếp, tổ chức, và giải quyết xung đột.',
    reviews: [],
  },
  3: {
    title: 'Cách lừa 16 tỷ mà không bị chửi',
    image: 'https://photo.znews.vn/w660/Uploaded/mdf_uswreo/2025_02_26/phamthoai20250224123338.jpg',
    description: 'Học cách đàm phán và thuyết phục hiệu quả trong kinh doanh.',
    author: 'Anh Thoại',
    category: 'Kinh doanh',
    price: '3.819.000VND',
    originalPrice: '4.500.000VND',
    discount: '15%',
    chapters: 20,
    lessons: 60,
    duration: '4h 30m',
    language: 'Tiếng Việt',
    fullDescription:
      'Khóa học này sẽ hướng dẫn bạn cách đàm phán và thuyết phục hiệu quả trong kinh doanh, giúp bạn đạt được các thỏa thuận lớn mà vẫn giữ được mối quan hệ tốt với đối tác. Bạn sẽ học các kỹ thuật đàm phán, xây dựng lòng tin, và quản lý rủi ro.',
    reviews: [],
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

      {/* Video Preview */}
      <Box sx={{ mb: 4, display: 'flex', gap: 3 }}>
        {/* Video Player (Preview Only) */}
        <Box sx={{ flex: 3 }}>
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

        {/* Price and Action */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {course.price}
          </Typography>
          <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary', mb: 1 }}>
            {course.originalPrice}
          </Typography>
          <Chip label={`Giảm giá ${course.discount}`} color="success" size="small" sx={{ mb: 2 }} />
          <Button
            variant="contained"
            color="secondary"
            sx={{ mb: 2, backgroundColor: '#673ab7', fontWeight: 'bold', width: '100%' }}
          >
            Mua ngay
          </Button>
          <Button
            variant="outlined"
            startIcon={<FavoriteBorderIcon />}
            sx={{ mb: 2, borderColor: '#673ab7', color: '#673ab7', width: '100%' }}
          >
            Yêu thích
          </Button>
          <Box sx={{ textAlign: 'left' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <VideoLibraryIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{course.chapters} Chương</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ArticleIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{course.lessons} Bài học</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{course.duration}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{course.language}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Course Info */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip label={course.author} color="success" />
          <Chip label={course.category} color="success" variant="outlined" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          About Course
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, color: 'text.secondary' }}>
          {course.fullDescription}
        </Typography>
      </Box>

      {/* Reviews Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Review
        </Typography>
        {course.reviews.length > 0 ? (
          course.reviews.map((review, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 3, alignItems: 'flex-start' }}>
              <Avatar sx={{ mr: 2 }}>{review.user[0]}</Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {review.user}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {review.comment}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Chưa có đánh giá nào cho khóa học này.
          </Typography>
        )}
        {course.reviews.length > 0 && (
          <Button
            variant="outlined"
            sx={{ borderColor: '#673ab7', color: '#673ab7', textTransform: 'none' }}
          >
            Load more review
          </Button>
        )}
      </Box>

      {/* YouTube Signup */}
      <Box sx={{ backgroundColor: '#1976d2', borderRadius: 2, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Đăng ký ngay
        </Typography>
        <Box sx={{ flex: 1, backgroundColor: 'white', borderRadius: 1, p: 1, display: 'flex', alignItems: 'center' }}>
          <YouTubeIcon sx={{ color: 'red', mr: 1 }} />
          <Typography variant="body2">youtube</Typography>
        </Box>
        <Button variant="contained" sx={{ backgroundColor: '#ff4081', fontWeight: 'bold' }}>
          Đăng ký
        </Button>
      </Box>
    </Container>
  );
};

export default CourseDetail;