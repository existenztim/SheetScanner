import connectMongoDB from '@/app/libs/mongoDB';
import { INote } from '@/app/models/interfaces/INote';
import { ISettings } from '@/app/models/interfaces/ISettings';
import { IUserData } from '@/app/models/interfaces/IUser';
import MongooseUser from '@/app/models/schemas/userSchema';
import { User } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';

interface CreateUserRequestedBody {
  user: User | null;
  settings: ISettings;
  notes: INote[];
}

export interface UserResponse {
  user?: IUserData;
  message?: string;
}

/****************************POST**************************/
//This function fetches the user in the request, or creates a new one.
export async function POST(req: NextRequest): Promise<NextResponse<UserResponse>> {
  try {
    await connectMongoDB();
    const { user, settings, notes }: CreateUserRequestedBody = await req.json();
    if (!user) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }

    const existingUser = await MongooseUser.findOne({ 'user.uid': user.uid });
    if (existingUser) {
      console.log(existingUser);
      return NextResponse.json({ user: existingUser }, { status: 200 });
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
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

/****************************PUT**************************/
//Update user
export async function PUT(req: NextRequest): Promise<NextResponse<UserResponse>> {
  try {
    await connectMongoDB();
    const { user, settings, notes }: CreateUserRequestedBody = await req.json();
    console.log('settings', settings);
    if (!user) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }

    const existingUser = await MongooseUser.findOne({ 'user.uid': user.uid });
    console.log('user', existingUser);
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    existingUser.settings = settings;
    existingUser.notes = notes;

    await existingUser.save();
    console.log('user after save', existingUser);
    return NextResponse.json({ user: existingUser }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
