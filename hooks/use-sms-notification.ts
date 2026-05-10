import { useState } from 'react';

interface SendSmsParams {
  to?: string;
  message: string;
  bulkPhoneNumbers?: string[];
}

interface SmsResult {
  success: boolean;
  sent?: number;
  total?: number;
  error?: string;
  sid?: string;
}

export function useSmsNotification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SmsResult | null>(null);

  const sendNotification = async (params: SendSmsParams): Promise<SmsResult> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to send SMS notification';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      setResult(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Network error';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setResult(null);
  };

  return {
    sendNotification,
    loading,
    error,
    result,
    reset,
  };
}
