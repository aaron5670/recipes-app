import { createOpenAI } from '@ai-sdk/openai';
import { createClient } from '@supabase/supabase-js';
import { generateObject } from 'ai';
import { z } from 'zod';

import { Database } from '~/types/database.types';
import { insertRecipe } from '~/utils/insert-recipe';
import { uploadImage } from '~/utils/upload-image';

const openai = createOpenAI({
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
});

const schema = z.object({
  name: z.string(),
  description: z.string(),
  cookTime: z.string(),
  servings: z.number(),
  calories: z.number(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
});

export async function POST(request: Request) {
  const body = await request.json();
  const image = body.base64;
  const accessToken = body.accessToken;

  if (!accessToken) {
    return Response.json({ error: 'Access token not provided' }, { status: 400 });
  }

  if (!image) {
    return Response.json({ error: 'Image not provided' }, { status: 400 });
  }

  const supabase = createClient<Database>(
    process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );

  try {
    // Upload the image first, passing the userId
    const imageUrl = await uploadImage(image, '30330c5d-6323-4f7d-a62d-368c3c2b6be8', supabase);

    if (!imageUrl) {
      return Response.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // Generate the recipe using OpenAI
    const result = await generateObject({
      model: openai('gpt-4o-2024-08-06', {
        structuredOutputs: true,
      }),
      system: 'Genereer een recept op basis van de meegeleverde afbeelding.',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Genereer een recept op basis van de meegeleverde afbeelding.' },
            {
              type: 'image',
              image,
              experimental_providerMetadata: {
                openai: { imageDetail: 'low' },
              },
            },
          ],
        },
      ],
      schemaName: 'recipe',
      schemaDescription: 'A detailed recipe with ingredients and instructions.',
      schema,
    });

    // Insert the recipe with the image URL
    const data = await insertRecipe(result.object, imageUrl, supabase);

    return Response.json({ data });
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json(
      {
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
