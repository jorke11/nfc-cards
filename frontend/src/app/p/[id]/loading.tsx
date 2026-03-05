import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6 sm:p-8 lg:p-10">
            {/* Avatar and Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <Skeleton className="h-32 w-32 rounded-full mb-4" />
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-6 w-48 mb-1" />
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-20 w-full max-w-xl mt-4" />
            </div>

            {/* Contact Section */}
            <div className="space-y-3 mb-6 mt-8">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>

            {/* Social Links */}
            <div className="space-y-4 mt-8">
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>

            {/* Share Button */}
            <div className="mt-8 flex justify-center">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
