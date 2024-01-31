'use client';
import React from 'react';
import { GlobalContext } from './ParentProvider';
import { usePathname } from 'next/navigation';

const ClipBoard = () => {
  const router = usePathname();
  const { settings, clipboardValue } = GlobalContext();
  const shouldRender = router.includes('scanner'); //no need to show this component in every view

  /**************************************************************
                         Markup
  **************************************************************/

  return shouldRender ? (
    <div>
      <p
        className={
          settings.animations
            ? 'sheetscanner-highlighted bg-gray-200 w-full text-center fixed top-14 z-40 mb-4 mx-auto p-1 text-gray-800 font-bold'
            : 'bg-gray-200 w-full text-center fixed top-14 z-40 mb-4 mx-auto p-1 text-gray-800 font-bold'
        }
      >
        {clipboardValue.value
          ? `You have copied: [${clipboardValue.value}] to clipboard`
          : `Your last copied data will be displayed here.`}
      </p>
    </div>
  ) : null;
};

export default ClipBoard;
