import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createOpenAI } from 'npm:@ai-sdk/openai';
import { createClient } from 'npm:@supabase/supabase-js';
import { generateObject } from 'npm:ai';
import { z } from 'npm:zod';

import type { Database } from '../../../types/database.types.ts';

const openai = createOpenAI({
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
});

const schema = z.object({
  name: z.string(),
  isFood: z.boolean(),
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
    // Generate the recipe using OpenAI
    const result = await generateObject({
      model: openai('gpt-4o-2024-08-06', {
        structuredOutputs: true,
      }),
      system: 'Controleer of de gegeven afbeelding voedsel bevat.',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Genereer de naam van het recept als de meegegeven afbeelding voedsel bevat.' },
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
      schemaName: 'foodCheck',
      schemaDescription: 'A schema to check if the given image is food',
      schema,
    });

    return Response.json({
      isFood: result.object.isFood,
      name: result.object.name,
    });
  } catch (error) {
    console.error('Error checking food:', error);
    return Response.json({ error: 'Failed to check food' }, { status: 500 });
  }
});
