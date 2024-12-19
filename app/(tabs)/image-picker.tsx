import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ImageUploadScreen = () => {
  const [image, setImage] = useState<string | null>();
  const [uploading, setUploading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setUploading(true);
        // Simulate upload delay
        setTimeout(() => {
          setImage(result.assets[0].uri);
          setUploading(false);
        }, 1500);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity>
          <FontAwesome6 name="arrow-left" iconStyle="solid" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Upload Recipe Photo</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-4">
        <View className="mb-6 mt-4 h-72 w-full overflow-hidden rounded-2xl bg-gray-100">
          {image ? (
            <Animated.View style={{ opacity: 1, flex: 1 }}>
              <Image source={{ uri: image }} className="h-full w-full" />
            </Animated.View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <FontAwesome6 name="image" iconStyle="solid" size={48} color="#A0AEC0" />
              <Text className="mt-4 text-center text-gray-500">
                Selected image will appear here
              </Text>
            </View>
          )}
        </View>

        <View className="mb-6">
          <Text className="text-center text-gray-600">
            Choose a high-quality image that best represents your recipe
          </Text>
        </View>

        <TouchableOpacity
          onPress={pickImage}
          disabled={uploading}
          className="items-center rounded-xl bg-[#FF6B6B] p-4">
          {uploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <View className="flex-row items-center">
              <FontAwesome6
                name="camera"
                iconStyle="solid"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="ml-2 text-lg font-bold text-white">
                {image ? 'Change Photo' : 'Select Photo'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {image ? (
          <View className="mt-6">
            <View className="flex-row items-center gap-3 rounded-xl bg-gray-100 p-4">
              <FontAwesome6 name="circle-check" iconStyle="solid" size={24} color="#48BB78" />
              <View>
                <Text className="font-bold text-gray-800">Image Selected</Text>
                <Text className="text-gray-600">Ready to proceed with your recipe</Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      {image ? (
        <View className="px-4 pb-4">
          <TouchableOpacity className="items-center rounded-xl bg-gray-800 p-4">
            <Text className="text-lg font-bold text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default ImageUploadScreen;
