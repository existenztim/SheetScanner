'use client';
//Libraries
import { ChangeEvent, useMemo, useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { GlobalContext } from './ParentProvider';
import Link from 'next/link';
import axios from 'axios';
//Components
import AlertModal from './AlertModal';
import CustomPagination from './CustomPagination';
//Utils
import { scanData } from '../utils/scanData';
import { cutLongStrings, removeBlankSpace } from '../utils/stringManipulation';
//Models
import { API_URLS } from '../models/ApiRoutes';
import { INote } from '../models/interfaces/INote';
import { FormResponseTexts, FormResponseTypes } from '../models/enums/EFormResponse';
import { Imodal } from '../models/interfaces/IModal';
import { NotesResponse } from '../api/notes/route';

const NotesList = () => {
  const { user, notes, BASE_URL, settings } = GlobalContext();
  const [searchTerms, setSearchTerms] = useState<string>('');
  const [noteList, setNoteList] = useState<INote[]>(notes);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Imodal>({
    message: '',
    type: FormResponseTypes.ERROR,
  });

  const notesPerPage = 10;

  const filteredData = useMemo(() => {
    return scanData(notes, searchTerms);
  }, [notes, searchTerms]);

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const arrayToMap = searchTerms ? filteredData : noteList;
  const currentNotes = arrayToMap.slice(indexOfFirstNote, indexOfLastNote);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (BASE_URL && user) {
          await fetchLatestNotes();
        }
      } catch (error) {
        handleModalResponse(FormResponseTexts.ERROR, FormResponseTypes.ERROR);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [BASE_URL, user]);

  const displayName = removeBlankSpace(user?.displayName);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerms('');
    setCurrentPage(1);
  };

  const handleModalResponse = (message: string, type: string) => {
    setModal({
      message: message,
      type: type,
    });
  };

  /**************************************************************
                         API calls
  **************************************************************/

  const fetchLatestNotes = async () => {
    const data = {
      user: user,
    };

    try {
      const response = await axios.post<NotesResponse>(`${BASE_URL}${API_URLS.NOTE_ROUTE}`, data);
      if (response.status === 200) {
        setNoteList(response.data.notes || []);
      }
    } catch (error) {
      handleModalResponse(FormResponseTexts.ERROR, FormResponseTypes.ERROR);
    }
  };

  /**************************************************************
                         Markup
  **************************************************************/

  return (
    <>
      <div className="bg-slate-50 bg-opacity-60 w-full min-h-[calc(100vh-3.5rem)]">
        {/* Loader */}
        {loading && (
          <div className="fixed w-screen h-screen z-50 text-4xl pb-72 items-center justify-center flex flex-col gap-2">
            <span className="sheetscanner-loader w-12 h-12 rounded-full border-t-4 border-b-gray-300 border-4  border-green-600"></span>
          </div>
        )}
        <div
          className={`${
            settings.animations && 'sheetscanner-fadein'
          } mt-[-50px] min-h-[80vh] xl:flex-col max-w-[1500px] justify-center text-center items-center mx-auto px-4 pb-3`}
        >
          <h2 className="font-bold text-gray-800 text-lg p-2">My Notes</h2>
          {/* Upper bar */}
          {user ? (
            <div className="flex gap-4 items-end flex-wrap ml-3">
              <label htmlFor="searchInput" className="flex items-start flex-col font-bold">
                <div className="flex items-center gap-2">
                  <span>Find note</span>
                </div>
                <input
                  className="max-w-xs"
                  id="searchInput"
                  type="text"
                  placeholder="Search"
                  value={searchTerms}
                  onChange={handleSearchInput}
                />
              </label>
              <button
                className="sheetScanner-standard-link bg-yellow-600 rounded text-gray-800 hover:text-gray-50"
                onClick={handleReset}
              >
                Clear
              </button>
              {/* upper pagination */}
              <div className="mt-4 flex justify-center mx-auto lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:top-28">
                <div className="flex justify-center">
                  <CustomPagination
                    currentPage={currentPage}
                    totalItems={arrayToMap.length}
                    itemsPerPage={notesPerPage}
                    paginate={paginate}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="flex justify-center items-center font-bold my-20 mx-0">
              You need to sign in to use this feature.
            </p>
          )}

          {arrayToMap.length === 0 && notes.length !== 0 && (
            <p
              className={`${
                settings.animations && 'sheetscanner-start-type'
              } flex justify-center items-center font-bold my-20 mx-0`}
            >
              No matches found.
            </p>
          )}
          {/* Note-list */}
          <ul className="flex flex-col gap-2 justify-center text-center mt-4">
            <TransitionGroup className="gap-2 flex flex-col">
              {currentNotes.map((note, index) => (
                <CSSTransition
                  key={index}
                  classNames={settings.animations ? 'sheetscanner-hit-container' : ''}
                  timeout={600}
                >
                  <li
                    className={
                      settings.animations
                        ? 'sheetScanner-note-links mx-3 gap-2 rounded-md shadow border-2 border-gray-400 odd:bg-gray-200 even:bg-gray-300'
                        : 'mx-3 gap-2 rounded-md shadow border-2 border-gray-400 odd:bg-gray-200 even:bg-gray-300'
                    }
                  >
                    <Link
                      className=""
                      href={`/notes/${displayName}/${note._id}`}
                      aria-label="View and edit this note."
                      scroll={false}
                    >
                      <div className="m-0 p-2 flex flex-wrap w-full justify-between px-10 text-slate-700 gap-2">
                        <div className="flex w-72">
                          <p>
                            <span className="font-bold">Title: </span>
                            {note.title && note.title.length > 27 ? cutLongStrings(note.title, 20) : note.title}
                          </p>
                        </div>
                        <div className="flex w-72">
                          <p>
                            <span className="font-bold">Created: </span>
                            {note.createDate}
                          </p>
                        </div>
                        <div className="flex w-72">
                          <p>
                            <span className="font-bold">Last updated: </span>
                            {note.lastUpdated ? note.lastUpdated : '-'}
                          </p>
                        </div>
                        <div className="flex w-96">
                          <p>
                            <span className="font-bold">File name: </span>
                            {note.fileName?.length
                              ? cutLongStrings(note.fileName, 20)
                              : note.fileName ?? 'Default Value'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                </CSSTransition>
              ))}
            </TransitionGroup>
            {/* Responses */}

            {user && !loading && notes.length === 0 && (
              <p className="flex justify-center items-center font-bold my-20 mx-0">Nothing to show.</p>
            )}
          </ul>
          {/* lower pagination */}
          <div className="mt-4">
            <CustomPagination
              currentPage={currentPage}
              totalItems={arrayToMap.length}
              itemsPerPage={notesPerPage}
              paginate={paginate}
            />
          </div>
        </div>
      </div>
      {modal.message && (
        <AlertModal modal={modal} closeAlertModal={() => handleModalResponse('', FormResponseTypes.ERROR)} />
      )}
    </>
  );
};

export default NotesList;
