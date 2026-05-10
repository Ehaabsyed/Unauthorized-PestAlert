import { NextRequest, NextResponse } from 'next/server';
import { sendSms, sendBulkSms, hasTwilioConfig } from '@/lib/twilio/client';

export async function GET() {
  return NextResponse.json({ configured: hasTwilioConfig });
}

export async function POST(request: NextRequest) {
  if (!hasTwilioConfig) {
    return NextResponse.json(
      { error: 'SMS is not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER to your environment variables.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { to, message, bulkPhoneNumbers } = body;

    // Validate request
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (bulkPhoneNumbers && Array.isArray(bulkPhoneNumbers)) {
      // Bulk SMS
      if (bulkPhoneNumbers.length === 0) {
        return NextResponse.json(
          { error: 'At least one phone number is required' },
          { status: 400 }
        );
      }

      const results = await sendBulkSms(bulkPhoneNumbers, message);
      const successful = results.filter((r) => r.success).length;

      return NextResponse.json(
        {
          success: true,
          bulk: true,
          sent: successful,
          total: results.length,
          results,
        },
        { status: 200 }
      );
    } else {
      // Single SMS
      if (!to || typeof to !== 'string') {
        return NextResponse.json(
          { error: 'Recipient phone number is required' },
          { status: 400 }
        );
      }

      const result = await sendSms({ to, message });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to send SMS' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          sid: result.sid,
          message: 'SMS sent successfully',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('[Twilio API] Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
