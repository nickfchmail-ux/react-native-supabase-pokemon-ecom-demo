import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign up',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
