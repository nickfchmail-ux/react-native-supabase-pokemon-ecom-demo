import EcomNav from '@/components/ui/EcomNav';
import { Stack, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'shop', label: 'Shop' },
  { id: 'cart', label: 'Cart' },
  { id: 'favorites', label: 'Favorites' },
];

export default function HomeLayout() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('about');

  // Auto sync activeTab with current nested screen
  useEffect(() => {
    const currentScreen = pathname.split('/').pop() || 'about';

    if (tabs.some((tab) => tab.id === currentScreen)) {
      setActiveTab(currentScreen);
    }
  }, [pathname]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={{ flex: 1 }}>
        {/* Fixed Navbar on top */}
        <EcomNav tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />

        {/* Nested Stack - Takes full remaining height */}
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { flex: 1 },
            }}>
            <Stack.Screen name="about" />
            <Stack.Screen name="shop" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="favorites" />
          </Stack>
        </View>
      </View>
    </SafeAreaView>
  );
}
