import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Replace with your database connection


// Handle GET request to fetch video status by email
export async function GET(request) {
  try {
    // Extract `email` from query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email'); // Extract the user email from the URL

    if (!email) {
      // If the email is missing, return an error
      return new NextResponse(
        JSON.stringify({ success: false, error: 'User email is required' }),
        { status: 400 }
      );
    }

    // Query the database for the user with the given email
    const user = await db.user.findUnique({
      where: { email }, // Use email to find the user
      select: {
        video1: true,
        video2: true,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 404 }
      );
    }

    // Return the video statuses based on the user's video1 and video2 values
    const videoStatus = {
      video1Status: user.video1 ? 'Regarde' : 'Non Regarde',
      video2Status: user.video2 ? 'Regarde' : 'Non Regarde',
    };

    return new NextResponse(
      JSON.stringify({ success: true, videoStatus }), // Return the status as JSON
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching video status:', error);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

// Handle PATCH request to update video status by email
export async function PATCH(request) {
  try {
    // Parse the incoming JSON body
    const { email, video1, video2 } = await request.json();

    if (!email) {
      // If the email is missing, return an error
      return new NextResponse(
        JSON.stringify({ success: false, error: 'User email is required' }),
        { status: 400 }
      );
    }

    // Query the database and update the user's video status based on the provided email
    await db.user.update({
      where: { email }, // Use email to find and update the user
      data: {
        video1: video1 !== undefined ? video1 : undefined, // Update video1 if provided
        video2: video2 !== undefined ? video2 : undefined, // Update video2 if provided
      },
    });

    // Return a success message if the update was successful
    return new NextResponse(
      JSON.stringify({ success: true, message: 'Video status updated successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating video status:', error);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
