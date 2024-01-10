'use client';
import '../styles/carousel.css';
import { useState } from 'react';
import SignInChoice from './SignInChoice';
import { Carousel } from 'react-responsive-carousel'; //will need sooner or later
import ExcelFileProcessor from './ExcelFileProcessor'; //will need sooner or later
import * as XLSX from 'xlsx'; //will need sooner or later

interface IGeneric {
  [propertyKey: string]: string | undefined;
}

const SheetScanner = () => {
    const [guest, setGuest] = useState<boolean>(false);

    const setGuestToTrue = () => {
        setGuest(true);
      };
  return (
    <>
 <p>SheetScanner</p>
 <SignInChoice setGuestToTrue={setGuestToTrue} />
    </>
  );
  };

  


export default SheetScanner;