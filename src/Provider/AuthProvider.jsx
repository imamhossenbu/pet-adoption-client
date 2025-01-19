/* eslint-disable react/prop-types */
import { createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase.config";


const AuthContext = createContext(null);
const googleProvider =new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();


const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    const logIn=(email,password)=>{
        setLoading(true);
        return signInWithEmailAndPassword(auth,email,password);
    }

    const signUp=(email,password)=>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password);
    }

    const logOut = ()=>{
        setLoading(true);
        return signOut(auth);
    }

    const updateUserProfile=(name,photo)=>{
        return updateProfile(auth.currentUser,{
            displayName:name,photoURL:photo
        })
    }

    const googleLogIn=()=>{
        setLoading(true);
        return signInWithPopup(auth,googleProvider);
    }
    const githubLogIn=()=>{
        setLoading(true);
        return signInWithPopup(auth,githubProvider);
    }

    useEffect(()=>{
        const unSubscribe=onAuthStateChanged(auth,currentUser=>{
            setUser(currentUser);
        })


        return ()=>{
            return unSubscribe();
        }
    },[])

    console.log(user);
    const data={
        logIn,
        signUp,
        logOut,
        updateUserProfile,
        googleLogIn,
        githubLogIn
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;