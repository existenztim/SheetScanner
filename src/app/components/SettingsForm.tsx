'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { GlobalContext } from './ParentProvider';
import { ISettings } from '../models/interfaces/ISettings';
import axios from 'axios';
import { IUserData } from '../models/interfaces/IUser';
import { API_URLS } from '../models/ApiRoutes';
import AlertModal from './AlertModal';
import AuthenticationToggle from './AuthenticationToggle';

interface SettingsformProps {
  handleMenuToggle: () => void;
}
//lägga till auto copy into form?
const SettingsForm = ({ handleMenuToggle }: SettingsformProps) => {
  const { user, settings, notes, BASE_URL, setUserSettings } = GlobalContext();
  const [apiErrorResponse, setApiErrorResponse] = useState<string>('');
  const [tempSettings, setTempSettings] = useState<ISettings>({
    instances: settings.instances,
    showForm: settings.showForm,
    showMatchingString: settings.showMatchingString,
    animations: settings.animations,
    autoFill: settings.autoFill
  });

  const HandleSettings = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    const rangeValue = +e.target.value;
    if (rangeValue) {
      setTempSettings(prevSettings => ({
        ...prevSettings,
        instances: rangeValue,
      }));
    } else {
      setTempSettings(prevSettings => ({
        ...prevSettings,
        [id]: checked,
      }));
    }
  };
  
  const handleSettingsSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: IUserData = {
      user: user,
      settings: tempSettings,
      notes: notes,
    };
    if (user) {
      try {
        const response = await axios.put<IUserData>(BASE_URL + API_URLS.USER_ROUTE, data);
        setUserSettings(response.data.settings);
      } catch (error) {
        setApiErrorResponse('An error has occured, please try again.');
      }
    }
    setUserSettings(tempSettings);
    handleMenuToggle();
  };

  const resetAlertModal = () => {
    setApiErrorResponse('');   
  }

  useEffect(() => {
    const getUserSettings = async () => {
      if (!user) {
        return null;
      }
      const data: IUserData = {
        user: user,
        settings: settings,
        notes: [],
      };

      try {
        const response = await axios.post<IUserData>(BASE_URL + API_URLS.USER_ROUTE, data);      
        if (response.status === 200 || response.status === 201) {
          localStorage.setItem('user', data.user?.displayName || 'guest');
        } else {
          setApiErrorResponse('Could not sign in user, please try again.');
        }
      } catch (error) {
        setApiErrorResponse('An error has occured, please try again.');
      }
    };
    getUserSettings();
  }, [user, settings]);

  return (
    <>
    <div className={
      settings.animations
        ? 'sheetScanner-fadeInFromTop rounded-md fixed z-40 top-14 right-1 flex flex-col justify-center items-center bg-green-800 max-w-md w-full p-4 shadow-md border-t-2 border-gray-200'
        : 'rounded-md fixed z-40 top-14 right-1 flex flex-col justify-center items-center bg-green-800 max-w-md w-full p-4 shadow-md border-t-2 border-gray-200'
    }>
      <div className='settings-list flex flex-col p-2 gap-2 justify-start w-full'>
      <p className="font-bold text-lg w-full border-b border-grey-500">Welcome: <span>{user ? user.displayName : 'guest'}</span></p> 
        <div className='flex flex-row'>{user ? 'Logout:' : 'Sign in'}<AuthenticationToggle/></div>
      </div>
      <form onSubmit={handleSettingsSubmit}>
        <fieldset className="settings-list flex flex-col p-2 gap-2">
          <legend className="font-bold text-lg w-full border-b border-grey-500">Settings</legend>
          <div className="flex items-center gap-2">
            <label htmlFor="instances">Instances to display:</label>
            <input
              type="range"
              id="instances"
              name="instances"
              min={1}
              max={5}
              value={tempSettings.instances}
              onChange={HandleSettings}
            />
            <output>{tempSettings.instances}</output>
          </div>
          <div className="flex items-center gap-2  border-b border-grey-500">
            <label htmlFor="hits">Maximum hits to render:</label>
            <input type="range" id="hits" name="hits" min={1} max={50} value={50} />
            <output>{50}</output>
          </div>
          <div className="flex gap-2">
            <label htmlFor="showForm">Show form:</label>
            <input
              type="checkbox"
              id="showForm"
              name="showForm"
              checked={tempSettings.showForm}
              onChange={HandleSettings}
            />
          </div>
          <div className="flex gap-2">
            <label htmlFor="autoFill">Autofill form:</label>
            <input
              type="checkbox"
              id="autoFill"
              name="autoFill"
              checked={tempSettings.autoFill}
              onChange={HandleSettings}
            />
          </div>
          <div className="flex gap-2">
            <label htmlFor="showMatchingString">Show matching string indicator:</label>
            <input
              type="checkbox"
              id="showMatchingString"
              name="showMatchingString"
              checked={tempSettings.showMatchingString}
              onChange={HandleSettings}
            />
          </div>
          <div className="flex gap-2">
            <label htmlFor="animations">Animations:</label>
            <input
              type="checkbox"
              id="animations"
              name="animations"
              checked={tempSettings.animations}
              onChange={HandleSettings}
            />
          </div>
        </fieldset>
        <div className="flex gap-2 justify-end items-end w-full">
          <button onClick={handleMenuToggle} className="bg-yellow-600 rounded">
            Cancel
          </button>
          <button type="submit" className="bg-green-700 rounded">
            Confirm
          </button>
        </div>
      </form>
    </div>
     {apiErrorResponse && (
      <AlertModal errorMessage={apiErrorResponse} closeAlertModal={resetAlertModal} />
    )}
    </>
  );
};

export default SettingsForm;