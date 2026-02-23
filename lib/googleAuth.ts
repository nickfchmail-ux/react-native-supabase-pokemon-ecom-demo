import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { supabase } from './supabase';

// Configure once (call in root layout or App entry)
export function configureGoogle() {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
    // iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // if building iOS
  });
}

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    // Handle both old and new response formats
    // @ts-ignore
    const idToken = response.data?.idToken || response.idToken;

    if (!idToken) throw new Error('No ID token');

    if (idToken === 'mock-token') {
      console.warn('Using Mock Google Token - Skipping Supabase Validation');
      return {
        id: 'mock-user-id',
        email: 'mock@test.com',
        user_metadata: { full_name: 'Mock User', avatar_url: 'https://via.placeholder.com/150' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) throw error;

    // Explicitly set the user ID in storage after successful login
    if (data.user) {
      const { setUserIdDirectly } = await import('./data-service');
      await setUserIdDirectly(data.user.id);
    }

    return data.user;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('Cancelled');
    } else {
      console.error('Google Sign-In failed:', error);
    }
    throw error;
  }
}

export async function signOut() {
  await GoogleSignin.signOut();
  await supabase.auth.signOut();
}
