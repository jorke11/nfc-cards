'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileUrlsProps {
  username?: string;
  uniqueId: string;
  baseUrl: string;
}

export function ProfileUrls({ username, uniqueId, baseUrl }: ProfileUrlsProps) {
  const urls = [
    ...(username ? [{
      label: 'Custom Username URL',
      url: `${baseUrl}/${username}`,
      description: 'Your personalized profile link',
    }] : []),
    {
      label: 'Unique ID URL',
      url: `${baseUrl}/${uniqueId}`,
      description: 'Your permanent profile link',
    },
    {
      label: 'NFC URL',
      url: `${baseUrl}/${uniqueId}?source=nfc`,
      description: 'Link programmed to your NFC card',
    },
  ];

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleOpen = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile URLs</CardTitle>
        <CardDescription>
          Your profile is accessible from these URLs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {urls.map((item) => (
          <div
            key={item.label}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border bg-muted/50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground truncate">
                {item.url}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(item.url)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpen(item.url)}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
