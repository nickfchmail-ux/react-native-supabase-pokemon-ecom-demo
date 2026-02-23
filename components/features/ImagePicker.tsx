import { launchCameraAsync, PermissionStatus, useCameraPermissions } from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from 'react-native';
import OutlineButton from '../ui/OutlineButton';

export default function ImagePicker() {
  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
  const [pickedImage, setPickedImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  async function verifyPermission(): Promise<boolean> {
    if (cameraPermissionInformation?.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation?.status === PermissionStatus.DENIED) {
      Alert.alert('Insufficient Permission', 'You need to grant camera permission to take photos.');
      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    setIsLoading(true);

    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      setIsLoading(false);
      return;
    }

    try {
      const image = await launchCameraAsync({
        aspect: [16, 9],
        quality: 0.5,
      });

      if (!image.canceled && image.assets?.[0]?.uri) {
        setPickedImage(image.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  let imagePreview = <Text style={styles.noImageText}>No image taken yet</Text>;

  if (pickedImage) {
    imagePreview = (
      <Image source={{ uri: pickedImage }} style={styles.imagePreview} resizeMode="cover" />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.previewContainer}>
          {isLoading ? <ActivityIndicator size="large" color="#007AFF" /> : imagePreview}
        </View>

        <OutlineButton icon="camera" onPress={takeImageHandler} disabled={isLoading}>
          {isLoading ? 'Taking Photo...' : 'Take Photo'}
        </OutlineButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingTop: 20,
  },
  inner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    borderRadius: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
  },
  previewContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  noImageText: {
    color: '#888',
    fontSize: 16,
  },
});
