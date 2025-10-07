'use client';

import { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';

interface Props extends ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children, ...props }: Props) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
