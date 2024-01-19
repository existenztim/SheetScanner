import { useState, useMemo, useEffect, Dispatch, SetStateAction, ChangeEvent, MouseEvent } from 'react';
import * as XLSX from 'xlsx';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { MdAttachFile, MdAdfScanner } from 'react-icons/md';
import { FileFormat } from '../models/enums/EFileFormat';
import '.././styles/animations.css';
import { GlobalContext } from './ParentProvider';
import NotificationForm from './NotificationForm';
import AlertModal from './AlertModal';
import { cutLongStrings } from '../utils/stringManipulation';
import { scanData } from '../utils/scanData';
import { IKeyValuePairs } from '../models/interfaces/IKeyValuePairs';

interface IExcelScannerProps {
  excelData: IKeyValuePairs[];
  filteredDataChanged: boolean;
  workSheet: XLSX.WorkSheet | null;
  setWorkSheet: Dispatch<SetStateAction<XLSX.WorkSheet | null>>;
  setExcelData: Dispatch<SetStateAction<IKeyValuePairs[]>>;
  setFilteredDataChanged: Dispatch<SetStateAction<boolean>>;
}

const ExcelFileProcessor = ({
  excelData,
  workSheet,
  setWorkSheet,
  setExcelData,
  setFilteredDataChanged,
  filteredDataChanged,
}: IExcelScannerProps) => {
  const [searchTerms, setSearchTerms] = useState<string>('');
  const [fileName, setFileName] = useState<string>();
  const [sheetList, setSheetList] = useState<string[]>([]);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const {settings, handleClipboardValue } = GlobalContext();
  const [wrongFileFormat, setWrongFileFormat] = useState<string>('');
  const shortenedFileName = cutLongStrings(fileName, 30);

  const handleFileUpload = (e: XLSX.WorkSheet) => {
    const fileUploaded = e.target;
    const file = e.target.files[0]; //normally XLSX allows multiple files to be uploaded simultaneous, in this case we only allow one.
    const sizeLimit = 3000 * 1024; //3000kb

    if (file.type !== FileFormat.CSV && file.type !== FileFormat.XLS && file.type !== FileFormat.XLSX) {
      setWrongFileFormat('Wrong file format uploaded!');
      fileUploaded.value = '';
      return;
    }

    if (file.size > sizeLimit) {
      setWrongFileFormat('File size exceeds the allowed limit (3000kb).');
      fileUploaded.value = '';
      return;
    }

    setWorkSheet(e);
    parseAndSetExcelData(file);
  };

  const parseAndSetExcelData = (file: File) => {
    const reader = new FileReader();
  
    reader.onload = (e) => {
      if (e.target !== null && e.target.result instanceof ArrayBuffer) {
        const data = e.target.result;
        const parsedWorkbook = XLSX.read(data, { type: 'array' });
        setWorkbook(parsedWorkbook);
  
        const defaultSheetName = parsedWorkbook.SheetNames[0];
        setSheetList(parsedWorkbook.SheetNames);
        
        const sheet = parsedWorkbook.Sheets[defaultSheetName];
        const jsonData: IKeyValuePairs[] = XLSX.utils.sheet_to_json(sheet, { header: 0 });
        
        setFileName(file.name);
        setExcelData(jsonData);
      }
    };

   return reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (workSheet) {
      handleFileUpload(workSheet);
    }
    //add a state here that controlls fileupload text so it wont render when it shouldnt
  }, []);

  const filteredData = useMemo(() => {
    return scanData(excelData, searchTerms);
  }, [excelData, searchTerms]);

  useEffect(() => {
    setFilteredDataChanged(true);
    const timeout = setTimeout(() => {
      setFilteredDataChanged(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [filteredData]);

  useEffect(() => {}, []);

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
        console.error(`Sheet '${selectedSheetName}' not found.`);
      }
    }
  };

  const handleClipboard = (propertyKey: string) => (e: MouseEvent<HTMLParagraphElement>) => {
    const newClipboard = e.currentTarget.textContent;
    if (newClipboard) {
      handleClipboardValue(newClipboard, propertyKey);
    }
  };

  const handleFileResponse = () => {
    setWrongFileFormat('');   
  }

  return (
    <>
      <main
        className={
          settings.animations
            ? 'sheetscanner-fadein flex flex-col my-0 mx-auto px-2 gap-2 mb-4 max-w-[100%] min-h-[80vh] xl:flex-row xl:max-w-[1800px]'
            : 'flex flex-col my-0 mx-auto px-2 gap-2 mb-4 max-w-[100%] min-h-[80vh] xl:flex-row xl:max-w-[1800px]'
        }
      >
        <div className="flex-1 flex-wrap box-border p-4 m-1 border border-gray-300 rounded-lg bg-slate-50">
          <div className="border-b-2 border-gray-200">
            <div className="flex gap-4 items-center justify-start flex-wrap  md:justify-center">
              <div className="flex max-w-xs">
                <label htmlFor="fileInput" className="flex items-start flex-col font-bold">
                  <div className="flex items-center gap-2">
                    <span>Select file</span>
                    <MdAttachFile />
                  </div>
                  <input
                    className="max-w-xs"
                    id="fileInput"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <div className="flex gap-4 items-end flex-wrap">
                <label htmlFor="searchInput" className="flex items-start flex-col font-bold">
                  <div className="flex items-center gap-2">
                    <span>Scan Data</span>
                    <MdAdfScanner />
                  </div>
                  <input
                    className="max-w-xs"
                    id="searchInput"
                    type="text"
                    placeholder="Search"
                    value={searchTerms}
                    onChange={handleSearchInput}
                    disabled={!fileName}
                  />
                </label>
                <button className="bg-yellow-600 rounded text-gray-800 hover:text-gray-50" onClick={handleReset}>
                  Clear
                </button>
              </div>
            </div>
            {fileName && workSheet && (
              <p className="m-2 flex flex-col">
                You are scanning data from :{' '}
                <span>
                  {fileName.length > 30 ? shortenedFileName : fileName} <span className="font-bold">[sheet]</span> :
                  <select
                    className=" bg-gray-200 rounded p-1 mx-2 border-gray-700 border-[1px]"
                    onChange={handleChangeSheet}
                  >
                    {sheetList.map((sheet, index) => (
                      <option key={index}>{sheet}</option>
                    ))}
                  </select>
                </span>
              </p>
            )}
            {!fileName && (
              <p
                className={
                  settings.animations
                    ? 'sheetscanner-start-upload flex justify-center items-center font-bold my-20 mx-0'
                    : 'flex justify-center items-center font-bold my-20 mx-0'
                }
              >
                Upload a file.
              </p>
            )}

            <div>
              {filteredData.length > 0 && (
                <>
                  <p
                    className={
                      settings.animations
                        ? 'sheetscanner-stats-paragraph font-bold opacity-0 translate-x-40'
                        : 'font-bold'
                    }
                  >
                    Your sheet has a total of {excelData.length} Objects.
                  </p>
                  <p
                    className={
                      settings.animations
                        ? 'sheetscanner-stats-paragraph font-bold opacity-0 translate-x-40'
                        : 'font-bold'
                    }
                  >
                    You found a total of {filteredData.length} matches.
                  </p>
                </>
              )}
            </div>
          </div>

          <TransitionGroup className="card-list flex flex-col p-1 m-2 rounded-2xl overflow-auto max-h-[80vh]">
            {filteredData.slice(0, settings.itemsToRender).map((item, index) => ( // instead of 0 add pagination?
              <CSSTransition
                key={index}
                classNames={settings.animations ? 'sheetscanner-hit-container' : ''}
                timeout={600}
                in={filteredDataChanged} // Add the "in" prop to trigger the animation
                unmountOnExit // Remove the element from the DOM when it exits
              >
                <div className="">
                  <ul className="object-card flex flex-col justify-center relative p-2 m-4 rounded bg-green-700 shadow-md">
                    <h2 className="hit-header font-bold text-gray-200">Hit no: {index + 1}</h2>
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
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
          {searchTerms && filteredData.length === 0 && (
            <p className="no-matches flex justify-center items-center font-bold my-20 mx-0">No matches found.</p>
          )}
          {!searchTerms && fileName && (
            <p
              className={
                settings.animations
                  ? 'sheetscanner-start-type flex justify-center items-center font-bold my-20 mx-0'
                  : 'flex justify-center items-center font-bold my-20 mx-0'
              }
            >
              Start typing to find a match.
            </p>
          )}
        </div>
        {settings.showForm && (
          <div className="flex-1 box-border p-4 m-1 border border-gray-300 rounded-lg bg-slate-50">
            <NotificationForm></NotificationForm>
          </div>
        )}
        {wrongFileFormat && (
        <AlertModal errorMessage={wrongFileFormat} closeAlertModal={handleFileResponse} />
      )}
        
      </main>   
    </>
  );
};

export default ExcelFileProcessor;