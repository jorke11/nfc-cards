'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from '@/lib/utils';
import { ProfileView } from '@/types';
import { Smartphone, Monitor, Tablet, Globe, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface RecentViewsTableProps {
  views: ProfileView[];
  isLoading?: boolean;
}

const DEVICE_ICONS = {
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
};

export function RecentViewsTable({ views, isLoading = false }: RecentViewsTableProps) {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!views || views.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            No views recorded yet
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedViews = showAll ? views : views.slice(0, 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Views</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Referrer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedViews.map((view) => (
                <TableRow key={view.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatDistanceToNow(new Date(view.viewedAt))}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(view.viewedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DeviceBadge device={view.deviceType} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span>{view.country || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {view.referrer ? (
                      <a
                        href={view.referrer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        {truncateUrl(view.referrer)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">Direct</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {displayedViews.map((view) => (
            <div
              key={view.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {formatDistanceToNow(new Date(view.viewedAt))}
                </span>
                <DeviceBadge device={view.deviceType} />
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(view.viewedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span>{view.country || 'Unknown'}</span>
              </div>
              {view.referrer && (
                <a
                  href={view.referrer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600"
                >
                  {truncateUrl(view.referrer)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {views.length > 20 && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show All (${views.length} views)`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DeviceBadge({ device }: { device: string }) {
  const Icon = DEVICE_ICONS[device.toLowerCase() as keyof typeof DEVICE_ICONS];

  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    mobile: 'default',
    desktop: 'secondary',
    tablet: 'outline',
  };

  return (
    <Badge variant={variants[device.toLowerCase()] || 'outline'}>
      <div className="flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        <span>{device}</span>
      </div>
    </Badge>
  );
}

function truncateUrl(url: string, maxLength: number = 30): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    return domain.length > maxLength ? domain.substring(0, maxLength) + '...' : domain;
  } catch {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  }
}
