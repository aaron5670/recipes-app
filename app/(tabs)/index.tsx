import { router } from 'expo-router';
import { Search, User, ChevronRight, Flame } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '~/app/ctx';

// Sample recipe data
const featuredRecipes = [
  {
    id: '1',
    name: 'Hamburger Deluxe',
    chef: 'Gordon Ramsay',
    image:
      'https://images.pexels.com/photos/20722031/pexels-photo-20722031/free-photo-of-heet-pittig-warm-knap.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=1',
    calories: 650,
    time: '30 mins',
  },
  {
    id: '2',
    name: 'Pizza Margherita',
    chef: 'Ottolenghi',
    image:
      'https://images.pexels.com/photos/17907810/pexels-photo-17907810/free-photo-of-pizza-italiaans-eten-maaltijd-vers.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=1',
    calories: 450,
    time: '45 mins',
  },
];

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
  const { signOut } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Header */}
        <View className="mb-6 mt-4 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-800">Delicious</Text>
            <Text className="text-xl text-gray-500">Recipes</Text>
          </View>
          <Pressable onPress={() => setShowUserMenu(!showUserMenu)}>
            <User color="#2C3E50" size={24} />
            {showUserMenu && (
              <View className="absolute right-0 top-8 z-40 rounded-md bg-white px-4 py-2 shadow-lg">
                <TouchableOpacity
                  className="z-40"
                  onPress={() => {
                    signOut();
                    router.replace('/login');
                  }}>
                  <Text className="z-40 my-2 text-gray-700">Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="z-10 mb-6 flex-row items-center rounded-xl bg-gray-100 p-3">
          <Search color="#A0AEC0" size={20} className="z-10 mr-3" />
          <Text className="text-gray-500">Search recipes</Text>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <Text className="mb-4 text-xl font-bold text-gray-800">Categories</Text>
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
            <Text className="text-xl font-bold text-gray-800">Featured Recipes</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="mr-2 text-gray-500">See All</Text>
              <ChevronRight color="#A0AEC0" size={20} />
            </TouchableOpacity>
          </View>

          {featuredRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              className="mb-4 flex-row overflow-hidden rounded-xl bg-white shadow-md">
              <Image source={{ uri: recipe.image }} className="h-32 w-32" />
              <View className="flex-1 justify-between p-4">
                <View>
                  <Text className="text-lg font-bold text-gray-800">{recipe.name}</Text>
                  <Text className="text-gray-500">by {recipe.chef}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Flame color="#FF6B6B" size={16} />
                    <Text className="ml-2 text-gray-600">{recipe.calories} Cal</Text>
                  </View>
                  <Text className="text-gray-600">{recipe.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipesHomeScreen;
