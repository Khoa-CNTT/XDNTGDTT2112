import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTheme } from '@/hooks/useTheme';

export const Footer = () => {
  const { themeMode } = useTheme(); // Sửa: lấy themeMode thay vì theme
  const isDark = themeMode === 'dark';

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 4, md: 6 }, // Giảm padding trên mobile
        bgcolor: isDark ? 'grey.900' : 'grey.800', // Sử dụng màu từ theme
        color: 'common.white',
      }}
    >
      <Container maxWidth="lg">
  <Grid
    container
    spacing={{ xs: 3, md: 4 }}
    justifyContent="space-between"
    alignItems="flex-start"
  >
    {/* Logo & Copyright */}
    <Grid item xs={12} sm={6} md={3}>
      <Typography
        variant="h6"
        fontWeight="bold"
        color="secondary"
        gutterBottom
        sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
      >
        EduGenlus
      </Typography>
      <Typography
        variant="body2"
        color="grey.400"
        sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
      >
        Copyright ©VAeducation2025
      </Typography>
    </Grid>

    {/* Programming */}
    <Grid item xs={12} sm={6} md={3}>
      <Typography
        variant="subtitle1"
        fontWeight="medium"
        gutterBottom
        sx={{ color: 'common.white', fontSize: { xs: '0.9rem', md: '1rem' } }}
      >
        Lập trình
      </Typography>
      <Box display="flex" flexDirection="column" gap={{ xs: 0.5, md: 1 }}>
        {['Web Programming', 'Mobile Programming', 'Java A-Z', 'PHP A-Z'].map((text) => (
          <Link
            key={text}
            href="#"
            underline="hover"
            sx={{
              color: 'grey.500',
              fontSize: { xs: '0.8rem', md: '0.875rem' },
              '&:hover': { color: 'common.white' },
            }}
          >
            {text}
          </Link>
        ))}
      </Box>
    </Grid>

    {/* Design */}
    <Grid item xs={12} sm={6} md={3}>
      <Typography
        variant="subtitle1"
        fontWeight="medium"
        gutterBottom
        sx={{ color: 'common.white', fontSize: { xs: '0.9rem', md: '1rem' } }}
      >
        Thiết kế
      </Typography>
      <Box display="flex" flexDirection="column" gap={{ xs: 0.5, md: 1 }}>
        {['Adobe Illustrator', 'Adobe Photoshop', 'Design Logo'].map((text) => (
          <Link
            key={text}
            href="#"
            underline="hover"
            sx={{
              color: 'grey.500',
              fontSize: { xs: '0.8rem', md: '0.875rem' },
              '&:hover': { color: 'common.white' },
            }}
          >
            {text}
          </Link>
        ))}
      </Box>
    </Grid>

    {/* Other + Social */}
    <Grid item xs={12} sm={6} md={3}>
      <Typography
        variant="subtitle1"
        fontWeight="medium"
        gutterBottom
        sx={{ color: 'common.white', fontSize: { xs: '0.9rem', md: '1rem' } }}
      >
        Khác
      </Typography>
      <Box display="flex" flexDirection="column" gap={{ xs: 0.5, md: 1 }}>
        {['Chính thuật 30 ngày', 'Photography', 'Làm phim'].map((text) => (
          <Link
            key={text}
            href="#"
            underline="hover"
            sx={{
              color: 'grey.500',
              fontSize: { xs: '0.8rem', md: '0.875rem' },
              '&:hover': { color: 'common.white' },
            }}
          >
            {text}
          </Link>
        ))}
      </Box>

      {/* Social Icons */}
      <Box mt={{ xs: 1.5, md: 2 }} display="flex" gap={{ xs: 1, md: 2 }}>
        <IconButton
          href="https://twitter.com"
          target="_blank"
          rel="noopener"
          sx={{
            color: 'grey.500',
            '&:hover': { color: 'white' },
            p: { xs: 0.5, md: 1 },
          }}
        >
          <TwitterIcon fontSize="small" />
        </IconButton>
        <IconButton
          href="https://instagram.com"
          target="_blank"
          rel="noopener"
          sx={{
            color: 'grey.500',
            '&:hover': { color: 'white' },
            p: { xs: 0.5, md: 1 },
          }}
        >
          <InstagramIcon fontSize="small" />
        </IconButton>
        <IconButton
          href="https://facebook.com"
          target="_blank"
          rel="noopener"
          sx={{
            color: 'grey.500',
            '&:hover': { color: 'white' },
            p: { xs: 0.5, md: 1 },
          }}
        >
          <FacebookIcon fontSize="small" />
        </IconButton>
      </Box>
    </Grid>
  </Grid>
</Container>

    </Box>
  );
};

export default Footer;