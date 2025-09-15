"use client";

import { useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import UserInfoModal from "@/components/UserInfoModal";

const ModalProvider = () => {
    const [ isMounted, setIsMounted ] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted){
        return null;
    }
    return ( 
        <>
            <AuthModal/>
            <UploadModal />
            <UserInfoModal/>
        </>
     );
}
 
export default ModalProvider;