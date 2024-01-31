//Libraries
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
//Components
import { GlobalContext } from './ParentProvider';
//Utils
import { getDate } from '../utils/stringManipulation';
//Models
import { IUserData } from '../models/interfaces/IUser';
import { FormResponseTexts, FormResponseTypes } from '../models/enums/EFormResponse';
import { API_URLS } from '../models/ApiRoutes';
import { IKeyValuePairs } from '../models/interfaces/IKeyValuePairs';

interface InputValues {
  [propertyKey: string]: string;
}
interface NotificationFormProps {
  excelData: IKeyValuePairs[];
  currentFile: string | undefined;
  onModalResponse: (message: string, type: string) => void;
}

const NotificationForm = ({ excelData, currentFile, onModalResponse }: NotificationFormProps) => {
  const [inputValues, setInputValues] = useState<InputValues>({ note: '' });
  const [noteTitle, setNoteTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, notes, settings, BASE_URL, clipboardValue, setUserNotes } = GlobalContext();

  useEffect(() => {
    initialInputValues();
  }, [excelData]);

  // Fills in the initial input values based on changes in excelData (used for clipboard), does not affect title/comment
  const initialInputValues = () => {
    const setInitialInputValues: InputValues = {};
    excelData[0] &&
      Object.keys(excelData[0]).forEach(propertyKey => {
        setInitialInputValues[propertyKey] = '';
      });
    setInputValues({ ...setInitialInputValues, note: '' });
  };

  // Find what input field to autofill if its propertyKey is a match with clipboardValue.key
  useEffect(() => {
    const propertyKey = Object.keys(inputValues).find(key => key === clipboardValue.key);
    if (propertyKey !== undefined && settings.autoFill) {
      setInputValues(prevInputValues => ({
        ...prevInputValues,
        [propertyKey]: clipboardValue.value,
      }));
    }
  }, [clipboardValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputValues(prevInputValues => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newTitleValue = e.target.value;
    setNoteTitle(newTitleValue);
  };

  const resetForm = () => {
    initialInputValues();
    setNoteTitle('');
  };

  const handleModalResponse = (message: string, type: string) => {
    onModalResponse(message, type);
  };

  const handleNotesSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      handleModalResponse(FormResponseTexts.SIGNIN, FormResponseTypes.INFORMATION);
      return;
    }
    if (noteTitle.length < 3) {
      handleModalResponse(FormResponseTexts.WRONG_INPUT, FormResponseTypes.INFORMATION);
      return;
    }

    const data: IUserData = {
      user: user,
      settings: settings,
      notes: [...notes, { type: inputValues, createDate: getDate(), fileName: currentFile ?? '', title: noteTitle }],
    };

    createNote(data);
  };

  /**************************************************************
                         API calls
  **************************************************************/

  const createNote = async (data: IUserData) => {
    setLoading(true);
    try {
      const response = await axios.put<IUserData>(BASE_URL + API_URLS.USER_ROUTE, data);

      if (response.status === 200) {
        setUserNotes(prevNotes => [
          ...prevNotes,
          { type: inputValues, createDate: getDate(), fileName: currentFile ?? '', title: noteTitle },
        ]);
        setNoteTitle('');
        handleModalResponse(FormResponseTexts.SUCCESS_NOTE, FormResponseTypes.SUCCESS);
        initialInputValues();
      }
    } catch (error) {
      handleModalResponse(FormResponseTexts.ERROR, FormResponseTypes.ERROR);
    } finally {
      setLoading(false);
    }
  };

  /**************************************************************
                         Markup
  **************************************************************/

  return (
    <>
      <h3 id="form" className="scroll-mb-[25rem] font-bold text-gray-800 text-lg border-b-2 border-gray-200">
        Save Notification
      </h3>
      {/* form */}
      <form className="sheetscanner-notification-form mt-2" onSubmit={handleNotesSubmit} onReset={resetForm}>
        <div
          key={'title'}
          className={settings.animations ? 'sheetscanner-input-row flex items-center mb-4' : 'flex items-center mb-4'}
        >
          <label className="text-left flex text-gray-800 font-bold mr-2 min-w-[150px]" htmlFor={'title'}>
            {'Title'}: (required)
          </label>
          <input
            className="w-full shadow"
            type="text"
            id={'title'}
            name={'title'}
            value={noteTitle || ''}
            onChange={handleTitleChange}
          />
        </div>
        <div className="overflow-auto max-h-screen flex flex-col gap-4">
          {Object.keys(excelData[0] || {}).map(propertyKey => (
            <div
              key={propertyKey}
              className={settings.animations ? 'sheetscanner-input-row flex items-center' : 'flex items-center'}
            >
              <label className="text-left flex text-gray-800 font-bold mr-2 min-w-[150px]" htmlFor={propertyKey}>
                {propertyKey}:
              </label>
              <input
                className="w-full shadow"
                type="text"
                id={propertyKey}
                name={propertyKey}
                value={inputValues[propertyKey] || ''}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <textarea
            className="shadow p-2"
            rows={8}
            name="note"
            id="note"
            placeholder="Is there something you would like to add? Write an optional note here!"
            value={inputValues.note || ''}
            onChange={handleInputChange}
          ></textarea>
          {loading && (
            <div className="flex justify-center">
              <span className="sheetscanner-loader w-12 h-12 rounded-full border-t-4 border-b-gray-300 border-4 border-green-600"></span>
            </div>
          )}
        </div>
        {/* Loader */}
        {loading && (
          <div className="fixed w-screen h-screen z-50 text-4xl pb-72 items-center justify-center flex flex-col gap-2">
            <span className="sheetscanner-loader w-12 h-12 rounded-full border-t-4 border-b-gray-300 border-4  border-green-600"></span>
          </div>
        )}
        {/* form buttons */}
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="sheetScanner-standard-link bg-yellow-600 rounded text-gray-800 hover:text-gray-50"
            type="reset"
          >
            Reset form
          </button>
          <button
            className={`rounded sheetScanner-standard-link ${
              excelData.length < 1 ? 'bg-gray-400 text-gray-600' : 'bg-green-600 text-white'
            }`}
            disabled={excelData.length < 1}
            type="submit"
          >
            Submit form
          </button>
        </div>
      </form>
    </>
  );
};

export default NotificationForm;
