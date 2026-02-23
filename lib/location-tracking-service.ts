import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

async function startBackgroundLocation() {
  const { status: foreground } = await Location.requestForegroundPermissionsAsync();
  if (foreground !== 'granted') {
    alert('Foreground permission needed');
    return;
  }

  const { status: background } = await Location.requestBackgroundPermissionsAsync();
  if (background !== 'granted') {
    alert('Background permission needed for continuous tracking');
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced, // or Highest
    timeInterval: 5000, // update ~every 5 seconds
    distanceInterval: 10, // or every 10 meters
    deferredUpdatesInterval: 1000,
    foregroundService: {
      notificationTitle: 'App is tracking your location',
      notificationBody: 'For safety / feature purposes',
    },
  });
}
