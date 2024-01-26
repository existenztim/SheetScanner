'use client';
import { GlobalContext } from '@/app/components/ParentProvider';
import { removeBlankSpace } from '@/app/utils/stringManipulation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ScannerRedirect = () => {
  const router = useRouter();
  const { user } = GlobalContext();
  const displayName = removeBlankSpace(user?.displayName);
  const encodedDisplayName = encodeURIComponent(displayName || 'guest');
  useEffect(() => {
    console.log('you are being redirected', encodedDisplayName);
    if (user) {
      router.push(`/scanner/${encodedDisplayName}`);
    } else {
      router.push('/scanner/guest');
    }
  }, [user, router]);
  return null;
};

export default ScannerRedirect;
