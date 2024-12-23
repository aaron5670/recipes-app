import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Link, router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '~/components/ctx';
import { Tables } from '~/types/database.types';
import { supabase } from '~/utils/supabase';

const categories = [
  { id: '1', name: 'Breakfast', icon: '🍳' },
  { id: '2', name: 'Lunch', icon: '🥗' },
  { id: '3', name: 'Dinner', icon: '🍽️' },
  { id: '4', name: 'Dessert', icon: '🍰' },
  { id: '5', name: 'Drinks', icon: '🍹' },
  { id: '6', name: 'Snacks', icon: '🍿' },
  { id: '7', name: 'Sides', icon: '🍚' },
  { id: '8', name: 'Appetizers', icon: '🍤' },
  { id: '9', name: 'Salads', icon: '🥦' },
];

const RecipesHomeScreen = () => {
  const { signOut, session } = useSession();
  const insets = useSafeAreaInsets();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [recipes, setRecipes] = useState<Tables<'recipes'>[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select()
      .order('created_at', { ascending: false });

    if ((error && error.message) || !data) {
      console.error('Error fetching recipes:', error.message);
      Alert.alert('Error fetching recipes');
      return;
    }

    setRecipes(data);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getRecipes();
    } catch (error) {
      console.error('Error refreshing recipes:', error);
      Alert.alert('Error refreshing recipes');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleLogout = () => {
    setShowUserMenu(false);
    signOut();
    router.replace('/login');
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#EF4444"
            colors={['#EF4444']}
          />
        }>
        {/* Header */}
        <View className="mb-6 mt-4 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-800">
              Hey {session?.user_metadata.full_name}! 👋
            </Text>
            <Text className="text-xl text-gray-500">Recepten</Text>
          </View>
          <View>
            <Pressable onPress={() => setShowUserMenu(true)}>
              <FontAwesome6
                name="user"
                iconStyle="solid"
                size={24}
                color="#2C3E50"
                className="mr-3"
              />
            </Pressable>
          </View>
        </View>

        <Modal
          visible={showUserMenu}
          transparent
          animationType="fade"
          onRequestClose={() => setShowUserMenu(false)}>
          <View className="flex-1 bg-black/10">
            <Pressable className="flex-1" onPress={() => setShowUserMenu(false)}>
              <View
                style={{
                  position: 'absolute',
                  right: 12,
                  top: insets.top + 35, // Account for safe area + header spacing
                }}>
                <View className="rounded-lg bg-white shadow-xl">
                  <TouchableOpacity className="px-6 py-2" onPress={handleLogout}>
                    <Text className="text-sm font-medium text-gray-700">Uitloggen</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </View>
        </Modal>

        {/* Search Bar */}
        <View className="mb-6 flex-row items-center gap-3 rounded-xl bg-gray-100 p-3">
          <FontAwesome6
            name="utensils"
            iconStyle="solid"
            size={20}
            color="#A0AEC0"
            className="mr-3"
          />
          <Text className="text-gray-500">Recepten zoeken</Text>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <Text className="mb-4 text-xl font-bold text-gray-800">Categorieën</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-7">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="items-center rounded-xl bg-gray-100 p-3"
                style={{ marginRight: 10 }}>
                <Text className="text-2xl">{category.icon}</Text>
                <Text className="mt-2 text-gray-700">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Recipes */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-800">Nieuwe recepten</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="mr-2 text-gray-500">Bekijk alles</Text>
              <FontAwesome6
                name="chevron-right"
                iconStyle="solid"
                size={20}
                color="#A0AEC0"
                className="mr-3"
              />
            </TouchableOpacity>
          </View>

          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/${recipe.id}`} asChild>
              <TouchableOpacity className="mb-4 flex-row overflow-hidden rounded-xl bg-white shadow-md">
                <Image source={{ uri: recipe.image_url as string }} className="h-32 w-32" />
                <View className="flex-1 justify-between p-4">
                  <View>
                    <Text className="text-lg font-bold text-gray-800">{recipe.name}</Text>
                    <Text className="text-gray-500">by {recipe.chef}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <FontAwesome6
                        name="fire"
                        iconStyle="solid"
                        size={16}
                        color="#FF6B6B"
                        className="mr-2"
                      />
                      <Text className="ml-2 text-gray-600">{recipe.calories} Cal</Text>
                    </View>
                    <Text className="text-gray-600">{recipe.cook_time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ScrollView>

      {/* Create Recipe Button */}
      <View
        style={{
          paddingBottom: insets.bottom + 8, // Ensure the button is above the safe area
          paddingTop: 8,
          paddingHorizontal: 16,
        }}
        className="bg-white shadow-md">
        <Link href="/image-picker" asChild>
          <TouchableOpacity className="items-center rounded-xl bg-[#FF6B6B] p-4">
            <View className="flex-row items-center">
              <FontAwesome6
                name="camera"
                iconStyle="solid"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="ml-2 text-lg font-bold text-white">Nieuw recept</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default RecipesHomeScreen;
