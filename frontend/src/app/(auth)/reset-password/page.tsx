import { Suspense } from 'react';
import { ResetPasswordContent } from '@/components/auth/reset-password-content';

function ResetPasswordFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Reset your password</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Please wait...
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

