import { getCurrentPositionAsync, PermissionStatus, useForegroundPermissions } from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

import { setPickedLocation } from '@/states/global/redux-locationSlice';
import { RootState } from '@/states/global/redux-store';
import { getMapPreview } from '@/utils/location';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import OutlineButton from '../ui/OutlineButton';

type LocationPickerProps = {};

export default function LocationPicker(Props: LocationPickerProps) {
  const [locationPermissionInformation, requestPermission] = useForegroundPermissions();
  const [pickedLocation, setPickedLocationLocal] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const dispatch = useDispatch();
  const locationFromMap = useSelector((state: RootState) => state.location.pickedLocation);

  useEffect(() => {
    if (locationFromMap) {
      setPickedLocationLocal(locationFromMap);
      dispatch(setPickedLocation(null)); // clear after consuming
    }
  }, [locationFromMap]);
  async function verifyPermission() {
    if (locationPermissionInformation?.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (locationPermissionInformation?.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permission',
        'You have to grant location permission to use this app.'
      );
      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermission();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    const coords = { lat: location.coords.latitude, lng: location.coords.longitude };
    setPickedLocationLocal(coords);
  }

  function pickOnMapHandler() {
    router.push('/screens/map');
  }

  let locationPreview = <Text>No location picked yet</Text>;

  if (pickedLocation) {
    const mapUrl = getMapPreview({ lat: pickedLocation.lat, lng: pickedLocation.lng });
    locationPreview = (
      <Image
        style={{ width: '100%', height: '100%' }}
        source={{ uri: mapUrl }}
        onError={(e) => console.log('[LocationPicker] Image error:', e.nativeEvent.error)}
        onLoad={() => console.log('[LocationPicker] Image loaded successfully')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View
        className={`my-[8px] h-[200px] w-full items-center justify-center rounded-sm bg-slate-400`}>
        {locationPreview}
      </View>
      <View className={`flex flex-row items-center justify-around`}>
        <OutlineButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlineButton>
        <OutlineButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlineButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
});
