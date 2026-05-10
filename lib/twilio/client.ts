import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

export const hasTwilioConfig = !!(accountSid && authToken && fromPhone);

// Lazy client — only created when env vars are present, never throws at module load
let _twilioClient: ReturnType<typeof twilio> | null = null;
function getTwilioClient() {
  if (!hasTwilioConfig) return null;
  if (!_twilioClient) _twilioClient = twilio(accountSid!, authToken!);
  return _twilioClient;
}

export interface SendSmsParams {
  to: string;
  message: string;
}

export interface SmsResponse {
  success: boolean;
  sid?: string;
  error?: string;
}

export async function sendSms({ to, message }: SendSmsParams): Promise<SmsResponse> {
  const client = getTwilioClient();
  if (!client || !fromPhone) {
    const errorMessage = 'Twilio is not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER environment variables.';
    console.error('[Twilio]', errorMessage);
    return { success: false, error: errorMessage };
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: fromPhone,
      to: to,
    });

    console.log('[Twilio] SMS sent successfully. SID:', result.sid);
    return {
      success: true,
      sid: result.sid,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Twilio] SMS send failed:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function sendBulkSms(
  phoneNumbers: string[],
  message: string
): Promise<SmsResponse[]> {
  return Promise.all(
    phoneNumbers.map((to) => sendSms({ to, message }))
  );
}
