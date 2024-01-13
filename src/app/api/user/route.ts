import connectMongoDB from '@/app/libs/mongoDB';
import { INote } from '@/app/models/interfaces/INote';
import { ISettings } from '@/app/models/interfaces/ISettings';
import MongooseUser from '@/app/models/schemas/userSchema';
import { User } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';

interface CreateUserRequestedBody {
  user: User | null;
  settings: ISettings;
  notes: INote[];
}

/****************************POST**************************/
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { user, settings, notes }: CreateUserRequestedBody = await req.json();
    if (!user) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }

    // Check if the user already exists in the database based on their UID
    const existingUser = await MongooseUser.findOne({ 'user.uid': user.uid });
    if (existingUser) {
      console.log(existingUser);
      return NextResponse.json(existingUser, { status: 200 });
    }

    // If the user doesn't exist, create a new user in the database
    const newUser = new MongooseUser({
      user: {
        uid: user.uid,
        displayName: user.displayName?.replace(/\s/g, ''), //for cleaner urls
      },
      settings,
      notes,
    });
    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

/****************************PUT**************************/
export async function PUT(req: NextRequest) {
  try {
    await connectMongoDB();
    const { user, settings, notes } = await req.json();
    console.log('notes', notes);
    if (!user) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }

    // Find the user based on their UID
    const existingUser = await MongooseUser.findOne({ 'user.uid': user.uid });
    console.log('user', existingUser);
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    // Update the user's settings and notes
    existingUser.settings = settings;
    existingUser.notes = notes;

    // Save the updated user
    await existingUser.save();
    console.log('user after save', existingUser);
    return NextResponse.json({ user: existingUser }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}