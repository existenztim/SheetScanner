'use client';
import { MdLogin, MdLogout } from 'react-icons/md';
import '.././styles/animations.css';
import { GlobalContext } from './ParentProvider';
import { handleLogOut, handleSignIn } from '../utils/authUtils';

const AuthenticationToggle = () => {
  const { user, logOut, googleSignIn, setWorkSheet1, setWorkSheet2, setWorkSheet3, setWorkSheet4, setWorkSheet5 } =
    GlobalContext();

  const initializeSignIn = () => {
    handleSignIn(googleSignIn);
  };

  const initialzeLogOut = () => {
    handleLogOut(logOut);
    setWorkSheet1(null);
    setWorkSheet2(null);
    setWorkSheet3(null);
    setWorkSheet4(null);
    setWorkSheet5(null);
  };

  /**************************************************************
                         Markup
  **************************************************************/

  return (
    <>
      {!user ? (
        <button
          className="sheetScanner-nav-links sheetScanner-hover flex"
          onClick={initializeSignIn}
          aria-label="sign in."
        >
          <MdLogin />
        </button>
      ) : (
        <button
          className="sheetScanner-nav-links sheetScanner-hover flex"
          onClick={initialzeLogOut}
          aria-label="log out."
        >
          <MdLogout />
        </button>
      )}
    </>
  );
};

export default AuthenticationToggle;
