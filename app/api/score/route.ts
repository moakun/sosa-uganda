import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data?.email || data.score === undefined) {
      return NextResponse.json(
        { message: 'Invalid input data or missing email/score' },
        { status: 400 }
      );
    }

    const validatedScore = Math.max(0, data.score);

    await db.user.update({
      where: { email: data.email },
      data: { score: validatedScore },
    });

    return NextResponse.json(
      { success: true, message: 'Score updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const userData = await db.user.findUnique({
      where: { email },
      select: { score: true },
    });

    if (!userData) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const score = userData.score !== null ? Math.max(0, userData.score) : null;

    // Always return success:true — score:null simply means first attempt
    return NextResponse.json(
      { success: true, userData: { score } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching score:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
