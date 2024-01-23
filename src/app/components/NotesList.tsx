'use client';
import { GlobalContext } from './ParentProvider';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URLS } from '../models/ApiRoutes';
import { INote } from '../models/interfaces/INote';

const NotesList = () => {
  const { user, notes, BASE_URL, settings } = GlobalContext();
  const [noteList, setNoteList] = useState<INote[]>(notes);
  // We cant use only the global context (notes here) because it will not have the updated DB id for each note
  //can man använda roter.refresh ist?
  useEffect(() => {
    const fetchLatestNotes = async () => {
      const data = {
        user: user,
      };

      try {
        const response = await axios.post<INote[]>(BASE_URL + API_URLS.NOTE_ROUTE, data);
        if (response.status === 200) {
          setNoteList(response.data);
        }
      } catch (error) {
        console.log('postToDatabase', error);
      }
    };
    fetchLatestNotes();
  }, [BASE_URL, user]);

  return (
    <div
      className={
        settings.animations
          ? 'fadein mt-[-50px] min-h-[80vh] xl:flex-col max-w-[1500px] justify-center text-center items-center mx-auto px-4'
          : 'mt-[-50px] min-h-[80vh] xl:flex-col max-w-[1500px] justify-center text-center items-center mx-auto'
      }
    >
      {notes.length === 0 ? <p>Nothing to show.</p> : <p>You have {notes.length} notes</p>}
    </div>
  );
};

export default NotesList;
