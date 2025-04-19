import type { Palette, TypographyVariantsOptions } from '@mui/material';

type ThemeTypography =
  | TypographyVariantsOptions
  | ((palette: Palette) => TypographyVariantsOptions)
  | undefined;

export const typography: ThemeTypography = {
  fontFamily: ['Roboto', 'sans-serif'].join(','),
};
