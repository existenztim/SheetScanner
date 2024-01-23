'use client';
import { INote } from '../models/interfaces/INote';

interface InputValues {
  [propertyKey: string]: string;
}
const defaultNote: INote = {
  title: '',
  type: {},
  createDate: '',
  lastUpdated: '',
  fileName: '',
};

const NoteEditor = () => {
  return <p>my note</p>;
};

export default NoteEditor;
