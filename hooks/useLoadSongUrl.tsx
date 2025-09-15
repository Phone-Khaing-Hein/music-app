import { Song } from "@/type";
import { supabase } from "@/lib/supabase";

const useLoadSongUrl =( song: Song ) => {
   if(!song){
    return '';
   }

   const { data : songData } = supabase
   .storage
   .from('songs')
   .getPublicUrl(song.song_path);

   return songData.publicUrl;
}
 
export default useLoadSongUrl;