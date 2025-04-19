import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '@/hooks/useTheme';

// MUI Components
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Rating,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

interface CartItem {
  id: number;
  title: string;
  author: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { themeMode } = useTheme();

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: 'Cách lừa người dùng mua kẹo KERA 1 viên kẹo = 1 vườn rau',
      author: 'Phạm Quang Linh Angola',
      rating: 4.4,
      reviews: 301,
      price: 1999000,
      image:
        'https://iv1cdn.vnecdn.net/vnexpress/images/web/2025/04/05/quang-linh-vlogs-xin-loi-nhung-nguoi-da-tin-tuong-minh-1743825292.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=Nsy-SZHZvs7m4PEy4K9iiA',
    },
    {
      id: 2,
      title: 'Cách yêu 8 em cùng một lúc, cách chia thời gian yêu đương hiệu quả',
      author: 'Vi rút',
      rating: 4.8,
      reviews: 180,
      price: 2819000,
      image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/3/29/1483824/Kem.jpg',
    },
    {
      id: 3,
      title: 'Cách lừa 16 tỷ mà không bị chửi',
      author: 'Anh Thoại',
      rating: 4.8,
      reviews: 180,
      price: 3819000,
      image: 'https://photo.znews.vn/w660/Uploaded/mdf_uswreo/2025_02_26/phamthoai20250224123338.jpg',
    },
  ]);

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.success('Đã xóa khóa học khỏi giỏ hàng!');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống!');
      return;
    }
    toast.info('Đang chuyển hướng đến trang thanh toán...');
    setTimeout(() => {
      navigate('/checkout');
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 3,
        position: 'relative',
        backgroundColor: themeMode === 'dark' ? 'grey.900' : 'grey.100',
      }}
    >
      <Box sx={{ maxWidth: '64rem', mx: 'auto', position: 'relative', zIndex: 10 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: themeMode === 'dark' ? 'white' : 'text.primary', mb: 2 }}
        >
          Giỏ hàng
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: themeMode === 'dark' ? 'grey.300' : 'text.secondary', mb: 3 }}
        >
          {cartItems.length} khóa học trong giỏ hàng
        </Typography>

        <Stack spacing={2}>
          {cartItems.length === 0 ? (
            <Typography
              variant="body1"
              sx={{ color: themeMode === 'dark' ? 'grey.400' : 'text.secondary' }}
            >
              Giỏ hàng của bạn đang trống.
            </Typography>
          ) : (
            cartItems.map((item) => (
              <Card
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: themeMode === 'dark' ? 'grey.800' : 'background.paper',
                  border: 1,
                  borderColor: themeMode === 'dark' ? 'grey.600' : 'grey.200',
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 80, height: 48, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                  image={item.image}
                  alt={item.title}
                />

                <CardContent sx={{ flex: 1, p: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'medium', color: themeMode === 'dark' ? 'white' : 'text.primary' }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: themeMode === 'dark' ? 'grey.400' : 'text.secondary', mb: 1 }}
                  >
                    {item.author}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating
                      value={item.rating}
                      precision={0.1}
                      readOnly
                      sx={{ color: 'warning.main' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: themeMode === 'dark' ? 'grey.400' : 'text.secondary' }}
                    >
                      ({item.reviews} xếp hạng)
                    </Typography>
                  </Stack>
                </CardContent>

                <Stack alignItems="flex-end" spacing={1}>
                  <IconButton
                    onClick={() => handleRemoveItem(item.id)}
                    sx={{
                      color: themeMode === 'dark' ? 'grey.400' : 'grey.500',
                      '&:hover': { color: 'error.main' },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'medium', color: themeMode === 'dark' ? 'white' : 'text.primary' }}
                  >
                    {formatPrice(item.price)}
                  </Typography>
                </Stack>
              </Card>
            ))
          )}
        </Stack>

        {cartItems.length > 0 && (
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
            sx={{ mt: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body1"
                sx={{ color: themeMode === 'dark' ? 'grey.300' : 'text.secondary' }}
              >
                Tổng:
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 'bold', color: themeMode === 'dark' ? 'white' : 'text.primary' }}
              >
                {formatPrice(totalPrice)}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckout}
              startIcon={<ShoppingCartCheckoutIcon />}
              sx={{ px: 3, py: 1 }}
            >
              Tiến hành thanh toán
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Cart;
