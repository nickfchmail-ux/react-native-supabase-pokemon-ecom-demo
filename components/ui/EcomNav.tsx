import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Tab = {
  id: string;
  label: string;
};

type EcomNavProps = {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (id: string) => void;
};

export default function EcomNav({ tabs, activeTab, onTabPress }: EcomNavProps) {
  return (
    <View className="border-b border-gray-200 bg-white">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => {
              onTabPress(tab.id);
              router.push(`/ecom/${tab.id}` as any);
            }}
            className={`mr-3 rounded-full px-6 py-2.5 ${
              activeTab === tab.id ? 'bg-black' : 'bg-gray-100'
            }`}>
            <Text
              className={`text-sm font-medium ${
                activeTab === tab.id ? 'text-white' : 'text-gray-700'
              }`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
