import React, { Dispatch, SetStateAction } from 'react'
import { IKeyValuePairs } from '../models/interfaces/IKeyValuePairs';
import * as XLSX from 'xlsx';
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
  return (
    <div>ExcelFileProcessor</div>
  )
}

export default ExcelFileProcessor