import { useState } from 'react';
import { EnvelopeIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function EmailVerificationBanner({ onClose }) {
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/verification/resend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 transition"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <EnvelopeIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
            📧 Verify Your Email Address
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
            Please verify your email to unlock all features and ensure account security.
          </p>
          <button
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded-lg text-sm font-medium transition"
          >
            {isResending ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <EnvelopeIcon className="w-4 h-4" />
                Resend Verification Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
