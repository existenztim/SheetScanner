import { User } from 'firebase/auth';
import { Dispatch, SetStateAction } from 'react';
import { INote } from './INote';
import { ISettings } from './ISettings';
import * as XLSX from 'xlsx';

export interface IAppSetup {
  user: User | null;
  settings: ISettings;
  notes: INote[];
  setUserSettings: Dispatch<SetStateAction<ISettings>>;
  setUserNotes: Dispatch<SetStateAction<INote[]>>;
  logOut: () => void;
  googleSignIn: () => void;
  workSheet1: XLSX.WorkSheet | null;
  workSheet2: XLSX.WorkSheet | null;
  workSheet3: XLSX.WorkSheet | null;
  workSheet4: XLSX.WorkSheet | null;
  workSheet5: XLSX.WorkSheet | null;
  setWorkSheet1: Dispatch<SetStateAction<XLSX.WorkSheet | null>>;
  setWorkSheet2: Dispatch<SetStateAction<XLSX.WorkSheet | null>>;
  setWorkSheet3: Dispatch<SetStateAction<XLSX.WorkSheet | null>>;
  setWorkSheet4: Dispatch<SetStateAction<XLSX.WorkSheet | null>>;
  setWorkSheet5: Dispatch<SetStateAction<XLSX.WorkSheet | null>>;
  BASE_URL: string;
  handleClipboardValue: (value: string, key: string) => void;
  clipboardValue: { value: string; key: string };
}
