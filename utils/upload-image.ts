import type { SupabaseClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';

export async function uploadImage(
  base64Image: string,
  userId: string,
  supabase: SupabaseClient
): Promise<string | null> {
  try {
    // Generate a unique filename with timestamp
    const timestamp = new Date().getTime();
    const filename = `${userId}/${timestamp}.png`; // Put the file in a folder named after the user ID

    // Upload the image
    const { error } = await supabase.storage
      .from(`food-images`)
      .upload(filename, decode(base64Image), {
        contentType: 'image/png',
        upsert: false, // Set to true if you want to allow overwriting files
      });

    if (error) throw error;

    // Get the public URL of the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from('food-images').getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
