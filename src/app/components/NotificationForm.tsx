import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { GlobalContext } from './ParentProvider';
import { IUserData } from '../models/interfaces/IUser';
import { FormResponse } from '../models/enums/EFormResponse';
import axios from 'axios';
import { API_URLS } from '../models/ApiRoutes';
import { getDate } from '../utils/stringManipulation';
import { IKeyValuePairs } from '../models/interfaces/IKeyValuePairs';

interface InputValues {
  [propertyKey: string]: string;
}
interface NotificationFormProps {
  excelData: IKeyValuePairs[]; //ta bort och bara använd inputValues?
  currentFile: string | undefined;
}

const NotificationForm = ({ excelData, currentFile }: NotificationFormProps) => {
  const [inputValues, setInputValues] = useState<InputValues>({ note: '' });
  const [formResponse, setFormResponse] = useState<string>('');
  const [formResponseClass, setFormResponseClass] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, notes, settings, BASE_URL, clipboardValue, setUserNotes } = GlobalContext();

  // Fills in the initial input values based on changes in excelData (used for clipboard), does not affect title/comment
  const initialInputValues = () => {
    const setInitialInputValues: InputValues = {};
    excelData[0] &&
      Object.keys(excelData[0]).forEach(propertyKey => {
        setInitialInputValues[propertyKey] = '';
      });
    setInputValues({ ...setInitialInputValues, note: '' });
  };

  useEffect(() => {
    initialInputValues();
  }, [excelData]);

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

  useEffect(() => {
    if (formResponse) {
      setFormResponseClass(
        formResponse === FormResponse.SUCCESS
          ? 'sheetscanner-form-response p-4 text-sm text-green-400 rounded-lg bg-slate-200'
          : 'sheetscanner-form-response p-4 text-sm text-red-400 rounded-lg bg-slate-200 fade-out'
      );
      const timeoutId = setTimeout(() => {
        setFormResponseClass('');
      }, 5000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [formResponse]);

  const handleResponseReset = () => {
    setTimeout(() => {
      setFormResponse('');
    }, 5000);
  };

  const handleNotesSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setFormResponse(FormResponse.SIGNIN);
      handleResponseReset();
      return;
    }

    if (noteTitle.length < 3) {
      setFormResponse(FormResponse.WRONG_INPUT);
      handleResponseReset();
      return;
    }

    const data: IUserData = {
      user: user,
      settings: settings,
      notes: [...notes, { type: inputValues, createDate: getDate(), fileName: currentFile ?? '', title: noteTitle }],
    };

    setLoading(true);

    try {
      const response = await axios.put<IUserData>(BASE_URL + API_URLS.USER_ROUTE, data);

      if (response.status === 200) {
        setUserNotes(prevNotes => [
          ...prevNotes,
          { type: inputValues, createDate: getDate(), fileName: currentFile ?? '', title: noteTitle },
        ]);
        setNoteTitle('');
        setFormResponse(FormResponse.SUCCESS);
        initialInputValues();
        handleResponseReset();
      }
    } catch (error) {
      console.log(error);
      setFormResponse(FormResponse.ERROR);
    } finally {
      setLoading(false);
    }
  };

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
    setFormResponse('');
    setNoteTitle('');
  };

  return (
    <>
      <h3 id="form" className="scroll-mb-[25rem] font-bold text-gray-800 text-lg border-b-2 border-gray-200">Save Notification</h3>
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
            value={inputValues.note || ''} //istället för note gör unique random tal så kan man använda samma för title, för vad händer om note finns som header?
            onChange={handleInputChange}
          ></textarea>
          {loading && (
            <div className="flex justify-center">
              <span className="sheetscanner-loader w-12 h-12 rounded-full border-t-4 border-b-gray-300 border-4 border-green-600"></span>
            </div>
          )}

          {formResponse && formResponseClass && !loading && (
            <div
              className={settings.animations ? formResponseClass : 'text-sm p-4 rounded-lg bg-slate-200'}
              role="alert"
            >
              <span className="font-medium">{formResponse}</span>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button className="bg-yellow-600 rounded text-gray-800 hover:text-gray-50" type="reset">
            Reset form
          </button>
          <button
            className={`rounded ${excelData.length < 1 ? 'bg-gray-400 text-gray-600' : 'bg-green-600 text-white'}`}
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