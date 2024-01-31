'use client';
//Utils
import { handleSignIn } from '../utils/authUtils';
//Components
import { GlobalContext } from './ParentProvider';
//Logos
import { BiLogoGmail } from 'react-icons/bi';

interface SingInChoiceProps {
  setGuestToTrue: () => void;
}

const SignInChoice = ({ setGuestToTrue }: SingInChoiceProps) => {
  const { googleSignIn } = GlobalContext();

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
            &quot;As a guest user, note creation is unavailable, and the settings you configure will only persist
            temporarily throughout your session. For the complete experience, sign in with your Google account using
            Gmail – a seamless and hassle-free process!&quot;
          </p>
        </div>

        <div className="mt-4 flex space-x-4 justify-end">
          <button
            className="sheetScanner-standard-link bg-yellow-600 text-gray-800 hover:text-gray-50 rounded"
            onClick={handleGuestLogin}
          >
            Continue as guest
          </button>
          <button
            className="sheetScanner-standard-link bg-green-700 rounded text-slate-50 sheetScanner-hover flex items-center"
            onClick={initializeSignIn}
          >
            <p className="flex items-center justify-between">
              Sign in with Gmail{' '}
              <span className="text-3xl">
                <BiLogoGmail />
              </span>
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInChoice;
