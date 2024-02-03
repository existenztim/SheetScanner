//Libraries
import { useState, useMemo, useEffect, Dispatch, SetStateAction, ChangeEvent, MouseEvent } from 'react';
import * as XLSX from 'xlsx';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
//Icons
import { MdAttachFile, MdAdfScanner } from 'react-icons/md';
//Styling
import '.././styles/animations.css';
//Components
import { GlobalContext } from './ParentProvider';
import NotificationForm from './NotificationForm';
//Utils
import { cutLongStrings } from '../utils/stringManipulation';
import { scanData } from '../utils/scanData';
//Assets
import MockData from '../assets/MockData.json';
//Models
import { FileFormat } from '../models/enums/EFileFormat';
import { IKeyValuePairs } from '../models/interfaces/IKeyValuePairs';
import { FormResponseTexts, FormResponseTypes } from '../models/enums/EFormResponse';

interface IExcelScannerProps {
  excelData: IKeyValuePairs[];
  filteredDataChanged: boolean;
  workSheet: XLSX.WorkSheet | null;
  setWorkSheet: Dispatch<SetStateAction<XLSX.WorkSheet | null>>;
  setExcelData: Dispatch<SetStateAction<IKeyValuePairs[]>>;
  setFilteredDataChanged: Dispatch<SetStateAction<boolean>>;
  onModalResponse: (message: string, type: string) => void;
}

