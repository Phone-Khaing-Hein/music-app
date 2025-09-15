'use client';

import uniqid from "uniqid";
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import useUserinfoModal from '@/hooks/useUserinfoModal';
import { useUser } from '@/hooks/useUser';

import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const UserInfoModal = () => {

    const [ isLoading, setIsloading ] = useState(false);
    const userinfoModal = useUserinfoModal();
    const { user } = useUser();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset
     } = useForm<FieldValues>({
        defaultValues:{
            password: '',
            email: user?.email,
        }
    });
    const onChange = (open: boolean) => {
        if(!open){
            reset();
            userinfoModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        //error
        try{
            setIsloading(true);

            const uniqueId = uniqid();

            
            const { error: supabaseError } = await supabase.auth.updateUser({email: values.email, password: values.password});

            if(supabaseError){
                setIsloading(false);
                return toast.error(supabaseError.message);
            }

            router.refresh();
            setIsloading(false);
            toast.success("User updated!");
            reset();
            userinfoModal.onClose();

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
            isOpen={userinfoModal.isOpen}
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <div className='pb-1'> Update Email</div>
                    <Input
                        id="email"
                        disabled={isLoading}
                        {...register('email', { required: true })}
                        placeholder="Email"
                        defaultValue={user?.email}
                    />
                </div>
                <div className="mb-5">
                    <div className="pb-1">Update Password</div>
                    <Input
                        id="password"
                        disabled={isLoading}
                        {...register('password', { required: true })}
                        placeholder="Password"
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    Update
                </Button>
            </form>
        </Modal>
     );
}
 
export default UserInfoModal;