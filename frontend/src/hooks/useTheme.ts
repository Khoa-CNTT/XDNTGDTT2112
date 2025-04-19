import {
  themeModeSelector,
  toggleTheme as changeThemeMode,
} from '@/features/theme';
import { useAppDispatch, useAppSelector } from './useStore';

export const useTheme = () => {
  const themeMode = useAppSelector(themeModeSelector);
  const dispatch = useAppDispatch();

  const toggleTheme = () => {
    dispatch(changeThemeMode());
  };

  return {
    themeMode,
    toggleTheme,
  };
};
