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
} from '@mui/material';
import { toast } from 'react-toastify';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLocalSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const PATTERNS = {
      EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,24}$/,
    };

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const password = formData.get('password')?.toString().trim();

    if (!name) return toast.error('Vui lòng nhập tên!');
    if (!email) return toast.error('Vui lòng nhập email!');
    if (!PATTERNS.EMAIL.test(email)) return toast.error('Email không hợp lệ!');
    if (!password) return toast.error('Vui lòng nhập mật khẩu!');
    if (!PATTERNS.PASSWORD.test(password))
      return toast.error(
        'Mật khẩu phải từ 6-24 ký tự và bao gồm ít nhất 1 chữ thường, 1 chữ hoa và 1 ký tự đặc biệt!'
      );

    try {
      // Placeholder for actual sign-up logic (e.g., API call)
      // await signUpWithEmail({ name, email, password });
      toast.success('Đăng ký thành công!');
      navigate('/login'); // Redirect to login page after success
    } catch (error) {
      console.error('Sign-up error:', error);
      toast.error('Đăng ký thất bại. Vui lòng thử lại!');
    }
  };

  // Xử lý khi nhấn nút "Tiếp tục với Facebook"
  const handleFacebookLogin = async () => {
    try {
      toast.success('Đăng ký với Facebook thành công!');
      console.log('Gọi API đăng ký với Facebook');
    } catch (error) {
      console.error('Lỗi khi đăng ký với Facebook:', error);
      toast.error('Đăng ký với Facebook thất bại! Vui lòng thử lại.');
    }
  };

  // Xử lý khi nhấn nút "Tiếp tục với Google"
  const handleGoogleLogin = async () => {
    try {
      toast.success('Đăng ký với Google thành công!');
      console.log('Gọi API đăng ký với Google');
    } catch (error) {
      console.error('Lỗi khi đăng ký với Google:', error);
      toast.error('Đăng ký với Google thất bại! Vui lòng thử lại.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundImage: "url('https://s3-alpha-sig.figma.com/img/84b5/e273/21aa0ec9bf62b4f0184fc192e721944e?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=cAP~NA2JYc2W7W~tXpCU3K4rTCxrarTMEMoU5GyOZ0sGVLosrZVm4dRyiqda2yFuIAXjnWDat~h7ofTwbhmbXVQ8QcBO9EdavzPEf9XvqvTi~VBFiRw2Th5fiAWnoRYNcJorMd2xWWzDXtLM1QMY31GhK42kuQt1WjTaWNJAr~bu9WOhRa8HXOEW1V~qId4syNhFvq~ePlwA5mw76nwJdhi1JsPoiw4s7xRzkHMQTE0V3xHolUgYR7Lr3OM81xp3s0D8djhRmIIbyqqRkEUO4aslvSGX0IB46nSRGbNg6rGRSTkD70EaisJAgPQV8GYGYMmO7wBCCcXQ1kkLnTDKMQ__')", // Replace with your valid image URL
        backgroundColor: isDark ? 'grey.900' : 'grey.200', // Fallback color
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
          Đăng ký bằng email
        </Typography>

        <Box
          component="form"
          onSubmit={handleLocalSignUp}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            name="name"
            label="Tên đầy đủ"
            fullWidth
            variant="outlined"
            InputProps={{
              style: { backgroundColor: isDark ? '#424242' : 'white', color: isDark ? 'white' : 'black' },
            }}
            InputLabelProps={{ style: { color: isDark ? '#e0e0e0' : '#666' } }}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            InputProps={{
              style: { backgroundColor: isDark ? '#424242' : 'white', color: isDark ? 'white' : 'black' },
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
                style: { backgroundColor: isDark ? '#424242' : 'white', color: isDark ? 'white' : 'black' },
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
            Đăng ký
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
            Hoặc đăng ký với
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

        <Typography variant="body2" sx={{ mt: 2, color: isDark ? 'grey.300' : 'grey.600' }}>
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            style={{ color: isDark ? '#BB86FC' : '#6200EA', textDecoration: 'none' }}
          >
            Đăng nhập
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;