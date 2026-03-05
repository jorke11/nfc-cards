import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Authentication - NFC Digital Profile',
  description: 'Sign in or create your NFC Digital Profile account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            NFC Digital Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Your professional identity, digitally
          </p>
        </div>
        <Card className="p-6 shadow-xl">
          {children}
        </Card>
      </div>
    </div>
  );
}
