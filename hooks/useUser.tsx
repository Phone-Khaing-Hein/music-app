'use client'

import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { UserDetails } from "@/type";
import { useSupabase } from "@/providers/SupabaseProvider";
import { supabase } from "@/lib/supabase";

// Define the type for the context value
type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
};

// Create the UserContext using createContext, initialized with undefined
export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

// Define interface for props
export interface Props{
    [propName: string] : any;
}

// Define the custom context provider component
export const MyUserContextProvider = (props: Props) => {
    const { user, session, loading: isLoadingUser } = useSupabase();
    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

    // useEffect hook to fetch data when the component mounts or user state changes
    useEffect(() => {
        if(user && !isLoadingData && !userDetails){
            setIsLoadingData(true);

            const fetchUserDetails = async () => {
                try {
                    // First try to get existing user
                    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
                    
                    if (error) {
                        console.log('User details fetch error:', error);
                        // If user doesn't exist, try to create them
                        if (error.code === 'PGRST116') {
                            const createError = await supabase.from('users').insert({
                                id: user.id,
                                full_name: user.user_metadata?.full_name || '',
                                first_name: user.user_metadata?.full_name?.split(' ')[0] || '',
                                last_name: user.user_metadata?.full_name?.split(' ')[1] || '',
                                avatar_url: user.user_metadata?.avatar_url || ''
                            });
                            
                            if (!createError.error) {
                                // Try to fetch again after creation
                                const { data: retryData, error: retryError } = await supabase.from('users').select('*').eq('id', user.id).single();
                                if (!retryError && retryData) {
                                    setUserDetails(retryData as unknown as UserDetails);
                                }
                            }
                        }
                        
                        // Fallback to user metadata if database operations fail
                        if (!userDetails) {
                            setUserDetails({
                                id: user.id,
                                first_name: user.user_metadata?.full_name?.split(' ')[0] || '',
                                last_name: user.user_metadata?.full_name?.split(' ')[1] || '',
                                full_name: user.user_metadata?.full_name || '',
                                avatar_url: user.user_metadata?.avatar_url || ''
                            } as UserDetails);
                        }
                    } else if (data) {
                        setUserDetails(data as unknown as UserDetails);
                    }
                } catch (err) {
                    console.error('Error fetching user details:', err);
                    // Fallback to user metadata on any error
                    setUserDetails({
                        id: user.id,
                        first_name: user.user_metadata?.full_name?.split(' ')[0] || '',
                        last_name: user.user_metadata?.full_name?.split(' ')[1] || '',
                        full_name: user.user_metadata?.full_name || '',
                        avatar_url: user.user_metadata?.avatar_url || ''
                    } as UserDetails);
                } finally {
                    setIsLoadingData(false);
                }
            };

            fetchUserDetails();
        } else if(!user && !isLoadingUser){
            setUserDetails(null);
            setIsLoadingData(false);
        }
    }, [user, isLoadingUser, isLoadingData, userDetails]);

    // Construct the value object with relevant data
    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
    };

    // Render the UserContext.Provider with the value passed as a prop
    return <UserContext.Provider value={value} {...props} />

}

// Custom hook to consume the user context
export const useUser = () => {
    // Use the useContext hook to access the UserContext
    const context = useContext(UserContext);
    // Throw an error if the context is undefined
    if(context === undefined){
        throw new Error("useUser must be used within a MyUserContextProvider")
    }

    // Return the context
    return context;
}