import ImagePicker from '@/components/features/ImagePicker';
import LocationPicker from '@/components/features/LocationPicker';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
export default function CustomScreen() {
  const { data } = useLocalSearchParams();
  const parsedData = typeof data === 'string' ? JSON.parse(data) : [];

  return (
    <ScrollView className="flex-1 bg-white">
      <ImagePicker />
      <LocationPicker />
    </ScrollView>
  );
}
