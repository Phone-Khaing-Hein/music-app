import { createServerSupabaseClient } from "@/lib/supabase-server";

import { Song } from "@/type";

const getSongsByUserId = async () : Promise<Song[]> => {
    const supabase = createServerSupabaseClient();
    
    const { 
        data: sessionData,
        error: sessionError
      } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session?.user.id) {
        console.log('getSongsByUserId session error:', sessionError?.message || 'No user session');
        return[]
      }

    const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('user_id', sessionData.session.user.id)
    .order('created_at', { ascending: false })
 
    if(error){
      console.log('getSongsByUserId error:', error.message);
      return [];
    }

    return (data as any) || [];
};

export default getSongsByUserId;