import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle } from '../lib/googleAuth';

export default function Login() {
  const { session } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <Text>Sign in to your Pokémon app</Text>
      <Button
        title="Continue with Google"
        onPress={async () => {
          try {
            await signInWithGoogle();
            router.replace('/(tabs)/home');
          } catch (err) {
            console.error(err);
          }
        }}
      />
    </View>
  );
}
