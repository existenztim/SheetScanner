import connectMongoDB from '@/app/libs/mongoDB';
import MongooseUser from '@/app/models/schemas/userSchema';
import { User } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';

interface CreateUserRequestedBody {
  user: User | null;
}

/**
 * Retrieves all notes for a specific user based on the provided user data.
 * @param {NextRequest} req - The Next.js request object.
 * @returns {NextResponse} - Returns a Next.js response containing the user's notes or a message togheter with a status code.
 */

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { user }: CreateUserRequestedBody = await req.json();
    if (!user) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
    const existingUser = await MongooseUser.findOne({ 'user.uid': user.uid });

    if (existingUser) {
      return NextResponse.json(existingUser.notes, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
