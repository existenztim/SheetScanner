import connectMongoDB from '@/app/libs/mongoDB';
import { INote } from '@/app/models/interfaces/INote';
import MongooseUser from '@/app/models/schemas/userSchema';
import { User } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';

interface CreateUserRequestedBody {
  user: User | null;
}

export interface NotesResponse {
  notes?: INote[];
  message?: string;
}

/****************************POST**************************/
//Collect ALL user notes.
export async function POST(req: NextRequest): Promise<NextResponse<NotesResponse>> {
  try {
    await connectMongoDB();
    const { user }: CreateUserRequestedBody = await req.json();
    if (!user) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
    const existingUser = await MongooseUser.findOne({ 'user.uid': user.uid });

    if (existingUser) {
      return NextResponse.json({ notes: existingUser.notes }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
