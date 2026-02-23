import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileTab() {
  const { session, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!session) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <ThemedView style={styles.container}>
      <React.Fragment>
        <ThemedText type="title" style={styles.title}>
          Profile
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>
          Logged in as: {session?.user.email}
        </ThemedText>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF3B30' }]}
          onPress={signOut}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Sign Out</ThemedText>
          )}
        </TouchableOpacity>
      </React.Fragment>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
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
