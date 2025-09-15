import { createServerSupabaseClient } from "@/lib/supabase-server";

import { Song } from "@/type";

const getLikedSongs = async () : Promise<Song[]> => {
    const supabase = createServerSupabaseClient();
    
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return [];
    }

    const { data, error } = await supabase
      .from('liked_songs')
      .select('*, songs(*)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.log('getLikedSongs error:', error);
      return [];
    }

    if(!data){
      return [];
    }

    return data.map((item) => ({
      ...item.songs
    })) as Song[];
};
    

export default getLikedSongs;