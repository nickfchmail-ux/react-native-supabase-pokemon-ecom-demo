import OutlineButton from '@/components/ui/OutlineButton';
import { setPickedLocation } from '@/states/global/redux-locationSlice';
import { router, useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import MapView, { ClickEvent, Marker } from 'react-native-maps';
import { useDispatch } from 'react-redux';
type MapProps = {};

export default function Map(Props: MapProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>();
  const region = {
    latitude: 22.3193,
    longitude: 114.1694,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const navigation = useNavigation();
  const dispatch = useDispatch();
  function selectionLocationHandler(event: ClickEvent) {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat: lat, lng: lng });
  }

  const savePickedLocaionHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        'No Location Picked',
        'You have to pick a location (by tapping on the map) first.'
      );
      return;
    }

    dispatch(setPickedLocation(selectedLocation!));
    router.back();
  }, [navigation, selectedLocation, dispatch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <OutlineButton icon="save" size={24} color={tintColor} onPress={savePickedLocaionHandler} />
      ),
    });
  }, [navigation, savePickedLocaionHandler]);

  return (
    <View style={styles.container}>
      <MapView style={{ flex: 1 }} initialRegion={region} onPress={selectionLocationHandler}>
        {selectedLocation && (
          <Marker
            title="Picked Location"
            coordinate={{ latitude: selectedLocation?.lat, longitude: selectedLocation?.lng }}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
});
