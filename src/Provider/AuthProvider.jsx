import {
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    linkWithCredential,
    sendPasswordResetEmail
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase.config";
import AuthContext from "../context/authContext";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosSecurePublic = useAxiosPublic();

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
        });
    }

    const updateUserPassword = async (currentPassword, newPassword) => {
        if (!auth.currentUser) throw new Error("No active user session");

        const hasPassword = auth.currentUser.providerData?.some(
            (p) => p.providerId === "password"
        );

        // If user already has a password, re-authenticate with currentPassword
        if (hasPassword && currentPassword && auth.currentUser.email) {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            return updatePassword(auth.currentUser, newPassword);
        }

        // If user logged in via Google / Social provider (no password provider yet)
        if (!hasPassword && auth.currentUser.email) {
            try {
                const credential = EmailAuthProvider.credential(auth.currentUser.email, newPassword);
                await linkWithCredential(auth.currentUser, credential);
                return;
            } catch (linkErr) {
                console.warn("linkWithCredential fallback:", linkErr);
                return updatePassword(auth.currentUser, newPassword);
            }
        }

        return updatePassword(auth.currentUser, newPassword);
    };

    const sendResetEmail = (email) => {
        const targetEmail = email || auth.currentUser?.email;
        if (!targetEmail) throw new Error("No email provided");
        return sendPasswordResetEmail(auth, targetEmail);
    };

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
    }, [axiosSecurePublic])

    // console.log(user);
    const data = {
        logIn,
        signUp,
        logOut,
        updateUserProfile,
        updateUserPassword,
        sendResetEmail,
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