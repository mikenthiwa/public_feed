'use client';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/providers/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme='light'>{children}</ThemeProvider>
    </Provider>
  );
}
