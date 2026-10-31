/* eslint-disable react/prop-types */
import { createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase.config";
import AuthContext from "../context/authContext";
import useAxiosPublic from "../Hooks/useAxiosPublic";



const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosSecurePublic=useAxiosPublic();

    const logIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const signUp = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photo
        })
    }

    const googleLogIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }
    const githubLogIn = () => {
        setLoading(true);
        return signInWithPopup(auth, githubProvider);
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async(currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userInfo = { email: currentUser.email };
                try {
                    const res = await axiosSecurePublic.post('/jwt', userInfo);
                    if (res.data.token) {
                        localStorage.setItem('token', res.data.token);
                    }
                } catch (error) {
                    console.error('Error fetching token:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                localStorage.removeItem('token');
                setLoading(false);
            }
        })


        return () => {
            return unSubscribe();
        }
    }, [])

    // console.log(user);
    const data = {
        logIn,
        signUp,
        logOut,
        updateUserProfile,
        googleLogIn,
        githubLogIn,
        loading,
        user
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;