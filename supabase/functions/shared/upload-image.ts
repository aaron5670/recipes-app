import type { SupabaseClient } from 'npm:@supabase/supabase-js';
import { decode } from 'npm:base64-arraybuffer';

export async function uploadImage(
  base64Image: string,
  supabase: SupabaseClient
): Promise<string | null> {
  try {
    // Generate a unique filename with timestamp
    const timestamp = new Date().getTime();

    // Get the user ID
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;

    // Put the file in a folder named after the user ID
    const filename = `${userId}/${timestamp}.png`;

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
