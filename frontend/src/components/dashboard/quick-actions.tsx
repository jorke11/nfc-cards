'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, BarChart3, Share2, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface QuickActionsProps {
  profileUrl: string;
}

export function QuickActions({ profileUrl }: QuickActionsProps) {
  const router = useRouter();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Digital Profile',
          text: 'Check out my digital profile!',
          url: profileUrl,
        });
        toast.success('Shared successfully');
      } catch (error) {
        // User cancelled or share failed
        if ((error as Error).name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const actions = [
    {
      title: 'Edit Profile',
      description: 'Update your information',
      icon: Edit,
      onClick: () => router.push('/dashboard/profile'),
      variant: 'default' as const,
    },
    {
      title: 'View Analytics',
      description: 'See your profile stats',
      icon: BarChart3,
      onClick: () => router.push('/dashboard/analytics'),
      variant: 'outline' as const,
    },
    {
      title: 'Share Profile',
      description: 'Share with others',
      icon: Share2,
      onClick: handleShare,
      variant: 'outline' as const,
    },
    {
      title: 'Copy Link',
      description: 'Copy profile URL',
      icon: Copy,
      onClick: handleCopyLink,
      variant: 'outline' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Manage your profile and share with others
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant={action.variant}
                className="h-auto flex-col items-start p-4 gap-2"
                onClick={action.onClick}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-5 w-5" />
                  <span className="font-semibold">{action.title}</span>
                </div>
                <span className="text-xs text-muted-foreground font-normal">
                  {action.description}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
