import FinalProvider from '@/components/features/FinalProvider';
import '@/global.css';
import '@/tasks/backgroundLocationTask';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaView className={`flex-1 bg-gray-900`}>
      <StatusBar style="light" />
      <FinalProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="screens" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </FinalProvider>
    </SafeAreaView>
  );
}
