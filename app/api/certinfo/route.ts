import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { gotAttestation: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ gotAttestation: user.gotAttestation });
  } catch (error) {
    console.error('Error fetching attestation status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
      select: { gotAttestation: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db.user.update({
      where: { email },
      data: { gotAttestation: true },
    });

    return NextResponse.json({ gotAttestation: true });
  } catch (error) {
    console.error('Error updating attestation status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

