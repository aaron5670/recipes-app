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
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '~/utils/supabase';

type UploadType = 'meal' | 'recipe';

const ImageUploadScreen = () => {
  const [uploadType, setUploadType] = useState<UploadType>('meal');
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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        cameraType: CameraType.front,
        allowsEditing: true,
        base64: true,
        quality: 1,
      });

      if (!result.canceled) {
        setPreloading(true);
        const { data, error } = await supabase.functions.invoke('image-check', {
          body: {
            base64: result.assets[0]?.base64,
            type: uploadType,
          },
        });

        if (error) {
          Alert.alert('Error', 'Failed to check image');
          setPreloading(false);
          return;
        }

        if (data?.isFoodOrRecipe === false) {
          Alert.alert('Error', 'Geen voedsel of recept gedetecteerd');
          setPreloading(false);
          return;
        }

        if (data?.type === 'meal' || data?.type === 'recipe') {
          setUploadType(data.type);
        }

        setFoodName(data.name);
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setPreloading(false);
      setUploading(false);
    }
  };

  const generateRecipe = async () => {
    setUploading(true);
    if (!image) {
      Alert.alert('Error', 'Image not found');
    }

    const endpoint = uploadType === 'meal' ? 'recipe-from-meal' : 'recipe-from-image';
    const {
      data: { data },
      error,
    } = await supabase.functions.invoke(endpoint, {
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

  const SegmentedControl = () => (
    <View className="mb-0 mt-2 flex-row rounded-xl bg-gray-100 p-1">
      <Pressable
        onPress={() => {
          setUploadType('meal');
          setImage(null);
          setFoodName('');
        }}
        className={`flex-1 flex-row items-center justify-center rounded-lg py-3 ${
          uploadType === 'meal' ? 'bg-white shadow' : ''
        }`}>
        <FontAwesome6
          name="utensils"
          iconStyle="solid"
          size={16}
          color={uploadType === 'meal' ? '#FF6B6B' : '#4A5568'}
          className="mr-2"
        />
        <Text
          className={`ml-2 font-bold ${uploadType === 'meal' ? 'text-gray-800' : 'text-gray-500'}`}>
          Maaltijd
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setUploadType('recipe');
          setImage(null);
          setFoodName('');
        }}
        className={`flex-1 flex-row items-center justify-center rounded-lg py-3 ${
          uploadType === 'recipe' ? 'bg-white shadow' : ''
        }`}>
        <FontAwesome6
          name="book"
          iconStyle="solid"
          size={16}
          color={uploadType === 'recipe' ? '#FF6B6B' : '#4A5568'}
          className="mr-2"
        />
        <Text
          className={`ml-2 font-bold ${
            uploadType === 'recipe' ? 'text-gray-800' : 'text-gray-500'
          }`}>
          Recept
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={router.back}>
          <FontAwesome6 name="arrow-left" iconStyle="solid" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Genereeer een recept</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-4">
        <SegmentedControl />
        <Text className="mt-4 text-center text-gray-600">
          {uploadType === 'meal'
            ? 'Genereer een recept door een afbeelding van je gerecht te uploaden.'
            : 'Genereer een recept door een afbeelding van je recept te uploaden.'}
        </Text>

        <View className="mb-6 mt-4 h-72 w-full overflow-hidden rounded-2xl bg-gray-100">
          {image ? (
            <Animated.View style={{ opacity: 1, flex: 1 }}>
              <Image source={{ uri: image.uri }} className="h-full w-full" />
            </Animated.View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <FontAwesome6
                name={uploadType === 'meal' ? 'burger' : 'book-open'}
                iconStyle="solid"
                size={48}
                color="#A0AEC0"
              />
              <Text className="mt-4 px-5 text-center text-gray-500">
                De gekozen afbeelding zal hier verschijnen
              </Text>
            </View>
          )}
        </View>

        <View className="mb-6">
          <Text className="text-center text-gray-600">
            {uploadType === 'meal'
              ? 'Upload een afbeelding van hoge kwaliteit die je gerecht het beste weergeeft.'
              : 'Upload een afbeelding van hoge kwailteit die je recept het beste weergeeft.'}
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
                {image ? 'Verander afbeelding' : 'Selecteer een afbeelding'}
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
              <Text className="text-lg font-bold text-white">
                ✨ {uploadType === 'meal' ? 'Genereer recept' : 'Verwerk recept'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default ImageUploadScreen;
