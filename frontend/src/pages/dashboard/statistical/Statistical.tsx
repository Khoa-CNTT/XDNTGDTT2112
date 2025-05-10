/** MUI */
import {
  // Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import HelpIcon from '@mui/icons-material/Help';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

/** recharts */
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/** utils */
import { formatNumber } from '@/utils/formatNumber';

/** types */
type StatField = 'user' | 'exam' | 'question' | 'visitor';

const mockData: Record<StatField, { total: number; percent: number }> & {
  userRegisters: { month: string; users: number }[];
} = {
  user: { total: 10500, percent: 8 },
  exam: { total: 420, percent: -4 },
  question: { total: 9600, percent: 12 },
  visitor: { total: 32500, percent: -6 },
  userRegisters: [
    { month: 'Tháng 1', users: 300 },
    { month: 'Tháng 2', users: 500 },
    { month: 'Tháng 3', users: 450 },
    { month: 'Tháng 4', users: 700 },
    { month: 'Tháng 5', users: 600 },
    { month: 'Tháng 6', users: 600 },
    { month: 'Tháng 7', users: 600 },
    { month: 'Tháng 8', users: 600 },
    { month: 'Tháng 9', users: 500 },
    { month: 'Tháng 10', users: 700 },
    { month: 'Tháng 11', users: 600 },
    { month: 'Tháng 12', users: 600 },
  ],
};

const statsConfig: {
  title: string;
  icon: React.ReactNode;
  field: StatField;
  color: string;
}[] = [
  {
    title: 'Người dùng',
    icon: <PeopleIcon fontSize="large" color="primary" />,
    field: 'user',
    color: 'primary.main',
  },
  {
    title: 'Khóa học',
    icon: <QuizIcon fontSize="large" sx={{ color: '#009688' }} />,
    field: 'exam',
    color: '#009688',
  },
  {
    title: 'Giảng viên',
    icon: <HelpIcon fontSize="large" sx={{ color: '#9c27b0' }} />,
    field: 'question',
    color: '#9c27b0',
  },
  {
    title: 'Lượt truy cập',
    icon: <TravelExploreIcon fontSize="large" sx={{ color: '#795548' }} />,
    field: 'visitor',
    color: '#795548',
  },
];

export default function Statistical() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {statsConfig.map((stat) => {
          const { total, percent } = mockData[stat.field];
          const isPositive = percent >= 0;

          return (
            <Grid item xs={12} sm={6} md={3} key={stat.title} >
              <Paper
                elevation={3}
                sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1" color="textSecondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {formatNumber(total)}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  {isPositive ? (
                    <ArrowUpwardIcon color="success" fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon color="error" fontSize="small" />
                  )}
                  <Typography variant="body2" color={isPositive ? 'success.main' : 'error.main'}>
                    {isPositive ? `+${percent}` : percent}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Kể từ tuần trước
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          );
        })}

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thống kê người dùng đăng ký theo từng tháng
            </Typography>
            <ResponsiveContainer width={1100} height={400}>
              <AreaChart
                data={mockData.userRegisters}
                margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="1 1" stroke={theme.palette.divider} />
                <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}