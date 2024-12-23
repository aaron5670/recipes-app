import type { SupabaseClient } from 'npm:@supabase/supabase-js';

import type { Tables } from '../../../types/database.types.ts';

interface RecipeInput {
  name: string;
  description: string;
  cookTime: string;
  servings: number;
  calories: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
}

interface InsertResult {
  success: boolean;
  recipeId?: number;
  error?: string;
}

export async function insertRecipe(
  recipeData: RecipeInput,
  imageUrl: string | null,
  supabase: SupabaseClient
): Promise<InsertResult> {
  const user = await supabase.auth.getUser();
  const userId = user?.data.user?.id;

  // get the user from the users table based on user_id
  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('full_name, id')
    .eq('user_id', userId)
    .single();

  if (userDataError) throw userDataError;

  try {
    // First, insert the recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        user_id: userData.id,
        name: recipeData.name,
        description: recipeData.description,
        cook_time: recipeData.cookTime,
        servings: recipeData.servings,
        calories: recipeData.calories,
        difficulty: recipeData.difficulty,
        chef: userData?.full_name || 'Unknown Chef',
        image_url: imageUrl, // Now we use the uploaded image URL
        is_public: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (recipeError) throw recipeError;

    // Type assertion since we know recipe exists at this point
    const recipeResult: Tables<'recipes'> = recipe;

    // Insert ingredients
    const ingredientsToInsert: Omit<Tables<'ingredients'>, 'id'>[] = recipeData.ingredients.map(
      (ingredient) => ({
        recipe_id: recipeResult.id,
        name: ingredient,
      })
    );

    const { error: ingredientsError } = await supabase
      .from('ingredients')
      .insert(ingredientsToInsert);

    if (ingredientsError) throw ingredientsError;

    // Insert instructions
    const instructionsToInsert: Omit<Tables<'instructions'>, 'id'>[] = recipeData.instructions.map(
      (instruction, index) => ({
        recipe_id: recipeResult.id,
        step_number: index + 1,
        description: instruction,
      })
    );

    const { error: instructionsError } = await supabase
      .from('instructions')
      .insert(instructionsToInsert);

    if (instructionsError) throw instructionsError;

    return { success: true, recipeId: recipeResult.id };
  } catch (error) {
    console.error('Error inserting recipe:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
