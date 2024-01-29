'use client';
import { MdOutlineAdfScanner, MdArticle, MdCancel, MdHomeFilled, MdOutlineSettings } from 'react-icons/md';
import '.././styles/animations.css';
import axios from 'axios';
import { CgMenuGridR } from 'react-icons/cg';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { GlobalContext } from './ParentProvider';
import { IUserData } from '../models/interfaces/IUser';
import { ISettings } from '../models/interfaces/ISettings';
import { API_URLS } from '../models/ApiRoutes';
import SettingsForm from './SettingsForm';
import { removeBlankSpace } from '../utils/stringManipulation';
import AuthenticationToggle from './AuthenticationToggle';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuToggle, setMenuToogle] = useState(false);
  const [loginHandled, setLoginHandled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<ISettings>({
    instances: 3,
    itemsToRender: 10,
    showForm: true,
    showMatchingString: true,
    animations: true,
    autoFill: true,
  });

  const { user, notes, BASE_URL, setUserSettings, setUserNotes } = GlobalContext();

  const displayName = removeBlankSpace(user?.displayName);
  const encodedDisplayName = encodeURIComponent(displayName || 'guest');

  useEffect(() => {
    if (user && !loginHandled) {
      setLoginHandled(true);
      postToDatabase();
    } else {
      setLoginHandled(false);
    }
  }, [user]);

  useEffect(() => {
    const checkauth = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkauth();
  }, [user]);

  const postToDatabase = async () => {
    const data: IUserData = {
      user: user,
      settings: settings,
      notes: [],
    };

    try {
      const response = await axios.post<IUserData>(`${BASE_URL}${API_URLS.USER_ROUTE}`, data);
      if (response.status === 200) {
        localStorage.setItem('user', displayName || 'guest');
        setUserSettings(response.data.settings);
        setUserNotes(response.data.notes);
        const redirectPath = pathname === '/' ? '/' : pathname;
        router.push(redirectPath);
      } else if (response.status === 201) {
        localStorage.setItem('user', displayName || 'guest');
        router.push(`/scanner/${encodedDisplayName}`);
      } else {
        console.log('Could not sign in user:', response.data.user);
      }
    } catch (error) {
      console.log('postToDatabase', error);
    }
  };

  const handleMenuToggle = () => {
    setMenuToogle(!menuToggle);
  };

  return (
    <>
      <header className="bg-green-800 text-slate-100 w-full h-14 m-0 fixed top-0 left-0 z-50 p-0 justify-center items-center flex">
        <div className="fixed left-2 bg-green-700 rounded-full border-slate-50 border-2">
          <Link className="p-0 m-0" href={'/'} aria-label="Go to the home view.">
            <Image
              className=""
              src="/images/ssicon.png"
              alt="The letter S representing Sheetscanner, above a spreadsheet."
              width={35}
              height={35}
              priority={true}
            />
          </Link>
        </div>
        <div className="flex items-center text-4xl gap-4 z-50">
          <Link className="sheetScanner-nav-links sheetScanner-hover" href={'/'} aria-label="Go to home view.">
            <MdHomeFilled className={pathname === '/' ? 'active-route' : ''} />
          </Link>

          <Link
            className="sheetScanner-nav-links sheetScanner-hover"
            href={'/scanner'}
            aria-label="Go to the scanner view."
          >
            <MdOutlineAdfScanner className={pathname === `/scanner/${encodedDisplayName}` ? 'active-route' : ''} />
          </Link>
          <Link
            className="sheetScanner-nav-links relative sheetScanner-hover"
            href={`/notes/${encodedDisplayName}`}
            aria-label="View your notes."
          >
            {loading ? (
              <span className="sheetscanner-loader w-6 h-6 bottom-5 left-8 absolute rounded-full border-t-4 border-b-gray-300 border-4 border-green-600"></span>
            ) : (
              notes.length > 0 && (
                <span className="bg-yellow-600 rounded-full text-sm absolute bottom-5 left-8 px-2 py-0">
                  {notes.length}
                </span>
              )
            )}
            <MdArticle className={pathname === `/notes/${encodedDisplayName}` ? 'active-route' : ''} />
          </Link>
        </div>
        <div className="fixed right-2 z-40 text-4xl p-0 m-0 items-center flex gap-2">
          {loading ? (
            <span className="sheetscanner-loader w-12 h-12 rounded-full border-t-4 border-b-gray-300 border-4  border-green-600"></span>
          ) : (
            <p className="hidden text-lg gap-2 z-40 xl:flex">
              Welcome: <span>{user ? user.displayName : 'guest'}</span>
            </p>
          )}
          <div className="hidden md:flex">
            <AuthenticationToggle />
          </div>
          <button
            onClick={handleMenuToggle}
            aria-label="Open the settings menu"
            className="sheetScanner-nav-links sheetScanner-hover relative"
          >
            <div className="absolute bottom-5 left-7  rounded-full text-2xl bg-yellow-600 ">
              {!menuToggle ? <MdOutlineSettings /> : <MdCancel />}
            </div>
            {user ? (
              <Image
                className="rounded-full border-white border-2"
                src={user.photoURL || '/default-user-photo.png'}
                alt="User Photo"
                width={35}
                height={35}
              />
            ) : (
              <div className="rounded-full border-white border-2">
                <CgMenuGridR />
              </div>
            )}
          </button>
        </div>
        {menuToggle && <SettingsForm handleMenuToggle={handleMenuToggle}></SettingsForm>}
      </header>
    </>
  );
};

export default Navbar;
