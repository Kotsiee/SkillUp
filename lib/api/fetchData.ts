import { getSupabaseClient } from "../supabase/client.ts";

export async function getFileUrl(filePath: string) {
    const { data } = await getSupabaseClient()
      .storage
      .from('user_uploads')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
}