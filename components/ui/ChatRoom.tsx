import OnlineUser from '@/components/features/OnlineUser';
import { Text, View } from 'react-native';
export default function ChatRoom() {
  return (
    <View className={`h-[80%] bg-green-300 p-2`}>
      <View>
        <OnlineUser />
        <Text>Navigation Bar</Text>
      </View>
      <View>
        <Text>User Icon</Text>
      </View>
    </View>
  );
}
