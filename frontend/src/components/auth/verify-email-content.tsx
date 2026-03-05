'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing. Please check your email link.');
        return;
      }

      try {
        await apiClient.auth.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } catch (error: any) {
        setStatus('error');
        const errorMessage = error.response?.data?.message || 'Failed to verify email';
        if (errorMessage.includes('expired')) {
          setMessage('This verification link has expired. Please request a new one.');
        } else if (errorMessage.includes('invalid')) {
          setMessage('This verification link is invalid. Please check your email.');
        } else if (errorMessage.includes('already verified')) {
          setMessage('Your email is already verified. You can sign in now.');
        } else {
          setMessage(errorMessage);
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg
              className="animate-spin w-6 h-6 text-blue-600 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Verifying your email</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Email verified!</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {message}
          </p>
        </div>

        <Link href="/login">
          <Button className="w-full">Continue to Sign In</Button>
        </Link>
      </div>
    );
  }

  // Error state
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Verification failed</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {message}
        </p>
      </div>

      <div className="flex gap-3">
        <Link href="/login" className="flex-1">
          <Button variant="outline" className="w-full">
            Back to Sign In
          </Button>
        </Link>
        <Link href="/register" className="flex-1">
          <Button className="w-full">Create New Account</Button>
        </Link>
      </div>
    </div>
  );
}
