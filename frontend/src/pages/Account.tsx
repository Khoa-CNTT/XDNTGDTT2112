import { useState } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@/hooks/useTheme';
import Footer from '@/components/Footer';

const tabs = [
  'Hồ sơ',
  'Tài khoản',
  'Phương thức thanh toán',
  'Thông báo',
  'Sửa riêng tư',
];

type FormData = {
  fullName: string;
  familyName: string;
  title: string;
  link: string;
};

type Errors = {
  fullName: string;
  link: string;
};

export default function Account() {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  const [activeTab, setActiveTab] = useState(0);
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    familyName: '',
    title: '',
    link: '',
  });

  const [errors, setErrors] = useState<Errors>({
    fullName: '',
    link: '',
  });

  const handleChange = (field: keyof FormData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      if (errors[field as keyof Errors]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    };

  const validateForm = () => {
    let valid = true;
    const newErrors: Errors = { fullName: '', link: '' };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Tên đầy đủ không được để trống';
      valid = false;
    }

    const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/;
    if (formData.link && !urlRegex.test(formData.link)) {
      newErrors.link = 'Liên kết không hợp lệ (phải bắt đầu bằng http:// hoặc https://)';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      console.log('Saving user data:', formData);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Card sx={{ bgcolor: isDark ? 'grey.800' : 'background.paper' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar
                  src="https://media.techz.vn/resize_x355x/media2019/source/Nhung-do/A-Son-Tung-MTP/Son-Tung-MTP-lo-anh-dung-do-doi-voi-Thieu-Bao-Tram-9.jpg"
                  alt="User Avatar"
                  sx={{ width: 100, height: 100 }}
                />
              </Box>

              <TextField
                label="Tên đầy đủ"
                fullWidth
                value={formData.fullName}
                onChange={handleChange('fullName')}
                error={!!errors.fullName}
                helperText={errors.fullName}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: isDark ? 'grey.700' : 'white' } }}
              />
              <TextField
                label="Họ đệm"
                fullWidth
                value={formData.familyName}
                onChange={handleChange('familyName')}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: isDark ? 'grey.700' : 'white' } }}
              />
              <TextField
                label="Tiêu đề"
                fullWidth
                value={formData.title}
                onChange={handleChange('title')}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: isDark ? 'grey.700' : 'white' } }}
              />
              <FormControl fullWidth>
                <InputLabel>Ngôn ngữ</InputLabel>
                <Select
                  value={language}
                  label="Ngôn ngữ"
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{ bgcolor: isDark ? 'grey.700' : 'white' }}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Vietnamese">Vietnamese</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Liên kết"
                fullWidth
                value={formData.link}
                onChange={handleChange('link')}
                error={!!errors.link}
                helperText={errors.link}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: isDark ? 'grey.700' : 'white' } }}
              />
              <Box textAlign="center">
                <Button
                  onClick={handleSave}
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  {loading ? 'Đang lưu...' : 'Lưu lại'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card sx={{ bgcolor: isDark ? 'grey.800' : 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{tabs[activeTab]}</Typography>
              <Typography variant="body1" color="text.secondary">
                Chức năng này hiện chưa triển khai.
              </Typography>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Box
      sx={{
        bgcolor: isDark ? 'grey.900' : 'grey.100',
        color: isDark ? 'common.white' : 'text.primary',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
          Tài khoản của tôi
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(e, newVal) => setActiveTab(newVal)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            mb: 4,
            bgcolor: isDark ? 'grey.800' : 'background.paper',
            borderRadius: 1,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: '1rem',
              py: 2,
            },
            '& .MuiTabs-indicator': {
              height: 3,
            },
          }}
        >
          {tabs.map((tab, i) => (
            <Tab label={tab} key={i} />
          ))}
        </Tabs>

        {renderTabContent()}
      </Container>

      <Footer />
    </Box>
  );
}
