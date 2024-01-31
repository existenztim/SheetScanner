import connectMongoDB from '@/app/libs/mongoDB';
import { INote } from '@/app/models/interfaces/INote';
import MongooseUser from '@/app/models/schemas/userSchema';
import { User } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';
import { NotesResponse } from '../../route';

interface fetchNoteRequestedBody {
  user: User | null;
  noteId: string;
}

interface updateNoteRequestedBody {
  user: User | null;
  note: INote;
}

export interface NoteResponse {
  note?: INote;
  message?: string;
}

/****************************POST**************************/
//Collect one user note.
export async function POST(req: NextRequest): Promise<NextResponse<NoteResponse>> {
  try {
    await connectMongoDB();
    const { user, noteId }: fetchNoteRequestedBody = await req.json();
    if (!user) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
    const existingUser = await MongooseUser.findOne({ 'user.uid': user.uid });
    const matchingNote = existingUser.notes.find((userNote: INote) => userNote._id == noteId);
    if (matchingNote) {
      return NextResponse.json({ note: matchingNote }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Note not found for the user' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

/****************************PUT**************************/
//Updates a specific note for the given user.
export async function PUT(req: NextRequest): Promise<NextResponse<NotesResponse>> {
  try {
    await connectMongoDB();
    const { user, note }: updateNoteRequestedBody = await req.json();
    if (!user) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
    const existingUser = await MongooseUser.findOne({ 'user.uid': user.uid });
    const noteIndex = existingUser.notes.findIndex((userNote: INote) => userNote._id == note._id);
    if (noteIndex !== -1) {
      existingUser.notes[noteIndex] = note;
    } else {
      return NextResponse.json({ message: 'Note not found for the user' }, { status: 404 });
    }
    await existingUser.save();
    return NextResponse.json({ notes: existingUser.notes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

/****************************DELETE**************************/
//Delete a specific note for the given user.
export async function DELETE(req: NextRequest): Promise<NextResponse<NotesResponse>> {
  try {
    await connectMongoDB();
    const { user, noteId }: fetchNoteRequestedBody = await req.json();
    if (!user) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
    const existingUser = await MongooseUser.findOne({ 'user.uid': user.uid });
    const noteIndex = existingUser.notes.findIndex((userNote: INote) => userNote._id == noteId);

    if (noteIndex !== -1) {
      existingUser.notes.splice(noteIndex, 1);
      await existingUser.save();
      return NextResponse.json({ notes: existingUser.notes }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Note not found for the user' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
