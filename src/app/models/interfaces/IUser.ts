import { User } from 'firebase/auth';
import { ISettings } from './ISettings';
import { INote } from './INote';

export interface IUserData {
  user: User | null;
  settings: ISettings;
  notes: INote[];
}
