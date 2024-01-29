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
import AlertModal from './AlertModal';
//Utils
import { cutLongStrings } from '../utils/stringManipulation';
import { scanData } from '../utils/scanData';
//Models
import { FileFormat } from '../models/enums/EFileFormat';
import { IKeyValuePairs } from '../models/interfaces/IKeyValuePairs';
import { Imodal } from '../models/interfaces/IModal';
import { FormResponseTexts, FormResponseTypes } from '../models/enums/EFormResponse';

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
  const { settings, handleClipboardValue } = GlobalContext();
  const [modal, setModal] = useState<Imodal>({
    message: '',
    type: FormResponseTypes.ERROR,
  });

  const shortenedFileName = cutLongStrings(fileName, 30);

  const handleFileUpload = (e: XLSX.WorkSheet) => {
    const fileUploaded = e.target;
    const file = e.target.files[0]; //normally XLSX allows multiple files to be uploaded simultaneous, in this case we only allow one.
    const sizeLimit = 3000 * 1024; //3000kb

    if (file.type !== FileFormat.CSV && file.type !== FileFormat.XLS && file.type !== FileFormat.XLSX) {
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

  const handleModalResponse = (message: string, type: string) => {
    setModal({
      message: message,
      type: type,
    });
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
      <main
        className={`${
          settings.animations && 'sheetscanner-fadein'
        } flex flex-col my-0 mx-auto px-2 gap-2 mb-4 max-w-[100%] min-h-[80vh] xl:flex-row xl:max-w-[1800px]`}
      >
        <div className="flex-1 flex-wrap box-border p-4 m-1 border border-gray-300 rounded-lg bg-slate-50">
          <div className="border-b-2 border-gray-200">
            <div className="flex gap-4 items-center justify-start flex-wrap  md:justify-center">
              <div id="scanner" className="scroll-mt-24 flex max-w-xs">
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
                    className="max-w-[220px]"
                    id="searchInput"
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
          {searchTerms && filteredData.length === 0 && (
            <p
              className={`${
                settings.animations && 'sheetscanner-start-type'
              } flex justify-center items-center font-bold my-20 mx-0`}
            >
              No matches found.
            </p>
          )}
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
        {settings.showForm && (
          <div className="flex-1 box-border p-4 m-1 border border-gray-300 rounded-lg bg-slate-50">
            <NotificationForm excelData={excelData} currentFile={fileName}></NotificationForm>
          </div>
        )}
        {modal.message && (
          <AlertModal modal={modal} closeAlertModal={() => handleModalResponse('', FormResponseTypes.ERROR)} />
        )}
      </main>
    </>
  );
};

export default ExcelFileProcessor;
