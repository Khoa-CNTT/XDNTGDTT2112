import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Image from '../common/Image';

import { useTheme } from '@/hooks/useTheme';
import { Avatar, Stack } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchBar from '../common/SearchBar';

export default function Header() {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <AppBar position='static'>
      <Toolbar
        sx={{
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Stack direction={'row'} spacing={2} alignItems='center'>
          <Box
            sx={{
              position: 'relative',
              width: '100px',
              aspectRatio: '2/1',
            }}
          >
            <Image src='/icons/dark-logo.svg' alt='Logo' fill={true} />
          </Box>

          <Box>
            <Typography>Khám phá</Typography>
          </Box>
        </Stack>

        <SearchBar sx={{ flexGrow: 1 }} />

        <Stack direction={'row'} gap={2} alignItems={'center'}>
          {themeMode === 'light' && (
            <IconButton onClick={toggleTheme}>
              <DarkModeIcon sx={{ color: 'black' }} />
            </IconButton>
          )}
          {themeMode === 'dark' && (
            <IconButton onClick={toggleTheme}>
              <LightModeIcon />
            </IconButton>
          )}
          <IconButton size='large' color='inherit'>
            <Badge badgeContent={2} color='error'>
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton size='large' color='inherit'>
            <Badge badgeContent={4} color='error'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton size='medium' color='inherit'>
            <Avatar sx={{ width: 32, height: 32 }}>T</Avatar>
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
