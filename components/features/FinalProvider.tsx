import { AuthProvider } from '@/contexts/AuthContext';
import '@/global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { configureGoogle } from '@/lib/googleAuth';
import { store } from '@/states/global/redux-store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Good defaults for mobile
      gcTime: 1000 * 60 * 10, // 10 minutes (instead of infinite)
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

export default function FinalProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    configureGoogle();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Provider store={store}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              {children}
              <Toast />
            </ThemeProvider>
          </Provider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
