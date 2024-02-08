'use client';
//Libraries
import { useContext, createContext, useState, useEffect, ReactNode, FunctionComponent } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '../firebase';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';
//Models
import { ISettings } from '../models/interfaces/ISettings';
import { INote } from '../models/interfaces/INote';
import { IAppSetup } from '../models/interfaces/IAppSetup';
import { API_URLS } from '../models/ApiRoutes';

interface ParentProviderProps {
  children: ReactNode;
}

const defaultUser: User | null = null;
const defaultSettings: ISettings = {
  instances: 3,
  itemsToRender: 10,
  showForm: true,
  showMatchingString: true,
  animations: true,
  autoFill: true,
};

//initialValues
const AuthContext = createContext<IAppSetup>({
  user: defaultUser,
  settings: defaultSettings,
  notes: [],
  setUserSettings: () => {},
  setUserNotes: () => {},
  logOut: () => {},
  googleSignIn: () => {},
  workSheet1: null,
  workSheet2: null,
  workSheet3: null,
  workSheet4: null,
  workSheet5: null,
  setWorkSheet1: () => {},
  setWorkSheet2: () => {},
  setWorkSheet3: () => {},
  setWorkSheet4: () => {},
  setWorkSheet5: () => {},
  BASE_URL: '',
  handleClipboardValue: () => {},
  clipboardValue: { value: '', key: '' },
});

export const AuthContextProvider: FunctionComponent<ParentProviderProps> = ({ children }) => {
  const [userValue, setUserValue] = useState<User | null>(defaultUser);
  const [userSettings, setUserSettings] = useState<ISettings>(defaultSettings);
  const [userNotes, setUserNotes] = useState<INote[]>([]);

  const [workSheet1, setWorkSheet1] = useState<XLSX.WorkSheet | null>(null);
  const [workSheet2, setWorkSheet2] = useState<XLSX.WorkSheet | null>(null);
  const [workSheet3, setWorkSheet3] = useState<XLSX.WorkSheet | null>(null);
  const [workSheet4, setWorkSheet4] = useState<XLSX.WorkSheet | null>(null);
  const [workSheet5, setWorkSheet5] = useState<XLSX.WorkSheet | null>(null);
  const [clipboardValue, setClipboardValue] = useState<{ value: string; key: string }>({ value: '', key: '' });

  const router = useRouter();
  const BASE_URL = API_URLS.LOCAL_BASE_ROUTE; //switch between LOCAL_BASE_ROUTE/CLOUD_BASE_ROUTE

  const handleClipboardValue = (value: string, key: string) => {
    setClipboardValue({ value, key });
    navigator.clipboard.writeText(value);
  };

  const logout = async () => {
    await signOut(auth);
    setUserSettings(defaultSettings);
    setUserNotes([]);
    setWorkSheet1(null);
    setWorkSheet2(null);
    setWorkSheet3(null);
    setWorkSheet4(null);
    setWorkSheet5(null);
    handleClipboardValue('', '');
    router.push('/scanner');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUserValue(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider)
      .then(result => {
        setUserValue(result.user);
      })
      .catch(error => {
        if (error.code === 'auth/popup-closed-by-user') {
          //expected user behaviour, no need to respond
          return;
        } else {
          console.error('Google Sign-In Error:', error.message);
        }
      });
  };

  const contextValue: IAppSetup = {
    user: userValue,
    settings: userSettings,
    notes: userNotes,
    setUserSettings,
    setUserNotes,
    logOut: logout,
    googleSignIn,
    workSheet1,
    workSheet2,
    workSheet3,
    workSheet4,
    workSheet5,
    setWorkSheet1,
    setWorkSheet2,
    setWorkSheet3,
    setWorkSheet4,
    setWorkSheet5,
    BASE_URL,
    handleClipboardValue,
    clipboardValue,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const GlobalContext = () => {
  return useContext(AuthContext);
};
