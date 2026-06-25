import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      ...body,
      receivedAt: new Date().toISOString(),
      source: 'frontend-contact-form',
    };

    console.info('Contact form submission received', payload);

    return NextResponse.json({
      success: true,
      message: 'Message received successfully',
    });
  } catch (error) {
    console.error('Contact form submission failed', error);

    return NextResponse.json(
      { success: false, message: 'Unable to submit message right now' },
      { status: 500 }
    );
  }
}
