import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import * as ImagePicker from 'expo-image-picker';
import { CameraType, ImagePickerAsset } from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '~/utils/supabase';

const ImageUploadScreen = () => {
  const [image, setImage] = useState<ImagePickerAsset | null>();
  const [uploading, setUploading] = useState(false);
  const [preloading, setPreloading] = useState(false);
  const [foodName, setFoodName] = useState('');

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
      setPreloading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        cameraType: CameraType.front,
        allowsEditing: true,
        base64: true,
        quality: 1,
      });

      if (!result.canceled) {
        const { data, error } = await supabase.functions.invoke('food-check', {
          body: { base64: result.assets[0]?.base64 },
        });

        if (error) {
          Alert.alert('Error', 'Failed to detect food');
          setPreloading(false);
          return;
        }

        if (data?.isFood === false) {
          Alert.alert('Error', 'No food detected in the image');
          setPreloading(false);
          return;
        }

        setImage(result.assets[0]);
        setFoodName(data.name);
        setPreloading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      setPreloading(false);
      setUploading(false);
    }
  };

  const generateRecipe = async () => {
    setUploading(true);
    if (!image) {
      Alert.alert('Error', 'Image not found');
    }

    const {
      data: { data },
      error,
    } = await supabase.functions.invoke('recipes', {
      body: { base64: image?.base64 },
    });

    if (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Failed to generate recipe');
      setUploading(false);
      return;
    }

    setUploading(false);
    router.replace(`/${data.recipeId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={router.back}>
          <FontAwesome6 name="arrow-left" iconStyle="solid" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Upload een gerecht</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-4">
        <View className="mb-6 mt-4 h-72 w-full overflow-hidden rounded-2xl bg-gray-100">
          {image ? (
            <Animated.View style={{ opacity: 1, flex: 1 }}>
              <Image source={{ uri: image.uri }} className="h-full w-full" />
            </Animated.View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <FontAwesome6 name="image" iconStyle="solid" size={48} color="#A0AEC0" />
              <Text className="mt-4 text-center text-gray-500">
                De gekozen afbeelding zal hier verschijnen
              </Text>
            </View>
          )}
        </View>

        <View className="mb-6">
          <Text className="text-center text-gray-600">
            Kies een afbeelding van hoge kwaliteit die je gerecht het beste weergeeft.
          </Text>
        </View>

        <TouchableOpacity
          onPress={pickImage}
          disabled={preloading || uploading}
          className="items-center rounded-xl bg-[#FF6B6B] p-4">
          {preloading ? (
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

        {image && !preloading ? (
          <View className="mt-6">
            <View className="flex-row items-center gap-3 rounded-xl bg-gray-100 p-4">
              <FontAwesome6 name="circle-check" iconStyle="solid" size={24} color="#48BB78" />
              <View>
                <Text className="font-bold text-gray-800">{foodName}</Text>
                <Text className="text-gray-600">Klaar om je recept te genereren.</Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      {image && !preloading ? (
        <View className="px-4 pb-4">
          <TouchableOpacity
            className="items-center rounded-xl bg-gray-800 p-4"
            onPress={generateRecipe}
            disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-bold text-white">✨ Genereer recept</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default ImageUploadScreen;
