import React, {createContext, useContext, useState, useEffect} from 'react';
import {supabase} from '../lib/supabase'


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        // 1. get initial session on page load
        async function getInitialSession(){
            try{
                const{data: {session}} = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user??null);;

            }catch (error){
                console.error('Error fetching session: ', error.message);

            }finally{
                setLoading(false)
            }
        }
        getInitialSession();

        // 2. Listen for auth changes (login, logout, session refresh)
        const {data:{subscription}} = supabase.auth.onAuthStateChange((_event, newSession) =>{
            setSession(newSession);
            setUser(newSession?.user??null);
            setLoading(false);

        });

        return() =>{
            subscription.unsubscribe();
        };
        

    },[]);

    const signUp = async (email,password) =>{
        const {data,error} = await supabase.auth.signUp({
            email,password,
        });
        if (error) throw error;
        return data;
    };

    const signIn = async ({email,password}) =>{
        const {data,error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signOut = async() =>{
        const {error} = await supabase.auth.signOut();
        if (error) return error;
        
    }

    return (
        <AuthContext.Provider
            value = {{user, sessions, loading,signUp, signIn, signOut}}
            >

        {children}
        </AuthContext.Provider>

    )
    
}
// Hook to access user and auth functions in any component

export function useAuth(){
    const context = useContext(AuthContext);
    
    if(!context){
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context; 
}
