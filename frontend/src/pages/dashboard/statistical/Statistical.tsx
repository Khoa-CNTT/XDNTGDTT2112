/** MUI */
import {
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
import { useState } from 'react';

/** types */
type StatField = 'user' | 'exam' | 'question' | 'visitor';

const mockData: Record<
  StatField,
  { total: number; percent: number; chartData: { month: string; value: number }[] }
> = {
  user: {
    total: 10500,
    percent: 8,
    chartData: [
      { month: 'Tháng 1', value: 300 },
      { month: 'Tháng 2', value: 500 },
      { month: 'Tháng 3', value: 450 },
      { month: 'Tháng 4', value: 700 },
      { month: 'Tháng 5', value: 600 },
      { month: 'Tháng 6', value: 800 },
      { month: 'Tháng 7', value: 650 },
      { month: 'Tháng 8', value: 900 },
      { month: 'Tháng 9', value: 500 },
      { month: 'Tháng 10', value: 700 },
      { month: 'Tháng 11', value: 600 },
      { month: 'Tháng 12', value: 750 },
    ],
  },
  exam: {
    total: 420,
    percent: -4,
    chartData: [
      { month: 'Tháng 1', value: 20 },
      { month: 'Tháng 2', value: 30 },
      { month: 'Tháng 3', value: 25 },
      { month: 'Tháng 4', value: 40 },
      { month: 'Tháng 5', value: 35 },
      { month: 'Tháng 6', value: 45 },
      { month: 'Tháng 7', value: 30 },
      { month: 'Tháng 8', value: 50 },
      { month: 'Tháng 9', value: 28 },
      { month: 'Tháng 10', value: 42 },
      { month: 'Tháng 11', value: 38 },
      { month: 'Tháng 12', value: 45 },
    ],
  },
  question: {
    total: 9600,
    percent: 12,
    chartData: [
      { month: 'Tháng 1', value: 200 },
      { month: 'Tháng 2', value: 300 },
      { month: 'Tháng 3', value: 250 },
      { month: 'Tháng 4', value: 400 },
      { month: 'Tháng 5', value: 350 },
      { month: 'Tháng 6', value: 450 },
      { month: 'Tháng 7', value: 300 },
      { month: 'Tháng 8', value: 500 },
      { month: 'Tháng 9', value: 280 },
      { month: 'Tháng 10', value: 420 },
      { month: 'Tháng 11', value: 380 },
      { month: 'Tháng 12', value: 450 },
    ],
  },
  visitor: {
    total: 32500,
    percent: -6,
    chartData: [
      { month: 'Tháng 1', value: 2000 },
      { month: 'Tháng 2', value: 2500 },
      { month: 'Tháng 3', value: 2300 },
      { month: 'Tháng 4', value: 3000 },
      { month: 'Tháng 5', value: 2800 },
      { month: 'Tháng 6', value: 3200 },
      { month: 'Tháng 7', value: 2600 },
      { month: 'Tháng 8', value: 3500 },
      { month: 'Tháng 9', value: 2400 },
      { month: 'Tháng 10', value: 3100 },
      { month: 'Tháng 11', value: 2900 },
      { month: 'Tháng 12', value: 3300 },
    ],
  },
};

const statsConfig: {
  title: string;
  icon: React.ReactNode;
  field: StatField;
  color: string;
  chartTitle: string;
  dataKey: string;
}[] = [
  {
    title: 'Người dùng',
    icon: <PeopleIcon fontSize="large" color="primary" />,
    field: 'user',
    color: 'primary.main',
    chartTitle: 'Thống kê người dùng đăng ký theo từng tháng',
    dataKey: 'value',
  },
  {
    title: 'Khóa học',
    icon: <QuizIcon fontSize="large" sx={{ color: '#009688' }} />,
    field: 'exam',
    color: '#009688',
    chartTitle: 'Thống kê khóa học theo từng tháng',
    dataKey: 'value',
  },
  {
    title: 'Giảng viên',
    icon: <HelpIcon fontSize="large" sx={{ color: '#9c27b0' }} />,
    field: 'question',
    color: '#9c27b0',
    chartTitle: 'Thống kê giảng viên đăng ký theo từng tháng',
    dataKey: 'value',
  },
  {
    title: 'Lượt truy cập',
    icon: <TravelExploreIcon fontSize="large" sx={{ color: '#795548' }} />,
    field: 'visitor',
    color: '#795548',
    chartTitle: 'Thống kê lượt truy cập theo từng tháng',
    dataKey: 'value',
  },
];

export default function Statistical() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedStat, setSelectedStat] = useState<StatField | null>(null);

  const handleStatClick = (field: StatField) => {
    setSelectedStat(field);
  };

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {statsConfig.map((stat) => {
          const { total, percent } = mockData[stat.field];
          const isPositive = percent >= 0;

          return (
            <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={stat.title}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  cursor: 'pointer',
                  border: selectedStat === stat.field ? `2px solid ${stat.color}` : 'none',
                  bgcolor: selectedStat === stat.field ? `${stat.color}10` : 'background.paper',
                }}
                onClick={() => handleStatClick(stat.field)}
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

        {selectedStat && (
          <Grid item xs={12} width={1}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {statsConfig.find((stat) => stat.field === selectedStat)?.chartTitle}
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={mockData[selectedStat].chartData}
                  margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={statsConfig.find((stat) => stat.field === selectedStat)?.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={statsConfig.find((stat) => stat.field === selectedStat)?.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="1 1" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={statsConfig.find((stat) => stat.field === selectedStat)?.color}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}