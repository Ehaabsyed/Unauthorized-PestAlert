import twilio from 'twilio';

/**
 * Reusable Twilio utility for sending SMS messages.
 * This class is designed for backend usage only.
 */
export class TwilioService {
  private client: twilio.Twilio;
  private fromPhoneNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !phoneNumber) {
      throw new Error(
        'Missing Twilio configuration. Ensure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER are set in .env.local'
      );
    }

    this.client = twilio(accountSid, authToken);
    this.fromPhoneNumber = phoneNumber;
  }

  /**
   * Sends an SMS message to a specific phone number.
   * @param to - The recipient's phone number in E.164 format.
   * @param body - The message content.
   */
  async sendSms(to: string, body: string) {
    try {
      const message = await this.client.messages.create({
        body,
        from: this.fromPhoneNumber,
        to,
      });

      return {
        success: true,
        messageId: message.sid,
      };
    } catch (error: any) {
      console.error('Twilio Error:', error.message);
      return {
        success: false,
        error: error.message || 'Failed to send SMS',
      };
    }
  }
}

// Export a singleton instance
export const twilioService = new TwilioService();
