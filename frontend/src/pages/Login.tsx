import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
  Modal,
  Fade,
} from '@mui/material';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleShowPassword = () => setShowPassword((prev) => !prev);
  const handleOpenForgotPassword = () => setOpenForgotPassword(true);
  const handleCloseForgotPassword = () => setOpenForgotPassword(false);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const PATTERNS = {
      EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,24}$/,
    };

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || email.trim() === '') {
      toast.error('Vui lòng nhập email!');
      return;
    } else if (!PATTERNS.EMAIL.test(email)) {
      toast.error('Email không hợp lệ!');
      return;
    }

    if (!password || password.trim() === '') {
      toast.error('Vui lòng nhập mật khẩu!');
      return;
    } else if (!PATTERNS.PASSWORD.test(password)) {
      toast.error(
        'Mật khẩu phải từ 6-24 ký tự và bao gồm ít nhất 1 chữ thường, 1 chữ hoa và 1 ký tự đặc biệt!'
      );
      return;
    }

    // Gọi API đăng nhập ở đây (nếu có)
    toast.success('Đăng nhập thành công!');
    navigate('/');
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email')?.toString().trim();

    if (!email) return toast.error('Vui lòng nhập email!');
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
      return toast.error('Email không hợp lệ!');

    try {
      // Giả lập gửi email
      toast.success('Email đặt lại mật khẩu đã được gửi!');
      handleCloseForgotPassword();
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Gửi email thất bại. Vui lòng thử lại!');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      toast.success('Đăng nhập với Facebook thành công!');
      navigate('/');
      console.log('Gọi API đăng nhập với Facebook');
    } catch (error) {
      console.error('Lỗi khi đăng nhập với Facebook:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      toast.success('Đăng nhập với Google thành công!');
      navigate('/');
      console.log('Gọi API đăng nhập với Google');
    } catch (error) {
      console.error('Lỗi khi đăng nhập với Google:', error);
      toast.error('Đăng nhập với Google thất bại! Vui lòng thử lại.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? 'grey.900' : 'grey.200',
      }}
    >
      <Box
        sx={{
          bgcolor: isDark ? 'rgba(33, 33, 33, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          boxShadow: 5,
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color={isDark ? 'white' : 'grey.900'}
          mb={2}
        >
          Đăng nhập
        </Typography>

        <Box
          component="form"
          onSubmit={handleLocalLogin}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            InputProps={{
              style: {
                backgroundColor: isDark ? '#424242' : 'white',
                color: isDark ? 'white' : 'black',
              },
            }}
            InputLabelProps={{ style: { color: isDark ? '#e0e0e0' : '#666' } }}
          />
          <Box sx={{ position: 'relative' }}>
            <TextField
              name="password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: isDark ? '#424242' : 'white',
                  color: isDark ? 'white' : 'black',
                },
              }}
              InputLabelProps={{ style: { color: isDark ? '#e0e0e0' : '#666' } }}
            />
            <IconButton
              onClick={handleShowPassword}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDark ? 'grey.300' : 'grey.500',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </IconButton>
          </Box>

          <Typography
            variant="body2"
            sx={{
              textAlign: 'right',
              color: isDark ? '#BB86FC' : '#6200EA',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={handleOpenForgotPassword}
          >
            Quên mật khẩu?
          </Typography>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' },
              py: 1.5,
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            Đăng nhập
          </Button>
        </Box>

        <Box sx={{ my: 3, position: 'relative' }}>
          <Divider sx={{ bgcolor: isDark ? 'grey.600' : 'grey.300' }} />
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: isDark ? 'rgba(33, 33, 33, 0.9)' : 'white',
              px: 2,
              color: isDark ? 'grey.300' : 'grey.500',
            }}
          >
            Hoặc đăng nhập với
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Button
            onClick={handleFacebookLogin}
            fullWidth
            variant="contained"
            startIcon={<FaFacebookF />}
            sx={{
              bgcolor: '#1877F2',
              '&:hover': { bgcolor: '#1565C0' },
              textTransform: 'none',
              py: 1.5,
            }}
          >
            Tiếp tục với Facebook
          </Button>
          <Button
            onClick={handleGoogleLogin}
            fullWidth
            variant="outlined"
            startIcon={<FcGoogle />}
            sx={{
              bgcolor: isDark ? '#424242' : 'white',
              color: isDark ? 'white' : 'black',
              borderColor: isDark ? 'grey.600' : 'grey.300',
              '&:hover': {
                bgcolor: isDark ? 'grey.600' : 'grey.100',
              },
              textTransform: 'none',
              py: 1.5,
            }}
          >
            Tiếp tục với Google
          </Button>
        </Stack>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: isDark ? 'grey.300' : 'grey.600' }}
        >
          Chưa có tài khoản?{' '}
          <Link
            to="/sign-up"
            style={{ color: isDark ? '#BB86FC' : '#6200EA', textDecoration: 'none' }}
          >
            Đăng ký
          </Link>
        </Typography>
      </Box>

      <Modal
        open={openForgotPassword}
        onClose={handleCloseForgotPassword}
        closeAfterTransition
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Fade in={openForgotPassword}>
          <Box
            sx={{
              bgcolor: isDark ? 'rgba(33, 33, 33, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              p: { xs: 3, sm: 4 },
              borderRadius: 2,
              boxShadow: 5,
              width: '100%',
              maxWidth: 400,
              textAlign: 'center',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color={isDark ? 'white' : 'grey.900'}
              mb={2}
            >
              Đặt lại mật khẩu
            </Typography>
            <Typography
              variant="body2"
              color={isDark ? 'grey.300' : 'grey.600'}
              mb={3}
            >
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
            </Typography>
            <Box
              component="form"
              onSubmit={handleForgotPassword}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                InputProps={{
                  style: {
                    backgroundColor: isDark ? '#424242' : 'white',
                    color: isDark ? 'white' : 'black',
                  },
                }}
                InputLabelProps={{ style: { color: isDark ? '#e0e0e0' : '#666' } }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: '#d32f2f',
                  '&:hover': { bgcolor: '#b71c1c' },
                  py: 1.5,
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'none',
                }}
              >
                Gửi liên kết
              </Button>
            </Box>
            <Button
              onClick={handleCloseForgotPassword}
              sx={{
                mt: 2,
                color: isDark ? '#BB86FC' : '#6200EA',
                textTransform: 'none',
              }}
            >
              Hủy
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Login;
