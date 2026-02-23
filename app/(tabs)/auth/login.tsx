import backgroundImage from '@/assets/images/login-bg.jpg';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { setCurrentUserId } from '@/lib/data-service';
import { supabase } from '@/utils/supabase';
import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default function Login() {
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Redirect href="/(tabs)/auth/profile" />;
  }

  async function signInWithEmail() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    else if (!session) Alert.alert('Please check your inbox for email verification!');
    await setCurrentUserId();
    setLoading(false);
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ImageBackground source={backgroundImage} style={styles.titleBox} resizeMode="cover">
            <ThemedText type="title" style={styles.title}>
              Pokémon 芒
            </ThemedText>
          </ImageBackground>

          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="email@address.com"
            placeholderTextColor={'#888'}
            autoCapitalize={'none'}
          />

          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={'#888'}
            autoCapitalize={'none'}
          />

          <TouchableOpacity style={styles.button} onPress={signInWithEmail} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            )}
          </TouchableOpacity>
          <Text>
            <Pressable>
              <Text className={`text-white`}>Do not have an account yet? click here to</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                router.navigate('/(auth)/signup');
              }}>
              <Text className={`ml-1 text-yellow-400 `}>sign up</Text>
            </Pressable>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#191952',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 0,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  titleBox: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
