'use client';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { INote } from '../models/interfaces/INote';
import { ISettings } from '../models/interfaces/ISettings';

const defaultUser: User | null = null;
const defaultSettings: ISettings = {
  instances: 3,
  showForm: true,
  showMatchingString: true,
  animations: true,
};

export const ParentProvider = () => {
  const [userValue, setUserValue] = useState<User | null>(defaultUser);
  const [userSettings, setUserSettings] = useState<ISettings>(defaultSettings);
  const [userNotes, setUserNotes] = useState<INote[]>([]);
  const router = useRouter();
  const logout = async () => {
    signOut(auth);
    setUserSettings(defaultSettings); //lägg till state
     setUserNotes([]); //alt hämta ifrån localstorage
    router.push('/scanner');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
        setUserValue(currentUser); //lägg till state
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
