import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { setOnlineUser } from '@/states/global/redux-onlineUserSlice';
import { RootState } from '@/states/global/redux-store';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function OnlineUser() {
  const dispatch = useDispatch();
  const currentChannelRef: React.RefObject<null | RealtimeChannel> = useRef(null);
  const currentOnlineUser = useSelector((state: RootState) => state.onlineUser);
  const { session } = useAuth();

  useEffect(() => {
    // Debug: verify the Supabase URL is correct
    console.log('[OnlineUser] Supabase URL available:', !!process.env.EXPO_PUBLIC_SUPABASE_URL);
    console.log(
      '[OnlineUser] Supabase URL:',
      process.env.EXPO_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
    );

    const channel = supabase.channel('visitor-broadcast', {
      config: {
        broadcast: { self: true, ack: true },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const count = Object.keys(state).length;
      console.log('Presence state:', JSON.stringify(state, null, 2));
      console.log('Online count:', count);
      dispatch(setOnlineUser(count));
    });

    channel.subscribe(async (status) => {
      console.log('[OnlineUser] Channel status:', status);
      if (status === 'SUBSCRIBED') {
        const trackResult = await channel.track({ online: true, user: session?.user?.id });
        console.log('[OnlineUser] Track result:', trackResult);
      }
    });

    currentChannelRef.current = channel;
    return () => {
      if (!currentChannelRef.current) {
        return;
      }

      currentChannelRef.current?.untrack();
      supabase.removeChannel(currentChannelRef.current);
    };
  }, [dispatch]);

  return (
    <View>
      <Text>{currentOnlineUser.online}</Text>
    </View>
  );
}
