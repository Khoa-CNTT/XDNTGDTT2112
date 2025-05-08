import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Section from '@/components/common/Section';
import Typography from '@mui/material/Typography';
import CustomTabPanel from './CustomTabPanel';
import CourseListTab from './CourseListTab';
import CreateCourseTab from './CreateCourseTab';
import { Course } from '@/types';


const coursesData: Course[] = [
  {
    _id: '6451cf82a97def34b28e5f7a',
    title: 'Node.js và Express - Xây dựng RESTful API',
    slug: 'nodejs-va-express-xay-dung-restful-api',
    description:
      'Học cách xây dựng RESTful API mạnh mẽ với Node.js, Express, và MongoDB. Từ cơ bản đến triển khai thực tế và bảo mật.',
    price: 699000,
    discountPrice: 499000,
    averageRating: 4.5,
    thumbnail: 'https://th.bing.com/th/id/OIP.X0lQPk0QnmYgT_T9yW64NwHaEK?rs=1&pid=ImgDetMain',
    author: {
      _id: '6432f506c0e05609b48cef5a',
      email: 'tuan.nguyen@example.com',
      name: 'Tuấn Nguyễn',
      bio: 'Senior JavaScript Developer với hơn 8 năm kinh nghiệm tại các công ty công nghệ hàng đầu.',
      avatarUrl: '',
      role: 'instructor',
      registerProvider: 'google',
      createdAt: '2023-03-15T08:30:00.000Z',
      updatedAt: '2023-09-28T15:45:22.000Z',
      __v: 0,
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    categoryId: '64215a9e32c123afb23d4e13',
    level: 'intermediate',
    duration: 1680,
    requirements:
      'Kiến thức cơ bản về JavaScript. Hiểu biết về REST API là một lợi thế.',
    whatYouWillLearn:
      'Xây dựng RESTful API với Node.js và Express, kết nối MongoDB với Mongoose, xác thực và phân quyền với JWT, xử lý lỗi, và triển khai API lên các nền tảng cloud.',
    isPublished: true,
    createdAt: '2023-05-20T13:25:45.000Z',
    updatedAt: '2023-10-15T12:40:30.000Z',
  },
  {
    _id: '6458e2f1b34c7a9d25f1e8d7',
    title: 'Docker và Kubernetes cho Developers',
    slug: 'docker-va-kubernetes-cho-developers',
    description:
      'Làm chủ container hóa với Docker và quản lý container với Kubernetes. Tối ưu quy trình phát triển và triển khai ứng dụng.',
    price: 899000,
    discountPrice: 649000,
    averageRating: 3.5,
    thumbnail: 'https://th.bing.com/th/id/OIP.X0lQPk0QnmYgT_T9yW64NwHaEK?rs=1&pid=ImgDetMain',
    author: {
      _id: '6445d8f2c73e21b5a9f6c4d3',
      email: 'hoang.pham@example.com',
      name: 'Hoàng Phạm',
      bio: 'DevOps Engineer với hơn 6 năm kinh nghiệm trong việc xây dựng và triển khai hệ thống phân tán.',
      avatarUrl: '',
      role: 'instructor',
      registerProvider: 'local',
      createdAt: '2023-02-10T11:35:20.000Z',
      updatedAt: '2023-09-05T10:25:40.000Z',
      __v: 0,
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    categoryId: '64215a9e32c123afb23d4e16',
    level: 'expert',
    duration: 1920,
    requirements:
      'Kiến thức cơ bản về Linux và command line. Hiểu biết về quy trình phát triển phần mềm.',
    whatYouWillLearn:
      'Tạo và quản lý Docker container, xây dựng Docker image, thiết lập Kubernetes cluster, triển khai ứng dụng microservices, và cấu hình CI/CD pipeline.',
    isPublished: true,
    createdAt: '2023-07-15T09:50:25.000Z',
    updatedAt: '2023-10-25T14:20:35.000Z',
  },
  {
    _id: '645f19a8d23e7c4b16a2f5e9',
    title: 'Flutter - Phát triển ứng dụng đa nền tảng',
    slug: 'flutter-phat-trien-ung-dung-da-nen-tang',
    description:
      'Học cách xây dựng ứng dụng mobile đẹp mắt cho cả iOS và Android với một codebase duy nhất sử dụng Flutter và Dart.',
    price: 799000,
    discountPrice: 599000,
    averageRating: 5,
    thumbnail: 'https://th.bing.com/th/id/OIP.X0lQPk0QnmYgT_T9yW64NwHaEK?rs=1&pid=ImgDetMain',
    author: {
      _id: '644a1e7f89b2d3c5a6f7e8d9',
      email: 'thu.le@example.com',
      name: 'Thu Lê',
      bio: 'Mobile Developer với hơn 5 năm kinh nghiệm phát triển ứng dụng di động đa nền tảng.',
      avatarUrl: '',
      role: 'instructor',
      registerProvider: 'google',
      createdAt: '2023-03-20T13:45:30.000Z',
      updatedAt: '2023-09-18T11:30:25.000Z',
      __v: 0,
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    categoryId: '64215a9e32c123afb23d4e17',
    level: 'intermediate',
    duration: 2040,
    requirements:
      'Kiến thức cơ bản về lập trình. Kinh nghiệm với bất kỳ ngôn ngữ OOP nào là một lợi thế.',
    whatYouWillLearn:
      'Làm chủ ngôn ngữ Dart, xây dựng UI đẹp mắt với Flutter widgets, quản lý state, tích hợp API, sử dụng Firebase, và triển khai ứng dụng lên App Store và Google Play.',
    isPublished: true,
    createdAt: '2023-06-30T15:20:40.000Z',
    updatedAt: '2023-10-28T09:15:50.000Z',
  },
];

const categories = [
  { _id: '680509944a64b29006160dfa', name: 'Mobile Development' },
  { _id: '64215a9e32c123afb23d4e13', name: 'Web Development' },
  { _id: '64215a9e32c123afb23d4e14', name: 'Data Science' },
  { _id: '64215a9e32c123afb23d4e15', name: 'UI/UX Design' },
];

const levels = ['Sơ cấp', 'Trung cấp', 'Cao cấp'];

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Teacher() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Section sx={{ mt: '90px', mb: '64px' }}>
      <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#1a237e',
            mb: 6,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            position: 'relative',
            '&:after': {
              content: '""',
              width: '60px',
              height: '4px',
              bgcolor: '#1976d2',
              position: 'absolute',
              bottom: '-16px',
              left: '50%',
              transform: 'translateX(-50%)',
              borderRadius: '2px',
            },
          }}
        >
          Dành cho Giáo viên
        </Typography>

        <Box
  sx={{
    borderRadius: '12px',
    bgcolor: 'default',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    p: 1,
  }}
>
  <Tabs
    value={value}
    onChange={handleChange}
    aria-label="teacher tabs"
    centered
    sx={{
      '& .MuiTab-root': {
        fontWeight: 600,
        fontSize: '1rem',
        textTransform: 'none',
        color: '#616161',
        px: 4,
        py: 1.5,
        borderRadius: '8px',
        transition: 'all 0.3s ease',
      },
      '& .MuiTab-root.Mui-selected': {
        color: '#1976d2',
        bgcolor: 'rgba(25, 118, 210, 0.1)',
      },
      '& .MuiTabs-indicator': {
        bgcolor: '#1976d2',
        height: '3px',
        borderRadius: '3px',
      },
    }}
  >
    <Tab label="KHÓA HỌC ĐÃ TẠO" {...a11yProps(0)} />
    <Tab label="TẠO KHÓA HỌC" {...a11yProps(1)} />
  </Tabs>
</Box>


        <CustomTabPanel value={value} index={0}>
          <CourseListTab courses={coursesData} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <CreateCourseTab categories={categories} levels={levels} />
        </CustomTabPanel>
      </Box>
    </Section>
  );
}

export { coursesData, categories, levels };