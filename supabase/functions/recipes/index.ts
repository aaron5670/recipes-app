import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createOpenAI } from 'npm:@ai-sdk/openai';
import { createClient } from 'npm:@supabase/supabase-js';
import { generateObject } from 'npm:ai';
import { z } from 'npm:zod';

import type { Database } from '../../../types/database.types.ts';
import { insertRecipe } from '../shared/insert-recipe.ts';
import { uploadImage } from '../shared/upload-image.ts';

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

Deno.serve(async (request) => {
  const body = await request.json();
  const image = body.base64;
  const accessToken = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!image) {
    return Response.json({ error: 'Image not provided' }, { status: 400 });
  }

  const supabase = createClient<Database>(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_ANON_KEY') || '',
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
    console.error('Error generating recipe:', error);
    return Response.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
});
