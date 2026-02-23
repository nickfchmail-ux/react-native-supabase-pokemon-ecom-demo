import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Tabs } from 'expo-router';
import React from 'react';
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="ecom"
        options={{
          title: 'Store',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="storefront" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="chatbox" color={color} />,
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: 'Share',
          tabBarIcon: ({ color }) => <Ionicons name="phone-landscape" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="auth"
        options={{
          title: session ? 'Profile' : 'Login',
          tabBarIcon: ({ color }) => (
            <Ionicons name={session ? 'people-circle' : 'log-in'} size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
