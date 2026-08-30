import React, {createContext, useContext, useState, useEffect} from 'react';
import {supabase} from '../libs/supabase'


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPasswordReset, setIsPasswordReset] = useState(false); // detects if user arrived via reset link

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
        const {data:{subscription}} = supabase.auth.onAuthStateChange((event, newSession) =>{
            setSession(newSession);
            setUser(newSession?.user??null);
            setLoading(false);

            if (event === 'PASSWORD_RECOVERY'){
                setIsPasswordReset(true);
            }

        });

        return() =>{
            subscription.unsubscribe();
        };
        

    },[]);

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });
        if (error) throw error;
        return data;
    };

    const signIn = async (email,password) =>{
        const {data,error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    // send forgot password email
    const resetPassword = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin, // redirect back to local live app
        });
        if (error) throw error;
        return data;    
    };

    const updatePassword = async (newPassword) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
        return data;
    };

    const deleteAccount = async () => {
        if (!user) return;
        // 1. Delete user jobs from jobs table
        const { error: dataError } = await supabase.from('jobs').delete().eq('user_id', user.id);
        if (dataError) console.error("Error deleting user data: ", dataError.message);

        // 2. Call delete_user RPC if present
        try {
            await supabase.rpc('delete_user');
        } catch (rpcErr) {
            console.warn("RPC delete_user not configured:", rpcErr);
        }

        // 3. Sign out session
        await signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                isPasswordReset,
                setIsPasswordReset,
                signUp,
                signIn,
                signOut,
                resetPassword,
                updatePassword,
                deleteAccount,
            }}>
            

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
