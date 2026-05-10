import { NextRequest, NextResponse } from 'next/server';
import { twilioService } from '@/lib/twilio';

/**
 * API Route for sending SMS messages.
 * Only accessible via POST requests from the client.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, message } = body;

    // Basic validation
    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    // Attempt to send SMS
    const result = await twilioService.sendSms(phoneNumber, message);

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
