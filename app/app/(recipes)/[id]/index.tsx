import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecipeDetailSkeleton } from '~/components/RecipeDetailSkeleton';
import type { Tables } from '~/types/database.types';
import { supabase } from '~/utils/supabase';

type RecipeWithIngredientsAndInstructions = Tables<'recipes'> & {
  ingredients: Tables<'ingredients'>[];
  instructions: Tables<'instructions'>[];
};

const SingleRecipeScreen = () => {
  const { id } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [recipe, setRecipe] = useState<RecipeWithIngredientsAndInstructions | null>(null);

  useEffect(() => {
    const getRecipeDetails = async () => {
      const recipesQuery = supabase
        .from('recipes')
        .select(
          `
            name,
            chef,
            image_url,
            description,
            cook_time,
            servings,
            calories,
            difficulty,
            created_at,
            ingredients (
              name
            ),
            instructions (
              step_number,
              description
            )
          `
        )
        .eq('id', id)
        .single();

      const { data: recipe, error } = await recipesQuery;

      if (error) {
        console.error('Error fetching recipe details:', error);
        Alert.alert('Error retrieving recipe details. Please try again later.');
        return;
      }

      setRecipe(recipe as RecipeWithIngredientsAndInstructions);
    };

    getRecipeDetails();
  }, []);

  if (!recipe) {
    return <RecipeDetailSkeleton />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={router.back}>
          <FontAwesome6 name="arrow-left" iconStyle="solid" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
          <FontAwesome6
            name="heart"
            iconStyle="solid"
            size={24}
            color={isFavorite ? '#FF6B6B' : '#2C3E50'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Recipe Image */}
        <View className="mb-6">
          <Image source={{ uri: recipe.image_url as string }} className="h-64 w-full rounded-2xl" />
        </View>

        {/* Recipe Title */}
        <View className="mb-4">
          <Text className="text-3xl font-bold text-gray-800">{recipe.name}</Text>
          <Text className="mt-1 text-gray-500">Bij {recipe.chef}</Text>
        </View>

        {/* Recipe Stats */}
        <View className="mb-6 flex-row justify-between rounded-xl bg-gray-100 p-4">
          <View className="items-center">
            <FontAwesome6 name="clock" iconStyle="solid" size={24} color="#FF6B6B" />
            <Text className="mt-2 text-gray-700">{recipe.cook_time}</Text>
          </View>
          <View className="items-center">
            <FontAwesome6 name="fire" iconStyle="solid" size={24} color="#FF6B6B" />
            <Text className="mt-2 text-gray-700">{recipe.calories} cal.</Text>
          </View>
          <View className="items-center">
            <FontAwesome6 name="users" iconStyle="solid" size={24} color="#FF6B6B" />
            <Text className="mt-2 text-gray-700">{recipe.servings} porties</Text>
          </View>
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-lg text-gray-600">{recipe.description}</Text>
        </View>

        {/* Ingredients */}
        <View className="mb-6">
          <Text className="mb-4 text-xl font-bold text-gray-800">Ingrediënten</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View
              key={index}
              className="mb-3 flex-row items-center gap-2 rounded-xl bg-gray-100 p-3">
              <FontAwesome6 name="check" iconStyle="solid" size={20} color="#48BB78" />
              <Text className="text-gray-700">{ingredient.name}</Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View className="mb-6">
          <Text className="mb-4 text-xl font-bold text-gray-800">Instructies</Text>
          {recipe.instructions.map((step, index) => (
            <View key={index} className="mb-4 flex-row items-start">
              <Text className="mr-4 text-xl font-bold text-gray-400">{step.step_number}.</Text>
              <Text className="flex-1 text-gray-700">{step.description}</Text>
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View className="mb-6 flex-row items-center gap-3 rounded-xl bg-gray-100 p-4">
          <FontAwesome6 name="utensils" iconStyle="solid" size={24} color="#FF6B6B" />
          <View>
            <Text className="font-bold text-gray-800">Moeilijkheidsgraad</Text>
            <Text className="text-gray-600">{recipe.difficulty}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Cook Button */}
      <View className="px-4 pb-4">
        <TouchableOpacity className="items-center rounded-xl bg-[#FF6B6B] p-4">
          <Text className="text-lg font-bold text-white">Start met koken</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SingleRecipeScreen;
