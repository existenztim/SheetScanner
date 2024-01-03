'use client';
import React from 'react';

const AboutApp = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="sm:flex-row h-screen flex justify-center items-center xl:max-w-[1800px] px-5 flex-col">
          <div className="sm:w-1/2 sm:h-1/2">
            <h2 className="text-5xl font-semibold text-gray-800">Welcome to SheetScanner!</h2>
            <h3 className="text-xl font-semibold text-gray-600 mt-4">But what is SheetScanner?</h3>
            <p className="text-gray-600 mt-4">
              &quot;SheetScanner is a powerful and versatile web application designed to simplify the way you work with
              Excel documents. With SheetScanner, you can effortlessly search through your uploaded Excel files, making
              data retrieval a breeze. Whether you&apos;re a professional handling complex spreadsheets or a casual user
              looking for a specific piece of information, SheetScanner has got you covered.&quot;
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutApp;
