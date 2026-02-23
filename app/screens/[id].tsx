import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
export default function CustomScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Stack.Screen
        options={{
          title: `Custom Title - ${id}`,
          headerStyle: { backgroundColor: 'yellow' },
          headerTintColor: 'green',
          headerTitleStyle: { fontSize: 30, fontWeight: 'bold' },
        }}
      />
      <Text>id received:{id}</Text>
    </View>
  );
}
