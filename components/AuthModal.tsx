'use client';

import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";

import useAuthModal from "@/hooks/useAuthModal";
import { supabase } from "@/lib/supabase";
import { useSupabase } from "@/providers/SupabaseProvider";

import Modal from "./Modal";

const AuthModal = () => {
    const router = useRouter();
    const { session } = useSupabase();
    const { onClose, isOpen } = useAuthModal();

    useEffect(() => {
        if(session){
            router.refresh();
            onClose();
        }
    }, [session, router, onClose]);

    const onChange = (open: boolean) => {
        if(!open){
            onClose();
        }
    }

    return ( 
        <Modal
            title="welcome back"
            description="Login to your account"
            isOpen={isOpen}
            onChange={onChange}
        >
            <Auth 
                theme="dark"
                magicLink
                providers={['github']}
                supabaseClient={supabase}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default:{
                            colors:{
                                brand:'#404040',
                                brandAccent: '#22c55e'
                            }
                        }
                    }
                }}
            />
        </Modal>
     );
}
 
export default AuthModal;