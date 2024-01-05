'use client';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ParentProvider = () => {
  const router = useRouter();
  const logout = async () => {
    signOut(auth);
    // setUserSettings(defaultSettings); //lägg till state
    // setUserNotes([]); //alt hämta ifrån localstorage
    router.push('/scanner');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      //   setUserValue(currentUser); //lägg till state
    });

    return () => unsubscribe();
  }, []);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  return null; //return nothing for now
};

export default ParentProvider;
