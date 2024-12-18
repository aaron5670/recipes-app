import { ArrowLeft, Heart, Clock, Flame, Users, ChefHat, CheckCircle2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SingleRecipeScreen = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const recipeDetails = {
    name: 'Pizza Margherita',
    chef: 'Gordon Ramsay',
    image:
      'https://images.pexels.com/photos/17907810/pexels-photo-17907810/free-photo-of-pizza-italiaans-eten-maaltijd-vers.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description:
      'A classic Italian pasta dish with creamy egg sauce, crispy pancetta, and perfectly cooked pasta.',
    cookTime: '30 mins',
    servings: 4,
    calories: 650,
    difficulty: 'Intermediate',
    ingredients: [
      '400g spaghetti',
      '200g pancetta',
      '4 large eggs',
      '100g Pecorino Romano',
      '100g Parmesan',
      'Black pepper',
      'Salt',
    ],
    instructions: [
      'Bring a large pot of salted water to boil',
      'Crisp pancetta in a large skillet',
      'Whisk eggs and cheeses in a separate bowl',
      'Cook pasta until al dente',
      'Mix hot pasta with egg mixture, creating a creamy sauce',
      'Season with black pepper and serve immediately',
    ],
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity>
          <ArrowLeft color="#2C3E50" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
          <Heart
            color={isFavorite ? '#FF6B6B' : '#2C3E50'}
            size={24}
            fill={isFavorite ? '#FF6B6B' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Recipe Image */}
        <View className="mb-6">
          <Image source={{ uri: recipeDetails.image }} className="h-64 w-full rounded-2xl" />
        </View>

        {/* Recipe Title */}
        <View className="mb-4">
          <Text className="text-3xl font-bold text-gray-800">{recipeDetails.name}</Text>
          <Text className="mt-1 text-gray-500">by {recipeDetails.chef}</Text>
        </View>

        {/* Recipe Stats */}
        <View className="mb-6 flex-row justify-between rounded-xl bg-gray-100 p-4">
          <View className="items-center">
            <Clock color="#FF6B6B" size={24} />
            <Text className="mt-2 text-gray-700">{recipeDetails.cookTime}</Text>
          </View>
          <View className="items-center">
            <Flame color="#FF6B6B" size={24} />
            <Text className="mt-2 text-gray-700">{recipeDetails.calories} Cal</Text>
          </View>
          <View className="items-center">
            <Users color="#FF6B6B" size={24} />
            <Text className="mt-2 text-gray-700">{recipeDetails.servings} Servings</Text>
          </View>
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-lg text-gray-600">{recipeDetails.description}</Text>
        </View>

        {/* Ingredients */}
        <View className="mb-6">
          <Text className="mb-4 text-xl font-bold text-gray-800">Ingredients</Text>
          {recipeDetails.ingredients.map((ingredient, index) => (
            <View key={index} className="mb-3 flex-row items-center rounded-xl bg-gray-100 p-3">
              <CheckCircle2 color="#48BB78" size={20} className="mr-3" />
              <Text className="text-gray-700">{ingredient}</Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View className="mb-6">
          <Text className="mb-4 text-xl font-bold text-gray-800">Instructions</Text>
          {recipeDetails.instructions.map((step, index) => (
            <View key={index} className="mb-4 flex-row items-start">
              <Text className="mr-4 text-xl font-bold text-gray-400">{index + 1}.</Text>
              <Text className="flex-1 text-gray-700">{step}</Text>
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View className="mb-6 flex-row items-center rounded-xl bg-gray-100 p-4">
          <ChefHat color="#FF6B6B" size={24} className="mr-4" />
          <View>
            <Text className="font-bold text-gray-800">Difficulty</Text>
            <Text className="text-gray-600">{recipeDetails.difficulty}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Cook Button */}
      <View className="px-4 pb-4">
        <TouchableOpacity className="items-center rounded-xl bg-[#FF6B6B] p-4">
          <Text className="text-lg font-bold text-white">Start Cooking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SingleRecipeScreen;
