'use client';
import '../styles/carousel.css';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { GlobalContext } from './ParentProvider';
import SignInChoice from './SignInChoice';
import { Carousel } from 'react-responsive-carousel';
import ExcelFileProcessor from './ExcelFileProcessor';
import * as XLSX from 'xlsx';

interface IKeyValuePairs {
  [propertyKey: string]: string | undefined;
}

const SheetScanner = () => {
  const {
    user,
    settings,
    workSheet1,
    workSheet2,
    workSheet3,
    workSheet4,
    workSheet5,
    setWorkSheet1,
    setWorkSheet2,
    setWorkSheet3,
    setWorkSheet4,
    setWorkSheet5,
  } = GlobalContext();
  const [guest, setGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [excelData1, setExcelData1] = useState<IKeyValuePairs[]>([]);
  const [excelData2, setExcelData2] = useState<IKeyValuePairs[]>([]);
  const [excelData3, setExcelData3] = useState<IKeyValuePairs[]>([]);
  const [excelData4, setExcelData4] = useState<IKeyValuePairs[]>([]);
  const [excelData5, setExcelData5] = useState<IKeyValuePairs[]>([]);

  const [filteredDataChanged, setFilteredDataChanged] = useState<boolean>(false);

  const setGuestToTrue = () => {
    setGuest(true);
  };

  useEffect(() => {
    const guestFromLocalStorage = localStorage.getItem('guest');
    guestFromLocalStorage ? setGuest(true) : setGuest(false);
  }, [user]);

  useEffect(() => {
    const checkauth = async () => {
      if (user !== null) {
        setLoading(false);
      } else {
        await new Promise(resolve => setTimeout(resolve, 50));
        setLoading(false);
      }
    };
    checkauth();
  }, [user, guest]);

  const renderInstances = () => {
    const instances = [];
    for (let i = 0; i < settings.instances; i++) {
      let excelData: IKeyValuePairs[], setExcelData;
      let workSheet: XLSX.WorkSheet | null, setWorkSheet: Dispatch<SetStateAction<XLSX.WorkSheet | null>>;
      switch (i) {
        case 0:
          excelData = excelData1;
          setExcelData = setExcelData1;
          workSheet = workSheet1;
          setWorkSheet = setWorkSheet1;
          break;
        case 1:
          excelData = excelData2;
          setExcelData = setExcelData2;
          workSheet = workSheet2;
          setWorkSheet = setWorkSheet2;
          break;
        case 2:
          excelData = excelData3;
          setExcelData = setExcelData3;
          workSheet = workSheet3;
          setWorkSheet = setWorkSheet3;
          break;
        case 3:
          excelData = excelData4;
          setExcelData = setExcelData4;
          workSheet = workSheet4;
          setWorkSheet = setWorkSheet4;
          break;
        case 4:
          excelData = excelData5;
          setExcelData = setExcelData5;
          workSheet = workSheet5;
          setWorkSheet = setWorkSheet5;
          break;
        default:
          excelData = [];
          setExcelData = () => {};
          workSheet = null;
          setWorkSheet = () => {};
      }

      instances.push(
        <ExcelFileProcessor
          key={i}
          filteredDataChanged={filteredDataChanged}
          setFilteredDataChanged={setFilteredDataChanged}
          excelData={excelData}
          setExcelData={setExcelData}
          workSheet={workSheet}
          setWorkSheet={setWorkSheet}
        ></ExcelFileProcessor>
      );
    }
    return instances;
  };

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <span className="sheetscanner-loader w-12 h-12 rounded-full border-t-4 border-b-gray-300 border-4  border-green-600"></span>
        </div>
      ) : !user && !guest ? (
        <SignInChoice setGuestToTrue={setGuestToTrue} />
      ) : (
        <div className="">
          {settings.instances > 1 ? (
            <Carousel
              showThumbs={false}
              showArrows={true}
              infiniteLoop={true}
              emulateTouch={false}
              swipeable={false}
              ariaLabel="Your current scanning session."
            >
              {renderInstances()}
            </Carousel>
          ) : (
            renderInstances()
          )}
        </div>
      )}
    </>
  );
};

export default SheetScanner;