import * as Location from 'expo-location';
import * as React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';

export default function CurrentUserLocation({ children }: React.PropsWithChildren) {
  const [isTracking, setIsTracking] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    let mounted = true;

    const setup = async () => {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();

      if (fgStatus !== 'granted') {
        setErrorMsg('Foreground location permission denied');
        return;
      }

      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

      if (bgStatus !== 'granted') {
        setErrorMsg('Background location permission denied – tracking limited to foreground');
      }

      // 3. Start background updates if not already running
      const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

      if (alreadyRunning) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }

      try {
        // Critical for Android background service (foreground service notification)
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          // Use Balanced accuracy for better battery life and reliability in background
          accuracy: Location.Accuracy.Balanced,
          // Use 30000ms (30 seconds) to avoid OS throttling
          timeInterval: 30000,
          // Use 0 distance to force time-based updates even if stationary
          distanceInterval: 10,
          // Critical: Disable deferred updates
          deferredUpdatesInterval: 0,
          foregroundService: {
            notificationTitle: 'Location Tracking Active',
            notificationBody: 'App is monitoring your position.',
            notificationColor: '#FF6347',
            killServiceOnDestroy: false, // Keep running even if app is killed
          },
          pausesUpdatesAutomatically: false,
          showsBackgroundLocationIndicator: true, // iOS
          // Android specific: ensures the location service runs as a foreground service properly
          activityType: Location.ActivityType.AutomotiveNavigation,
        });

        if (mounted) setIsTracking(true);
      } catch (err) {
        setErrorMsg('Could not start background tracking');
      }

      // 4. Optional: foreground live listener for immediate UI updates
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          if (mounted) setCurrentLocation(loc);
        }
      );
    };

    setup();

    return () => {
      mounted = false;
      if (locationSubscription) locationSubscription.remove();
      // Uncomment if you want to stop background on unmount (careful – may not be desired)
      // Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(console.error);
    };
  }, []);

  const displayedLat = currentLocation?.coords.latitude;
  const displayedLong = currentLocation?.coords.longitude;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Current Location</Text>

      {errorMsg ? (
        <Text style={{ color: 'red' }}>{errorMsg}</Text>
      ) : isTracking ? (
        <Text>Tracking active (background + foreground)</Text>
      ) : (
        <ActivityIndicator size="small" />
      )}

      <Text>Latitude: {displayedLat?.toFixed(6)}</Text>
      <Text>Longitude: {displayedLong?.toFixed(6)}</Text>

      {children}
    </View>
  );
}
