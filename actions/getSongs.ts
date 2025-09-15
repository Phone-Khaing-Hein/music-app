import { createServerSupabaseClient } from "@/lib/supabase-server";

import { Song } from "@/type";

const getSongs = async () : Promise<Song[]> => {
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.log('getSongs error:', error.message);
      return [];
    }

    return (data as any) || [];
};
    

export default getSongs;