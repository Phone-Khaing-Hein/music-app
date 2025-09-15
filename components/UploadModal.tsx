'use client';

import uniqid from "uniqid";
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';

import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const UploadModal = () => {

    const [ isLoading, setIsloading ] = useState(false);
    const uploadModal = useUploadModal();
    const { user } = useUser();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset
     } = useForm<FieldValues>({
        defaultValues:{
            author: '',
            title: '',
            song: null,
            image: null
        }
    });
    const onChange = (open: boolean) => {
        if(!open){
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        //error
        try{
            setIsloading(true);

            const imageFile = values.image?.[0];
            const songFIle = values.song?.[0];

            if(!imageFile || !songFIle || !user){
                toast.error("Missing fields");
                return;
            }

            const uniqueId = uniqid();

            //upload song
            const {
                data: songData,
                error: songError,
            }  = await supabase
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uniqueId}`, songFIle, {
                    cacheControl: '3600',
                    upsert:false
            });

            if(songError){
                setIsloading(false);
                return toast.error("Failed song upload.");
            }

            //upload image
            const {
                data: imageData,
                error: imageError,
            }  = await supabase
                .storage
                .from('images')
                .upload(`image-${values.title}-${uniqueId}`, imageFile, {
                    cacheControl: '3600',
                    upsert:false
            });

            if(imageError){
                setIsloading(false);
                return toast.error("Failed image upload.");
            }

            const {
                error: supabaseError
            }  = await supabase
            .from('songs')
            .insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                image_path: imageData.path,
                song_path: songData.path
            });

            if(supabaseError){
                setIsloading(false);
                return toast.error(supabaseError.message);
            }

            router.refresh();
            setIsloading(false);
            toast.success("Song created!");
            reset();
            uploadModal.onClose();

        }catch(error){
            toast.error("Something went wrong");
        }finally{
            setIsloading(false);
        }

    }

    return ( 
        <Modal 
            title='Add a song'
            description='Upload an mp3 file'
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <Input
                    id="title"
                    disabled={isLoading}
                    {...register('title', { required: true })}
                    placeholder="Song title"
                />
                <Input
                    id="author"
                    disabled={isLoading}
                    {...register('author', { required: true })}
                    placeholder="Song author"
                />
                <div>
                    <div className='pb-1'> Select a song file </div>
                    <Input
                        id="song"
                        type='file'
                        disabled={isLoading}
                        {...register('song', { required: true })}
                        accept='.mp3'
                    />
                </div>
                <div>
                    <div className="pb-1">Select an image</div>
                    <Input
                        id="image"
                        type='file'
                        disabled={isLoading}
                        {...register('image', { required: true })}
                        accept='image/*'
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    Create
                </Button>
            </form>
        </Modal>
     );
}
 
export default UploadModal;