const ExcelFileProcessor = ({
  excelData,
  workSheet,
  setWorkSheet,
  setExcelData,
  setFilteredDataChanged,
  onModalResponse,
  filteredDataChanged,
}: IExcelScannerProps) => {
  const [searchTerms, setSearchTerms] = useState<string>('');
  const [fileName, setFileName] = useState<string>();
  const [sheetList, setSheetList] = useState<string[]>([]);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const { settings, handleClipboardValue } = GlobalContext();

  const shortenedFileName = cutLongStrings(fileName, 30);

  const handleFileUpload = (e: XLSX.WorkSheet) => {
    const fileUploaded = e.target;
    const file = e.target.files?.[0]; // Use optional chaining to avoid errors if files array is undefined or empty
    const sizeLimit = 3000 * 1024; // 3000kb

    if (!file || (file.type !== FileFormat.CSV && file.type !== FileFormat.XLS && file.type !== FileFormat.XLSX)) {
      handleModalResponse(FormResponseTexts.WRONG_FILE_FORMAT, FormResponseTypes.INFORMATION);
      fileUploaded.value = '';
      return;
    }

    if (file.size > sizeLimit) {
      handleModalResponse(FormResponseTexts.WRONG_FILE_SIZE, FormResponseTypes.INFORMATION);
      fileUploaded.value = '';
      return;
    }

    setWorkSheet(e);
    parseAndSetExcelData(file);
  };

  const parseAndSetExcelData = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target !== null && e.target.result instanceof ArrayBuffer) {
        const data = e.target.result;
        const parsedWorkbook = XLSX.read(data, { type: 'array' });
        setWorkbook(parsedWorkbook);

        const defaultSheetName = parsedWorkbook.SheetNames[0];
        setSheetList(parsedWorkbook.SheetNames);

        const sheet = parsedWorkbook.Sheets[defaultSheetName];
        const jsonData: IKeyValuePairs[] = XLSX.utils.sheet_to_json(sheet, { header: 0 });
        handleExceldata(file, jsonData);
      }
    };
    return reader.readAsArrayBuffer(file);
  };

  const handleMockDataUpload = () => {
    handleExceldata(new File([JSON.stringify(MockData)], 'MockData.json', { type: 'application/json' }), MockData);
  };

  const handleExceldata = (file: File, data: IKeyValuePairs[]) => {
    setFileName(file.name);
    setExcelData(data);
  };

  useEffect(() => {
    if (workSheet) {
      handleFileUpload(workSheet);
    }
  }, []);

  const filteredData = useMemo(() => {
    return scanData(excelData, searchTerms);
  }, [excelData, searchTerms]);

  //Purely related to animations
  useEffect(() => {
    setFilteredDataChanged(true);
    const timeout = setTimeout(() => {
      setFilteredDataChanged(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [filteredData]);

  const handleModalResponse = (message: string, type: string) => {
    onModalResponse(message, type);
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
  };

  const handleReset = () => {
    setSearchTerms('');
  };

  const handleChangeSheet = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedSheetName = e.target.value;
    if (workbook) {
      const sheetIndex = workbook.SheetNames.indexOf(selectedSheetName);
      if (sheetIndex !== -1) {
        const selectedSheet = workbook.Sheets[selectedSheetName];
        const jsonData: IKeyValuePairs[] = XLSX.utils.sheet_to_json(selectedSheet, { header: 0 });
        setExcelData(jsonData);
      } else {
        handleModalResponse(FormResponseTexts.ERROR_SHEET, FormResponseTypes.ERROR);
      }
    }
  };

  const handleClipboard = (propertyKey: string) => (e: MouseEvent<HTMLParagraphElement>) => {
    const newClipboard = e.currentTarget.textContent;
    if (newClipboard) {
      handleClipboardValue(newClipboard, propertyKey);
    }
  };

  /**************************************************************
                         Markup
  **************************************************************/

  return (
    <>
      {/* Main Container */}
      <main
        className={`${
          settings.animations && 'sheetscanner-fadein'
        } flex flex-col my-0 mx-auto px-2 gap-2 mb-4 max-w-[100%] min-h-[80vh] xl:flex-row xl:max-w-[1800px]`}
      >
        {/* Left Section: File Upload and Search */}
        <div className="flex-1 flex-wrap box-border p-4 m-1 border border-gray-300 rounded-lg bg-slate-50">
          <div className="border-b-2 border-gray-200">
            <div className="flex gap-4 items-start justify-start flex-wrap md:justify-center">
              {/* File Upload Section */}
              <div id="scanner" className="scroll-mt-24 flex max-w-xs flex-col">
                <label htmlFor="fileInput" className="flex items-start flex-col font-bold">
                  <span className="flex items-center gap-2">
                    <span className="flex items-start flex-col font-bold">Upload file</span>
                    <MdAttachFile />
                  </span>
                  <input
                    className="max-w-xs"
                    id="fileInput"
                    name="fileInput"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    aria-label="file input help"
                  />
                </label>
                <p className="mt-1 text-sm text-gray-500">CSV, XLSX, or XLS (MAX. 3000kb).</p>
              </div>
              {/* Search Section */}
              <div className="flex gap-4 items-end flex-wrap">
                <label htmlFor="searchInput" className="flex items-start flex-col font-bold">
                  <span className="flex items-center gap-2">
                    <span>Scan Data</span>
                    <MdAdfScanner />
                  </span>
                  <input
                    className={`max-w-[220px] ${!fileName && 'cursor-not-allowed'}`}
                    id="searchInput"
                    name="searchInput"
                    type="text"
                    placeholder="Search"
                    value={searchTerms}
                    onChange={handleSearchInput}
                    disabled={!fileName}
                  />
                </label>
                <button
                  className="sheetScanner-standard-link bg-yellow-600 rounded text-gray-800 hover:text-gray-50"
                  onClick={handleReset}
                >
                  Clear
                </button>
              </div>
            </div>
            {/* File Info Section */}
            {fileName && workSheet && (
              <p className="m-2 flex flex-col">
                You are scanning data from :{' '}
                <span>
                  {fileName.length > 30 ? shortenedFileName : fileName} <span className="font-bold">[sheet]</span> :
                  <select
                    className="bg-gray-200 border border-gray-300 text-gray-800 rounded mx-2 p-2"
                    onChange={handleChangeSheet}
                  >
                    {sheetList.map((sheet, index) => (
                      <option key={index}>{sheet}</option>
                    ))}
                  </select>
                </span>
              </p>
            )}

            {/* No File Uploaded Message */}
            {!fileName && (
              <div
                className={
                  settings.animations
                    ? 'sheetscanner-start-upload flex flex-col justify-center items-center font-bold my-20 mx-0'
                    : 'flex justify-center items-center font-bold my-20 mx-0'
                }
              >
                <p>
                  Initiate data scanning by uploading a file above. <br></br> <br></br>Still uncertain? Experience the
                  app's capabilities with our Excel demo.
                </p>
                <div className="max-w-xs flex gap-4 items-start justify-start flex-wrap md:justify-center">
                  <div className="flex items-start font-bold">
                    <button
                      className=" bg-green-700 px-2 rounded text-slate-50 sheetScanner-hover flex justify-center items-center"
                      onClick={handleMockDataUpload}
                    >
                      Test with demo data <MdAttachFile />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Various Stats and Messages */}
            <div>
              {fileName === 'MockData.json' && (
                <p
                  className={
                    settings.animations
                      ? 'sheetscanner-stats-paragraph font-bold opacity-0 translate-x-40'
                      : 'font-bold'
                  }
                >
                  Test data in use. Upload your own file for a real app experience.
                </p>
              )}
              {excelData.length > 0 && (
                <p
                  className={
                    settings.animations
                      ? 'sheetscanner-stats-paragraph font-bold opacity-0 translate-x-40'
                      : 'font-bold'
                  }
                >
                  Your sheet has a total of {excelData.length} Objects.
                </p>
              )}
              {filteredData.length > 0 && (
                <p
                  className={
                    settings.animations
                      ? 'sheetscanner-stats-paragraph font-bold opacity-0 translate-x-40'
                      : 'font-bold'
                  }
                >
                  You found a total of {filteredData.length} matches.
                </p>
              )}
            </div>
          </div>

          {/* Transition Group for Filtered Data */}
          <TransitionGroup className="card-list flex flex-col p-1 m-2 rounded-2xl overflow-auto max-h-[80vh]">
            {filteredData.slice(0, settings.itemsToRender).map(
              (
                item,
                index // instead of 0 add pagination?
              ) => (
                <CSSTransition
                  key={index}
                  classNames={settings.animations ? 'sheetscanner-hit-container' : ''}
                  timeout={600}
                  in={filteredDataChanged} // Add the "in" prop to trigger the animation
                  unmountOnExit // Remove the element from the DOM when it exits
                >
                  <ul className="flex flex-col justify-center relative px-2 pb-2 m-4 rounded bg-green-700 shadow-md">
                    <li className="flex justify-center items-center">
                      <h2 className="font-bold text-gray-200">Hit no: {index + 1}</h2>
                    </li>
                    {Object.keys(item).map(propertyKey => (
                      <li
                        className="object-row flex flex-col justify-center odd:bg-gray-100 even:bg-gray-300 md:flex-row"
                        key={propertyKey}
                      >
                        <p className="property-key font-bold text-left pr-4 m-1 min-w-[150px]">{propertyKey}:</p>
                        <div className="sheetscanner-property-value-container flex-1">
                          <p
                            className="sheetscanner-property-value text-left cursor-copy m-1 opacity-95 border-[1px] border-slate-200 shadow-md hover:text-gray-200"
                            onClick={handleClipboard(propertyKey)}
                          >
                            {item[propertyKey]}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CSSTransition>
              )
            )}
          </TransitionGroup>

          {/* No Matches Found Message */}
          {searchTerms && filteredData.length === 0 && (
            <p
              className={`${
                settings.animations && 'sheetscanner-start-type'
              } flex justify-center items-center font-bold my-20 mx-0`}
            >
              No matches found.
            </p>
          )}

          {/* Start Typing Message */}
          {!searchTerms && fileName && (
            <p
              className={`${
                settings.animations ? 'sheetscanner-start-type ' : ''
              }flex justify-center items-center font-bold my-20 mx-0`}
            >
              Start typing to find a match.
            </p>
          )}
        </div>

        {/* Right Section: Notification Form */}
        {settings.showForm && (
          <div className="flex-1 box-border p-4 m-1 border border-gray-300 rounded-lg bg-slate-50">
            <NotificationForm
              excelData={excelData}
              currentFile={fileName}
              onModalResponse={handleModalResponse}
            ></NotificationForm>
          </div>
        )}
      </main>
    </>
  );
};

export default ExcelFileProcessor;
