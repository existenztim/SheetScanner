'use client';
//Libraries
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
//Components
import { GlobalContext } from './ParentProvider';
import AlertModal from './AlertModal';
import AuthenticationToggle from './AuthenticationToggle';
//Models
import { Imodal } from '../models/interfaces/IModal';
import { FormResponseTexts, FormResponseTypes } from '../models/enums/EFormResponse';
import { IUserData } from '../models/interfaces/IUser';
import { API_URLS } from '../models/ApiRoutes';
import { ISettings } from '../models/interfaces/ISettings';
import { UserResponse } from '../api/user/route';

interface SettingsformProps {
  handleMenuToggle: () => void;
}

const SettingsForm = ({ handleMenuToggle }: SettingsformProps) => {
  const { user, settings, notes, BASE_URL, setUserSettings } = GlobalContext();
  const [modal, setModal] = useState<Imodal>({
    message: '',
    type: FormResponseTypes.ERROR,
  });
  const [tempSettings, setTempSettings] = useState<ISettings>({
    instances: settings.instances,
    itemsToRender: settings.itemsToRender,
    showForm: settings.showForm,
    showMatchingString: settings.showMatchingString,
    animations: settings.animations,
    autoFill: settings.autoFill,
  });

  useEffect(() => {
    getUserSettings();
  }, [user, settings]);

  const HandleSettings = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    const rangeValue = +e.target.value;

    setTempSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        [id]: rangeValue ? rangeValue : checked,
      };
      return updatedSettings;
    });
  };

  const handleModalResponse = (message: string, type: string, closeMenu: boolean) => {
    setModal({
      message: message,
      type: type,
    });
    if (closeMenu) return handleMenuToggle();
  };

  /**************************************************************
                         API calls
  **************************************************************/

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
      const response = await axios.post<UserResponse>(BASE_URL + API_URLS.USER_ROUTE, data);
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('user', data.user?.displayName || 'guest');
      } else {
        handleModalResponse(FormResponseTexts.SIGNIN_FAILURE, FormResponseTypes.ERROR, false);
      }
    } catch (error) {
      handleModalResponse(FormResponseTexts.ERROR, FormResponseTypes.ERROR, false);
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
        const response = await axios.put<UserResponse>(BASE_URL + API_URLS.USER_ROUTE, data);
        if (response.status === 200 && response.data.user) {
          setUserSettings(response.data.user.settings);
          handleModalResponse(FormResponseTexts.SUCCESS_SETTINGS, FormResponseTypes.SUCCESS, false);
        }
      } catch (error) {
        handleModalResponse(FormResponseTexts.ERROR, FormResponseTypes.ERROR, false);
      }
    }
    setUserSettings(tempSettings);
  };

  /**************************************************************
                         Markup
 **************************************************************/

  return (
    <>
      <div
        className={
          settings.animations
            ? 'sheetscanner-fadeinFromTop rounded-md fixed z-40 top-14 right-1 flex flex-col justify-center items-center bg-green-800 max-w-md w-full p-4 shadow-md border-t-2 border-gray-200'
            : 'rounded-md fixed z-40 top-14 right-1 flex flex-col justify-center items-center bg-green-800 max-w-md w-full p-4 shadow-md border-t-2 border-gray-200'
        }
      >
        <div className="settings-list flex flex-col p-2 gap-2 justify-start w-full">
          <p className="font-bold text-lg w-full border-b border-grey-500">
            Welcome: <span>{user ? user.displayName : 'guest'}</span>
          </p>
          <div className="flex flex-row gap-2">
            {user ? 'Logout:' : 'Sign in:'}
            <div className=" bg-green-600 p-0 rounded-md">
              {' '}
              <AuthenticationToggle />
            </div>
          </div>
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
            <div className="flex items-center gap-2 border-b border-grey-500">
              <label htmlFor="itemsToRender">Maximum hits to render:</label>
              <input
                type="range"
                id="itemsToRender"
                name="itemsToRender"
                min={1}
                max={50}
                value={tempSettings.itemsToRender}
                onChange={HandleSettings}
              />
              <output>{tempSettings.itemsToRender}</output>
            </div>
            <div className="flex gap-2">
              <label className="w-28" htmlFor="showForm">
                Show form:
              </label>
              <input
                type="checkbox"
                id="showForm"
                name="showForm"
                checked={tempSettings.showForm}
                onChange={HandleSettings}
              />
            </div>
            <div className="flex gap-2">
              <label className="w-28" htmlFor="autoFill">
                Autofill form:
              </label>
              <input
                type="checkbox"
                id="autoFill"
                name="autoFill"
                checked={tempSettings.autoFill}
                onChange={HandleSettings}
              />
            </div>

            <div className="flex gap-2">
              <label className="w-28" htmlFor="animations">
                Animations:
              </label>
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
            <button
              onClick={handleMenuToggle}
              className="sheetScanner-standard-link bg-yellow-600 text-gray-800 hover:text-gray-50 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="sheetScanner-standard-link sheetScanner-hover bg-green-700 rounded">
              Confirm
            </button>
          </div>
        </form>
      </div>
      {modal.message && (
        <AlertModal modal={modal} closeAlertModal={() => handleModalResponse('', FormResponseTypes.ERROR, true)} />
      )}
    </>
  );
};

export default SettingsForm;
