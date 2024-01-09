'use client';
import '../styles/carousel.css';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import SignInChoice from './SignInChoice';
import { Carousel } from 'react-responsive-carousel';
import ExcelFileProcessor from './ExcelFileProcessor';
import * as XLSX from 'xlsx';

interface IGeneric {
  [propertyKey: string]: string | undefined;
}

const SheetScanner = () => {
  return (
    <>
 <p>SheetScanner</p>
    </>
  );
  };

  


export default SheetScanner;