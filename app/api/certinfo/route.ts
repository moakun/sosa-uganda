import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if email is provided
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Fetch the user from the database based on the email
    const user = await db.user.findUnique({
      where: { email },
      select: { gotAttestation: true },
    });

    // If the user doesn't exist, return an error
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the gotAttestation status to true
    await db.user.update({
      where: { email },
      data: { gotAttestation: true },
    });

    // Return the updated status in the response
    return NextResponse.json({ gotAttestation: true });
  } catch (error) {
    console.error('Error updating attestation status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
