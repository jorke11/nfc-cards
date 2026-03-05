'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Profile, AnalyticsSummary } from '@/types';
import { ProfileStats } from '@/components/dashboard/profile-stats';
import { QRCodeDisplay } from '@/components/dashboard/qr-code-display';
import { ProfileUrls } from '@/components/dashboard/profile-urls';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/p`
    : process.env.NEXT_PUBLIC_APP_URL + '/p';

  // Fetch user profile
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.profiles.getMyProfile();
      return response.data as Profile;
    },
    enabled: !!session,
  });

  // Fetch analytics
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await apiClient.analytics.getProfileAnalytics();
      return response.data as AnalyticsSummary;
    },
    enabled: !!session && !!profileData,
  });

  const profile = profileData;
  const analytics = analyticsData;

  const profileUrl = profile?.username
    ? `${baseUrl}/${profile.username}`
    : profile?.uniqueId
    ? `${baseUrl}/${profile.uniqueId}`
    : '';

  const isLoading = profileLoading || analyticsLoading;
  const hasError = profileError || analyticsError;

  // Error state
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Dashboard
            </CardTitle>
            <CardDescription>
              {profileError ? 'Failed to load your profile' : 'Failed to load analytics data'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {profileError && 'error' in profileError
                ? (profileError as any).response?.data?.message || 'An error occurred'
                : 'Please try again later'}
            </p>
            <Button
              onClick={() => {
                refetchProfile();
                refetchAnalytics();
              }}
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No profile state
  if (!isLoading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Create Your Profile
            </CardTitle>
            <CardDescription>
              You haven't created your digital profile yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by creating your profile and sharing it with the world!
            </p>
            <Button
              onClick={() => router.push('/dashboard/profile')}
              className="w-full"
            >
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile?.firstName || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your digital profile
        </p>
      </div>

      <Separator />

      {/* Profile Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
        <ProfileStats
          totalViews={analytics?.totalViews || 0}
          uniqueVisitors={analytics?.uniqueVisitors || 0}
          profileStatus={profile?.isEnabled || false}
          isLoading={isLoading}
        />
      </section>

      {/* QR Code and URLs Section */}
      <section className="grid gap-6 md:grid-cols-2">
        {profileUrl && (
          <QRCodeDisplay
            profileUrl={profileUrl}
            username={profile?.username}
          />
        )}
        {profile && (
          <ProfileUrls
            username={profile.username}
            uniqueId={profile.uniqueId}
            baseUrl={baseUrl}
          />
        )}
      </section>

      {/* Quick Actions */}
      <section>
        {profileUrl && <QuickActions profileUrl={profileUrl} />}
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <RecentActivity
          recentViews={analytics?.recentViews || []}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}
