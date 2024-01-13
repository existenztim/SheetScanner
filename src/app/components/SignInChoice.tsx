'use client';
import React from 'react';
import { GlobalContext } from './ParentProvider';
import { handleSignIn } from '../utils/authUtils';

interface SingInChoiceProps {
  setGuestToTrue: () => void;
}

const SignInChoice = ({ setGuestToTrue }: SingInChoiceProps) => {
  const { user, googleSignIn } = GlobalContext();

  const handleGuestLogin = () => {
    localStorage.setItem('guest', 'guest');
    setGuestToTrue();
  };

  const initializeSignIn = () => {
    handleSignIn(googleSignIn);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen fixed top-14 z-40 bg-slate-100 bg-opacity-20">
      <div className="w-96 p-4 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-stretch justify-center">
          <h4 className="font-bold text-lg w-full border-b border-grey-500">Welcome!</h4>
          <p className="mt-4">
            {' '}
            &quot;As a guest user, you can enjoy all the app features. However any notes you create will only be saved
            locally on your device, same goes for settings. For the full experience, sign in with your Google account
            using Gmail. It&apos;s hassle-free!&quot;
          </p>
        </div>

        <div className="mt-4 flex space-x-4 justify-end">
          <button className="bg-slate-200 rounded text-green-700 py-2" onClick={handleGuestLogin}>
            Continue as guest
          </button>
          <button className="bg-green-700 rounded text-white py-2" onClick={initializeSignIn}>
            Sign in with Gmail
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInChoice;