import CurrentUserLocation from '@/components/features/CurrentUserLocation';
import ChatRoom from '@/components/ui/ChatRoom';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function TabTwoScreen() {
  const { session } = useAuth();

  return (
    <SafeAreaView className={`flex-1 bg-pink-200`}>
      <CurrentUserLocation>
        <ChatRoom />
      </CurrentUserLocation>
    </SafeAreaView>
  );
}
