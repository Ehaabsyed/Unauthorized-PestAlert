import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useSmsNotification } from '@/hooks/use-sms-notification';

interface SmsNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertTitle?: string;
  alertDescription?: string;
}

export function SmsNotificationModal({
  isOpen,
  onClose,
  alertTitle = 'Emergency Alert',
  alertDescription = 'Broadcasting emergency alert to farmers',
}: SmsNotificationModalProps) {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);
  const { sendNotification, loading, error, result } = useSmsNotification();

  const defaultMessage = `[AGRONOVA ALERT] ${alertTitle}: Immediate action required. Check the dashboard for details.`;

  const handleSend = async () => {
    if (!phoneNumbers.trim()) {
      alert('Please enter at least one phone number');
      return;
    }

    const numbers = phoneNumbers
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (numbers.length === 0) {
      alert('Please enter valid phone numbers');
      return;
    }

    const message = useTemplate ? defaultMessage : customMessage;

    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    await sendNotification({
      bulkPhoneNumbers: numbers,
      message,
    });
  };

  const handleClose = () => {
    if (!loading) {
      setPhoneNumbers('');
      setCustomMessage('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-100">Send SMS Alert</h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-1 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Success State */}
            {result?.success && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 mb-4 flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-400">SMS sent successfully!</p>
                  <p className="text-xs text-emerald-300">
                    {result.sent}/{result.total} messages delivered
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-400">Failed to send SMS</p>
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              </motion.div>
            )}

            {!result?.success && (
              <>
                {/* Phone Numbers Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Numbers (comma-separated)
                  </label>
                  <textarea
                    value={phoneNumbers}
                    onChange={(e) => setPhoneNumbers(e.target.value)}
                    disabled={loading}
                    placeholder="+1234567890, +1987654321, ..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none disabled:opacity-50 text-sm"
                    rows={3}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Enter phone numbers in E.164 format (e.g., +1234567890)
                  </p>
                </div>

                {/* Message Template Toggle */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      id="useTemplate"
                      checked={useTemplate}
                      onChange={(e) => setUseTemplate(e.target.checked)}
                      disabled={loading}
                      className="rounded cursor-pointer disabled:opacity-50"
                    />
                    <label htmlFor="useTemplate" className="text-sm font-medium text-slate-300 cursor-pointer">
                      Use template message
                    </label>
                  </div>
                </div>

                {/* Message Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {useTemplate ? 'Template Message' : 'Custom Message'}
                  </label>
                  <textarea
                    value={useTemplate ? defaultMessage : customMessage}
                    onChange={(e) => !useTemplate && setCustomMessage(e.target.value)}
                    disabled={loading || useTemplate}
                    placeholder="Enter your message..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none disabled:opacity-50 text-sm"
                    rows={4}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {useTemplate ? 'Template message based on alert' : 'Custom message'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={loading}
                    className="flex-1 px-4 py-2 rounded-lg bg-emerald-600/80 border border-emerald-500/50 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 font-medium text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send SMS
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Success Action */}
            {result?.success && (
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 rounded-lg bg-emerald-600/80 border border-emerald-500/50 text-white hover:bg-emerald-600 transition-colors font-medium text-sm"
              >
                Close
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
