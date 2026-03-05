import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="max-w-md w-full shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-red-50 rounded-full">
              <UserX className="h-16 w-16 text-red-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h1>

          <p className="text-gray-600 mb-6">
            This profile doesn't exist or has been disabled. Please check the URL
            and try again.
          </p>

          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full">Go to Home</Button>
            </Link>
            <p className="text-sm text-gray-500">
              Want to create your own digital profile?{' '}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
