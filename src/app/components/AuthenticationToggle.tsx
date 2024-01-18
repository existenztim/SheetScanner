'use client';
import {
  MdLogin,
  MdLogout,
} from 'react-icons/md';
import '.././styles/animations.css';
import { GlobalContext } from './ParentProvider';
import { handleLogOut, handleSignIn } from '../utils/authUtils';

const AuthenticationToggle = () => {
  const { user, logOut, googleSignIn } = GlobalContext();
  const initializeSignIn = () => {
    handleSignIn(googleSignIn);
  };

  const initialzeLogOut = () => {
    handleLogOut(logOut);
  };

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