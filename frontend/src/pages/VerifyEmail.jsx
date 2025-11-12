import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CodeBracketIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await axios.get(`${API_URL}/verification/verify/${token}`);
      
      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message);
        toast.success('Email verified successfully! 🎉');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      toast.error('Verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-dark-950">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-1.5 bg-gray-900 dark:bg-white rounded-lg">
              <CodeBracketIcon className="w-6 h-6 text-white dark:text-gray-900" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              CodeBattle
            </h1>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-white dark:bg-dark-900 rounded-lg shadow-sm border border-gray-200 dark:border-dark-800 p-8">
          <div className="text-center">
            {/* Verifying State */}
            {status === 'verifying' && (
              <>
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ArrowPathIcon className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Verifying Your Email
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {/* Success State */}
            {status === 'success' && (
              <>
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Email Verified! 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {message}
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Redirecting to login page in 3 seconds...
                  </p>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium transition"
                >
                  Go to Login Now
                </Link>
              </>
            )}

            {/* Error State */}
            {status === 'error' && (
              <>
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Verification Failed
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {message}
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    The verification link may have expired or is invalid.
                  </p>
                </div>
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full px-6 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium transition text-center"
                  >
                    Go to Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-6 py-2.5 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 text-gray-900 dark:text-white rounded-lg font-medium transition text-center"
                  >
                    Create New Account
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help?{' '}
            <a href="mailto:support@codebattle.com" className="text-gray-900 dark:text-white font-medium hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
