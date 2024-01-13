// specifik note route
import connectMongoDB from '@/app/libs/mongoDB';
import { INote } from '@/app/models/interfaces/INote';
import MongooseUser from '@/app/models/schemas/userSchema';
import { User } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';
// import useSWR from 'swr' kolla upp swr
interface CreateUserRequestedBody {
  user: User | null;
  noteId: string;
}

export function POST(req: NextRequest) {
    return null;
}
