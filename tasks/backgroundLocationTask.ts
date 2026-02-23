import { getCurrentUserId } from '@/lib/data-service';
import { supabase } from '@/utils/supabase'; // Use the one with url-polyfill
import * as Location from 'expo-location'; // For LocationObject type
import * as TaskManager from 'expo-task-manager';

export const LOCATION_TASK_NAME = 'background-location-task';

const MIN_DISTANCE_METERS = 10;

// Store the last saved location to calculate distance
let lastSavedLatitude: number | null = null;
let lastSavedLongitude: number | null = null;

/**
 * Calculate distance between two coordinates using the Haversine formula.
 * Returns distance in meters.
 */
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Define the expected shape of data passed to the task
interface LocationTaskData {
  locations: Location.LocationObject[];
}

// Define the task
TaskManager.defineTask<LocationTaskData>(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background task error:', error);
    return;
  }

  if (data) {
    const { locations } = data;
  }

  if (data && data.locations.length > 0) {
    try {
      // Safely access the most recent location
      const loc: Location.LocationObject = data.locations[data.locations.length - 1];
      const { latitude, longitude, accuracy } = loc.coords;

      // Skip if moved less than 10 meters from last saved location
      if (lastSavedLatitude !== null && lastSavedLongitude !== null) {
        const distance = getDistanceInMeters(
          lastSavedLatitude,
          lastSavedLongitude,
          latitude,
          longitude
        );

        if (distance < MIN_DISTANCE_METERS) {
          return;
        }
      }

      let userId = getCurrentUserId();

      // 1. Try memory (might be null in bg task)
      if (!userId) {
        try {
          // Import AsyncStorage dynamically to ensure it's available in the headless context
          const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
          userId = await AsyncStorage.getItem('current_user_id');
          if (userId) console.log('User ID retrieved from storage:', userId);
          else console.log('User ID not found in storage');
        } catch (storageErr) {
          console.error('Failed to read from storage:', storageErr);
        }
      }

      // 3. Fallback to Supabase session (refreshes token if needed)
      if (!userId) {
        try {
          // Try getSession first
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            console.error('Error fetching session:', sessionError);
          }

          if (session?.user) {
            userId = session.user.id;
          } else {
            // Fallback to getUser which might trigger a refresh

            try {
              // Check if we have a session in storage before calling getUser to avoid AuthSessionMissingError
              const {
                data: { session: currentSession },
              } = await supabase.auth.getSession();
              if (currentSession) {
                const {
                  data: { user },
                  error: userError,
                } = await supabase.auth.getUser();
                if (userError) console.error('Error fetching user:', userError);

                if (user) {
                  userId = user.id;
                }
              } else {
                console.log('Skipping getUser() because no session exists in storage.');
              }
            } catch (getUserEx) {
              console.error('Exception during getUser:', getUserEx);
            }
          }
        } catch (e) {
          console.error('Exception fetching session/user:', e);
        }
      }

      // 4. Ensure there is a valid session for RLS before inserting
      // Even if we got the ID from storage, the request will fail RLS if the auth header is missing/expired
      let finalSession = null;
      try {
        const {
          data: { session: activeSession },
        } = await supabase.auth.getSession();
        finalSession = activeSession;

        if (!activeSession) {
          console.warn(
            'No active Supabase session found in background task. RLS will likely fail.'
          );
          // Force a refresh if possible
          try {
            // Only try to refresh if we have a refresh token in storage
            const {
              data: { session: currentSession },
            } = await supabase.auth.getSession();
            if (currentSession) {
              const {
                data: { session: refreshedSession },
                error: refreshError,
              } = await supabase.auth.refreshSession();
              if (refreshError || !refreshedSession) {
              } else {
                finalSession = refreshedSession;
              }
            } else {
            }
          } catch (refreshEx) {}
        }
      } catch (e) {
        console.error('Exception checking/refreshing session:', e);
      }

      const effectiveUserId = finalSession?.user?.id || userId;

      if (!effectiveUserId) {
        console.warn('CRITICAL: No user ID available in background -> skipping insert');
        return;
      }

      // If we have an effectiveUserId but no finalSession, we can still try to insert
      // if RLS allows inserts based on the user_id column matching the JWT, but without
      // a valid JWT (session), Supabase will treat it as an anonymous request.
      // If your RLS requires an authenticated user, this will fail.

      // 5. Update user location

      // Use a timeout to prevent the network request from hanging when backgrounded.
      // Remove .select() to avoid waiting for a response body — we only need the insert to go through.
      const insertPromise = supabase.from('user_locations').insert({
        user_id: effectiveUserId,
        latitude,
        longitude,
        accuracy,
        timestamp: new Date().toISOString(),
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Insert timed out after 10s')), 10000)
      );

      try {
        const { error: insertError } = (await Promise.race([insertPromise, timeoutPromise])) as any;
        if (insertError) {
          console.error('Supabase save failed:', JSON.stringify(insertError, null, 2));
        } else {
          lastSavedLatitude = latitude;
          lastSavedLongitude = longitude;
        }
      } catch (timeoutErr) {
        console.error('[Task] Insert request timed out or failed:', timeoutErr);
      }

      return;
    } catch (err) {
      console.error('Error in background task:', err);
      return;
    }
  }
});
