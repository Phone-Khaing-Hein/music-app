import { createServerSupabaseClient } from "@/lib/supabase-server";

import { Song } from "@/type";
import getSongs from "./getSongs";

const getSongsByTitle = async (title: string) : Promise<Song[]> => {
    if(!title){
      const allSongs = await getSongs();
      return allSongs;
    }
    
    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .or(`title.ilike.%${title}%, author.ilike.%${title}%`)
      .order('created_at', { ascending: false });
   
    if(error){
      console.log('getSongsByTitle error:', error.message);
      return [];
    }

    return (data as any) || [];
};

export default getSongsByTitle;