import connectMongoDB from '@/app/libs/mongoDB';
import { INote } from '@/app/models/interfaces/INote';
import MongooseUser from '@/app/models/schemas/userSchema';
import { User } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';

interface fetchNoteRequestedBody {
  user: User | null;
  noteId: string;
}

interface updateNoteRequestedBody {
  user: User | null;
  note: INote;
}

/**
 * Retrieves a specific note for the given user and note ID.
 * @param {NextRequest} req - The Next.js request object.
 * @returns {NextResponse} - Returns a Next.js response containing the requested note or a message togheter with a status code.
 */

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { user, noteId }: fetchNoteRequestedBody = await req.json();
    if (!user) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
    const existingUser = await MongooseUser.findOne({ 'user.uid': user.uid });
    const matchingNote = existingUser.notes.find((userNote: INote) => userNote._id == noteId);
    if (matchingNote) {
      return NextResponse.json(matchingNote, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Note not found for the user' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

/**
 * Updates a specific note for the given user.
 * @param {NextRequest} req - The Next.js request object.
 * @returns {NextResponse} - Returns a Next.js response containing the updated note or a message togheter with a status code.
 */

export async function PUT(req: NextRequest) {
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
    return NextResponse.json(existingUser.notes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

/**
 * Deletes a specific note for the given user.
 * @param {NextRequest} req - The Next.js request object.
 * @returns {NextResponse} - Returns a Next.js response containing the remaining notes or a message togheter with a status code.
 */

export async function DELETE(req: NextRequest) {
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
      return NextResponse.json(existingUser.notes, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Note not found for the user' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
