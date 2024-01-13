'use client';
import { GlobalContext } from '@/app/components/ParentProvider';
import { removeBlankSpace } from '@/app/utils/stringManipulation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ScannerRedirect = () => {
  const router = useRouter();
  const { user } = GlobalContext();
  const displayName = removeBlankSpace(user?.displayName);
  useEffect(() => {
    // Check if the user exists
    console.log('you are being redirected');
    if (user) {
      // Redirect to scanner/user.displayName
      router.push(`/scanner/${displayName}`);
    } else {
      // Redirect to scanner/guest
      router.push('/scanner/guest');
    }
  }, [user, router]);

  return null;
};

export default ScannerRedirect;
