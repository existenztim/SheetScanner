// hämta alla notes för user
import connectMongoDB from '@/app/libs/mongoDB';
import { INote } from '@/app/models/interfaces/INote';
import MongooseUser from '@/app/models/schemas/userSchema';
import { User } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';
interface CreateUserRequestedBody {
  user: User | null;
  noteId: string;
}
//the following is only to get rid of vercel deployment error
export async function POST(req: NextRequest) {
    try {
      await connectMongoDB();
      const { user, noteId }: CreateUserRequestedBody = await req.json();
      return NextResponse.json({ message: user }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
  }
