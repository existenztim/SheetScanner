'use client';
//Libraries
import { ChangeEvent, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
//Icons
import { MdKeyboardReturn, MdDelete, MdOutlineSave, MdEdit, MdLock } from 'react-icons/md';
//Components
import { GlobalContext } from './ParentProvider';
import AlertModal from './AlertModal';
//Utils
import { cutLongStrings, getDate, removeBlankSpace } from '../utils/stringManipulation';
//Models
import { INote } from '../models/interfaces/INote';
import { API_URLS } from '../models/ApiRoutes';
import { FormResponseTexts, FormResponseTypes } from '../models/enums/EFormResponse';
import { NoteResponse } from '../api/notes/[userId]/[id]/route';
import { NotesResponse } from '../api/notes/route';
import { EnoteKeys } from '../models/enums/ENoteKeys';
//Hooks
import useModal from '../hooks/useModal';

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
  const pathname = usePathname();
  const { user, settings, BASE_URL, setUserNotes } = GlobalContext();
  const id = pathname.split('/').pop();
  const displayName = removeBlankSpace(user?.displayName);
  const [note, setNote] = useState<INote>(defaultNote);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<InputValues>();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [redirectAfterDelete, setRedirectAfterDelete] = useState(false);
  const { modal, handleModalResponse } = useModal();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (BASE_URL && user && id && displayName) {
          await fetchCurrentNote();
        }
      } catch (error) {
        handleModalResponse(FormResponseTexts.ERROR, FormResponseTypes.ERROR);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [BASE_URL, user, id, displayName]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name == 'title') return setNote(prevNoteValues => ({ ...prevNoteValues, title: value }));

    setInputValues(prevInputValues => ({
      ...prevInputValues,
      [name]: value,
    }));
    return setNote(prevNote => ({
      ...prevNote,
      type: {
        ...inputValues,
        [name]: value,
      },
    }));
  };

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSaveNote = () => {
    handleEditMode();
    handleSaveUpdatedNote();
  };

  const InitConfirmDeleteNote = () => {
    setConfirmDelete(true);
  };

  const cancelDeleteNote = () => {
    setConfirmDelete(false);
  };

  /**************************************************************
                         API calls
  **************************************************************/

  const fetchCurrentNote = async () => {
    const data = {
      user: user,
      noteId: id,
    };
    setLoading(true);
    try {
      const response = await axios.post<NoteResponse>(`${BASE_URL}${API_URLS.NOTE_ROUTE}/${displayName}/${id}`, data);
      if (response.status === 200 && response.data.note) {
        setNote(response.data.note);
        setInputValues(response.data.note.type);
      }
    } catch (error) {
      handleModalResponse(FormResponseTexts.ERROR, FormResponseTypes.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUpdatedNote = async () => {
    if (note.title.length < 3) {
      return handleModalResponse(FormResponseTexts.WRONG_INPUT, FormResponseTypes.INFORMATION);
    }
    const data = {
      user: user,
      note: {
        ...note,
        lastUpdated: getDate(),
      },
    };
    setLoading(true);
    try {
      const response = await axios.put<NotesResponse>(`${BASE_URL}${API_URLS.NOTE_ROUTE}/${displayName}/${id}`, data);
      if (response.status === 200 && response.data.notes) {
        setUserNotes(response.data.notes);
        handleModalResponse(FormResponseTexts.SUCCESS_NOTE, FormResponseTypes.SUCCESS);
        fetchCurrentNote();
      }
    } catch (error) {
      handleModalResponse(FormResponseTexts.ERROR, FormResponseTypes.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async () => {
    const config = {
      data: {
        user: user,
        noteId: note._id,
      },
    };
    setLoading(true);
    try {
      const response = await axios.delete<NotesResponse>(
        `${BASE_URL}${API_URLS.NOTE_ROUTE}/${displayName}/${id}`,
        config
      );
      if (response.status === 200 && response.data.notes) {
        setUserNotes(response.data.notes);
        setRedirectAfterDelete(true);
      }
    } catch (error) {
      handleModalResponse(FormResponseTexts.ERROR, FormResponseTypes.ERROR);
      setConfirmDelete(false);
    } finally {
      setLoading(false);
    }
  };

  /**************************************************************
                         Markup
  **************************************************************/

  return (
    <>
      {note._id && (
        <>
          {/* Top Section */}
          <section
            className={`${editMode && settings.animations ? 'sheetscanner-highlighted ' : ''}${
              !editMode
                ? 'bg-slate-200 z-10 fixed top-14 w-screen p-1 text-gray-800 font-bold'
                : 'bg-green-600 z-10 fixed top-14 w-screen p-1 text-gray-800 font-bold'
            }`}
          >
            <div className="flex items-center justify-center relative">
              <Link
                className="absolute left-0 flex gap-2 items-center rounded bg-yellow-600 px-2 text-gray-800 hover:text-gray-50"
                href={`/notes/${displayName}`}
              >
                <MdKeyboardReturn />
                Return
              </Link>
              <p className="text-center">{!editMode ? 'View-mode' : 'Edit-mode'}</p>
            </div>
          </section>
          {/* Main Content Section */}
          <section
            className={`${
              settings.animations && 'sheetscanner-fadein'
            }xl:flex-col max-w-[1500px] min-h-[calc(100vh-13rem)] justify-center text-center items-center mx-auto p-4 border border-gray-300 rounded-lg bg-slate-50 mb-32`}
          >
            {' '}
            <div className="flex bg-slate-200 border-2 border-gray-400 p-2 rounded-md mb-4 gap-2 justify-start flex-col items-centers w-full flex-wrap lg:justify-evenly lg:flex-row">
              <p className="text-left flex text-gray-800 font-bold gap-2">
                Created: <span className="font-normal">{note.createDate}</span>
              </p>
              <p className="text-left flex text-gray-800 font-bold gap-2">
                Last updated: <span className="font-normal"> {note.lastUpdated ? note.lastUpdated : '-'}</span>
              </p>
              <p className="text-left flex text-gray-800 font-bold gap-2">
                File name:{' '}
                <span className="font-normal">
                  {' '}
                  {note.fileName?.length ? cutLongStrings(note.fileName, 24) : note.fileName ?? 'Default Value'}
                </span>
              </p>
            </div>
            {/* Form Section */}
            <form className="sheetscanner-notification-form flex gap-2 flex-col">
              <div className={settings.animations ? 'sheetscanner-input-row flex items-center' : 'flex items-center'}>
                <label className="text-left flex text-gray-800 font-bold mr-2 min-w-[150px]" htmlFor="title">
                  Title:
                </label>
                <input
                  className="w-full shadow text-green-600 font-bold disabled:text-gray-500 disabled:font-normal disabled:hover:cursor-not-allowed"
                  id="title"
                  name="title"
                  value={note.title}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </div>
              {/* Other Inputs */}
              {Object.keys(inputValues || {}).map(propertyKey => (
                <div
                  key={propertyKey}
                  className={
                    settings.animations
                      ? 'sheetscanner-input-row flex items-start flex-col md:flex-row md:items-center'
                      : 'flex items-center'
                  }
                >
                  <label className="text-left flex text-gray-800 font-bold mr-2 min-w-[150px]" htmlFor={propertyKey}>
                    {propertyKey === EnoteKeys.Comment ? 'Comment' : propertyKey}:
                  </label>

                  {propertyKey.toLowerCase() === EnoteKeys.Comment.toLowerCase() ? (
                    <textarea
                      className="w-full shadow text-green-600 font-bold disabled:text-gray-500 disabled:font-normal disabled:hover:cursor-not-allowed"
                      id={propertyKey}
                      name={propertyKey}
                      value={(inputValues && inputValues[propertyKey]) || ''}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  ) : (
                    <input
                      className="w-full shadow text-green-600 font-bold disabled:text-gray-500 disabled:font-normal disabled:hover:cursor-not-allowed"
                      type="text"
                      id={propertyKey}
                      name={propertyKey}
                      value={(inputValues && inputValues[propertyKey]) || ''}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  )}
                </div>
              ))}
            </form>
          </section>
        </>
      )}
      {/* Loader */}
      {loading && (
        <div className="fixed w-screen h-screen z-50 text-4xl pb-72 items-center justify-center flex flex-col gap-2">
          <span className="sheetscanner-loader w-12 h-12 rounded-full border-t-4 border-b-gray-300 border-4  border-green-600"></span>
        </div>
      )}
      {/* Confirm Delete Section */}
      {confirmDelete && (
        <div className="flex items-center justify-center h-screen w-screen fixed top-14 z-40 bg-slate-100 bg-opacity-50">
          <div className="w-96 p-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col items-stretch justify-center">
              {loading && (
                <h4 className="font-bold text-lg w-full border-b border-grey-500 text-yellow-600">Processing</h4>
              )}

              {!loading && redirectAfterDelete && (
                <h4 className="font-bold text-lg w-full border-b border-grey-500 text-green-600">Success</h4>
              )}

              {!loading && !redirectAfterDelete && (
                <h4 className="font-bold text-lg w-full border-b border-grey-500 text-red-600">Warning!</h4>
              )}

              {loading ? (
                <div className="w-full mt-2 flex justify-center items-center">
                  <span className="sheetscanner-loader text-gray-950 z-50 w-12 h-12 rounded-full border-t-4 border-b-gray-300 border-4 border-green-600"></span>
                </div>
              ) : (
                <p className="mt-4">
                  {redirectAfterDelete
                    ? 'Your note has been deleted.'
                    : 'Please be advised that performing this action will permanently delete the note. Are you sure you want to proceed?'}
                </p>
              )}
            </div>

            <div className="mt-4 flex space-x-4 justify-end">
              {redirectAfterDelete ? (
                <Link
                  className="sheetScanner-standard-link flex gap-2 items-center rounded bg-yellow-600 w-32 mx-auto text-gray-800 hover:text-gray-50"
                  href={`/notes/${displayName}`}
                >
                  <MdKeyboardReturn />
                  Return
                </Link>
              ) : (
                <>
                  <button
                    className="sheetScanner-standard-link bg-yellow-600 rounded text-gray-800 py-2 hover:text-gray-50"
                    onClick={cancelDeleteNote}
                  >
                    Cancel
                  </button>
                  <button
                    className="sheetScanner-standard-link sheetScanner-hover bg-red-600 rounded text-white py-2"
                    onClick={handleDeleteNote}
                  >
                    Confirm
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Bottom Action Section */}
      <section className="fixed w-full bottom-0 border-y-2 border-slate-200 left-1/2 transform -translate-x-1/2 flex flex-row items-center flex-wrap gap-2 justify-center bg-slate-100 py-4">
        <button
          className={`${
            !note._id || modal.message
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : ' sheetScanner-hover bg-green-700 text-slate-50'
          } sheetScanner-standard-link rounded w-32 flex gap-2 justify-center items-center`}
          onClick={handleEditMode}
          disabled={!note._id || !!modal.message}
        >
          {!editMode ? (
            <>
              Edit <MdEdit />
            </>
          ) : (
            <>
              View <MdLock />
            </>
          )}
        </button>
        <button
          className={`${
            !note._id || modal.message || !editMode
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : ' sheetScanner-hover bg-green-700 text-slate-50'
          } sheetScanner-standard-link rounded w-32 flex gap-2 justify-center items-center`}
          onClick={handleSaveNote}
          disabled={!note._id || !!modal.message || !editMode}
        >
          Save <MdOutlineSave />
        </button>
        <button
          className={`${
            !note._id || modal.message
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : ' sheetScanner-hover bg-red-600 text-slate-50'
          } sheetScanner-standard-link rounded w-32 flex gap-2 justify-center items-center`}
          onClick={InitConfirmDeleteNote}
          disabled={!note._id || !!modal.message}
        >
          Delete <MdDelete />
        </button>
      </section>
      {/* Alert Modal */}
      {modal.message && (
        <AlertModal modal={modal} closeAlertModal={() => handleModalResponse('', FormResponseTypes.ERROR)} />
      )}
    </>
  );
};

export default NoteEditor;
